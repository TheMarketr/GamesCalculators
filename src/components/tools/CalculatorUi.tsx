import type { ComponentChildren } from 'preact';
import { getLabelIcon } from '../../utils/tool-icons';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ComponentChildren }) {
  return <label class="calc-field"><span><span class="calc-label-text"><span class="calc-label-icon" aria-hidden="true">{getLabelIcon(label)}</span>{label}</span>{hint && <small>{hint}</small>}</span>{children}</label>;
}
export function ResultMetric({ label, value, suffix, tone = 'default' }: { label: string; value: string | number; suffix?: string; tone?: 'default'|'good'|'warn'|'bad' }) {
  return <div class={`result-metric result-metric--${tone}`}><span class="result-metric__label"><span aria-hidden="true">{getLabelIcon(label)}</span>{label}</span><strong>{value}{suffix && <small>{suffix}</small>}</strong></div>;
}
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <fieldset class="segmented"><legend><span class="calc-label-icon" aria-hidden="true">{getLabelIcon(label)}</span>{label}</legend><div>{options.map((option) => <button type="button" class={value === option.value ? 'active' : ''} onClick={() => onChange(option.value)} aria-pressed={value === option.value}>{option.label}</button>)}</div></fieldset>;
}
export async function copyText(text: string) { await navigator.clipboard.writeText(text); }
export async function shareResult(title: string, text: string) {
  if (navigator.share) await navigator.share({ title, text, url: window.location.href });
  else await copyText(`${text} ${window.location.href}`);
}
