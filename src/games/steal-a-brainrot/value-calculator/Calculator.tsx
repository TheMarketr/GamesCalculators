import { useMemo, useState } from 'preact/hooks';
import { ResultMetric, shareResult } from '../../../components/tools/CalculatorUi';
import { brainrots } from '../../../data/steal-a-brainrot/items';
import type { SelectedValueItem } from '../../../data/types';
import { formatCompact } from '../../../utils/format';
import { calculateBrainrotCollection, withIncomePeriods } from './calculate';

export default function Calculator() {
  const [items, setItems] = useState<SelectedValueItem[]>([{ ...brainrots[0], quantity: 1, multiplier: 1 }]);
  const [choice, setChoice] = useState(brainrots[1].slug);
  const result = useMemo(() => withIncomePeriods(calculateBrainrotCollection(items)), [items]);
  return <div class="calculator">
    <div class="calculator-header"><div><span class="eyebrow">Acquisition cost + base income</span><h2>Analyze your Brainrots</h2></div><button class="text-button" type="button" onClick={() => setItems([])}>Clear</button></div>
    <div class="item-picker item-picker--large"><select value={choice} onChange={(event) => setChoice((event.target as HTMLSelectElement).value)}>{brainrots.map((item) => <option value={item.slug}>{item.name}</option>)}</select><button type="button" onClick={() => { const item = brainrots.find((entry) => entry.slug === choice); if (item && !items.some((entry) => entry.slug === choice)) setItems([...items, { ...item, quantity: 1, multiplier: 1 }]); }}>+ Add Brainrot</button></div>
    <div class="value-list value-list--wide">{items.length ? items.map((item) => <div><span class="item-orb">{item.name.slice(0, 2).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.rarity} · {formatCompact(item.income ?? 0)}/sec base</small></span><label><small>Qty</small><input type="number" min="1" max="999" value={item.quantity} onInput={(event) => setItems(items.map((entry) => entry.slug === item.slug ? { ...entry, quantity: Number((event.target as HTMLInputElement).value) } : entry))}/></label><label><small>Mutation</small><select value={item.multiplier} onChange={(event) => setItems(items.map((entry) => entry.slug === item.slug ? { ...entry, multiplier: Number((event.target as HTMLSelectElement).value) } : entry))}><option value="1">×1</option><option value="2">×2</option><option value="5">×5</option><option value="10">×10</option></select></label><button type="button" onClick={() => setItems(items.filter((entry) => entry.slug !== item.slug))} aria-label={`Remove ${item.name}`}>×</button></div>) : <div class="empty-state"><span>＋</span><strong>Your collection is empty</strong><small>Add a Brainrot to start calculating.</small></div>}</div>
    <div class="primary-result primary-result--pink"><span>Total acquisition-cost baseline</span><strong>{formatCompact(result.value)}</strong><p>{formatCompact(result.incomePerSecond)} base income every second</p></div>
    <div class="result-grid result-grid--three"><ResultMetric label="Per second" value={formatCompact(result.incomePerSecond)}/><ResultMetric label="Per minute" value={formatCompact(result.incomePerMinute)}/><ResultMetric label="Per hour" value={formatCompact(result.incomePerHour)}/></div>
    <div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult('Steal a Brainrot collection', `My collection earns ${formatCompact(result.incomePerSecond)}/sec with ${formatCompact(result.value)} total acquisition cost.`)}>Share result</button></div>
    <p class="assumption-note">The table uses game-displayed acquisition costs and base cash-per-second income, not player-to-player trade prices. Mutation choices are scenario multipliers. <a href={brainrots[0].sourceUrl} target="_blank" rel="noreferrer">Data source</a>, reviewed {brainrots[0].updated}.</p>
  </div>;
}
