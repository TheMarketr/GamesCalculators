import { useMemo, useState } from 'preact/hooks';
import { ResultMetric, shareResult } from '../../../components/tools/CalculatorUi';
import { bloxFruits } from '../../../data/blox-fruits/items';
import type { SelectedValueItem } from '../../../data/types';
import { formatCompact } from '../../../utils/format';

export default function Calculator() {
  const [items, setItems] = useState<SelectedValueItem[]>([{ ...bloxFruits[0], quantity: 1 }]);
  const [choice, setChoice] = useState(bloxFruits[1].slug);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.value * item.quantity, 0), [items]);
  const permanentTotal = useMemo(() => items.reduce((sum, item) => sum + (item.permanentPrice ?? 0) * item.quantity, 0), [items]);
  return <div class="calculator">
    <div class="calculator-header"><div><span class="eyebrow">Complete 41-fruit dealer table</span><h2>Total fruit shop-price baselines</h2></div><button class="text-button" type="button" onClick={() => setItems([])}>Clear</button></div>
    <div class="item-picker item-picker--large"><select value={choice} onChange={(event) => setChoice((event.target as HTMLSelectElement).value)}>{bloxFruits.map((item) => <option value={item.slug}>{item.name} · {formatCompact(item.value)} Beli</option>)}</select><button type="button" onClick={() => { const item = bloxFruits.find((entry) => entry.slug === choice); if (item && !items.some((entry) => entry.slug === choice)) setItems([...items, { ...item, quantity: 1 }]); }}>+ Add fruit</button></div>
    <div class="value-list">{items.length ? items.map((item) => <div><span class="item-orb">{item.name.slice(0, 2).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.rarity} · {item.category} · permanent {item.permanentPrice?.toLocaleString()} Robux</small></span><input aria-label={`${item.name} quantity`} type="number" min="1" max="99" value={item.quantity} onInput={(event) => setItems(items.map((entry) => entry.slug === item.slug ? { ...entry, quantity: Number((event.target as HTMLInputElement).value) } : entry))}/><b>{formatCompact(item.value * item.quantity)}</b><button type="button" onClick={() => setItems(items.filter((entry) => entry.slug !== item.slug))} aria-label={`Remove ${item.name}`}>×</button></div>) : <div class="empty-state"><span>＋</span><strong>No fruits added</strong><small>Add fruits to calculate a dealer-price total.</small></div>}</div>
    <div class="primary-result"><span>Total dealer-price baseline</span><strong>{formatCompact(total)} <small>Beli</small></strong><p>{items.length} unique fruits selected</p></div>
    <div class="result-grid"><ResultMetric label="Permanent-price total" value={formatCompact(permanentTotal)} suffix=" Robux"/><ResultMetric label="Highest Beli item" value={items.length ? items.reduce((a, b) => a.value > b.value ? a : b).name : '—'}/></div>
    <div class="calculator-actions"><button type="button" class="button button--primary" onClick={() => shareResult('Blox Fruits dealer-price total', `My selected fruits total ${formatCompact(total)} Beli in dealer-price baselines.`)}>Share result</button></div>
    <p class="assumption-note">This totals developer-set Blox Fruits Dealer prices and permanent Robux prices; it does not claim those prices equal player-to-player trade value. <a href={bloxFruits[0].sourceUrl} target="_blank" rel="noreferrer">Price source</a>, reviewed {bloxFruits[0].updated}.</p>
  </div>;
}
