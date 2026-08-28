import { useMemo, useState } from 'preact/hooks';
import { Field, ResultMetric, Segmented, shareResult } from '../../../components/tools/CalculatorUi';
import { gardenItems } from '../../../data/grow-a-garden/items';
import { formatCompact, formatNumber } from '../../../utils/format';
import { calculateGardenValue } from './calculate';

export default function Calculator() {
  const [crop, setCrop] = useState(gardenItems[0]);
  const [baseWeight, setBaseWeight] = useState(gardenItems[0].baseWeight ?? 1);
  const [weight, setWeight] = useState(gardenItems[0].baseWeight ?? 1);
  const [growth, setGrowth] = useState<'1' | '20' | '50'>('1');
  const [mutation, setMutation] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const result = useMemo(() => calculateGardenValue({ baseValue: crop.value, baseWeight, weight, growthMultiplier: Number(growth), mutationMultiplier: mutation, quantity }), [crop, baseWeight, weight, growth, mutation, quantity]);
  const chooseCrop = (slug: string) => {
    const next = gardenItems.find((item) => item.slug === slug) ?? gardenItems[0];
    const referenceWeight = next.baseWeight ?? 1;
    setCrop(next); setBaseWeight(referenceWeight); setWeight(referenceWeight);
  };

  return <div class="calculator">
    <div class="calculator-header"><div><span class="eyebrow">Weight and mutations</span><h2>Calculate a crop’s value</h2></div><button class="text-button" type="button" onClick={() => { const referenceWeight = crop.baseWeight ?? 1; setWeight(referenceWeight); setBaseWeight(referenceWeight); setGrowth('1'); setMutation(1); setQuantity(1); }}>Reset</button></div>
    <div class="input-grid"><Field label="Crop"><select value={crop.slug} onChange={(event) => chooseCrop((event.target as HTMLSelectElement).value)}>{gardenItems.map((item) => <option value={item.slug}>{item.name}</option>)}</select></Field><Field label="Quantity"><input type="number" min="1" max="999" value={quantity} onInput={(event) => setQuantity(Number((event.target as HTMLInputElement).value))}/></Field><Field label="Reference weight" hint="kg"><input type="number" min=".01" step=".01" value={baseWeight} onInput={(event) => setBaseWeight(Number((event.target as HTMLInputElement).value))}/></Field><Field label="Actual weight" hint="kg"><input type="number" min=".01" step=".01" value={weight} onInput={(event) => setWeight(Number((event.target as HTMLInputElement).value))}/></Field></div>
    <Segmented label="Growth mutation" value={growth} options={[{ value: '1', label: 'Normal · ×1' }, { value: '20', label: 'Golden · ×20' }, { value: '50', label: 'Rainbow · ×50' }]} onChange={setGrowth}/>
    <Field label="Combined environmental mutation multiplier" hint="× multiplier"><div class="number-range"><input type="range" min="1" max="200" value={mutation} onInput={(event) => setMutation(Number((event.target as HTMLInputElement).value))}/><input type="number" min="1" max="1000" value={mutation} onInput={(event) => setMutation(Number((event.target as HTMLInputElement).value))}/></div></Field>
    <div class="primary-result"><span>Estimated total sell value</span><strong>{formatCompact(result.totalValue)} <small>Sheckles</small></strong><p>{quantity} × {formatNumber(result.unitValue, 0)} per crop · {result.weightRatio.toFixed(2)}× reference weight</p></div>
    <div class="result-grid"><ResultMetric label="Unit value" value={formatCompact(result.unitValue)}/><ResultMetric label="Total multiplier" value={`${(Number(growth) * mutation).toFixed(0)}×`}/></div>
    <div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult('Grow a Garden crop value', `${crop.name}: about ${formatCompact(result.totalValue)} Sheckles.`)}>Share result</button></div>
    <p class="assumption-note">The crop selector now loads the reviewed base value and reference weight together. Formula: base value × squared weight ratio × growth multiplier × combined environmental multiplier. <a href={crop.sourceUrl} target="_blank" rel="noreferrer">Community crop source</a>, reviewed {crop.updated}.</p>
  </div>;
}
