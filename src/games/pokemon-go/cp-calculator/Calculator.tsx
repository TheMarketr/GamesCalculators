import { useMemo, useState } from 'preact/hooks';
import { ResultMetric, Segmented, shareResult } from '../../../components/tools/CalculatorUi';
import { cpMultiplierMeta } from '../../../data/pokemon-go/cp-multipliers';
import { pokemonSpeciesById } from '../../../data/pokemon-go/species';
import { calculatePokemonStats, type PokemonIvs } from './calculate';
import { formatStat, IvFields, LevelPicker, PokemonPicker } from '../ui';

type Preset = 'perfect' | 'floor' | 'pvp' | 'custom';
const presetIvs: Record<Exclude<Preset, 'custom'>, PokemonIvs> = { perfect: { attack: 15, defense: 15, stamina: 15 }, floor: { attack: 10, defense: 10, stamina: 10 }, pvp: { attack: 0, defense: 15, stamina: 15 } };

export default function Calculator() {
  const [speciesId, setSpeciesId] = useState('1-normal');
  const [level, setLevel] = useState(20);
  const [ivs, setIvs] = useState<PokemonIvs>(presetIvs.perfect);
  const species = pokemonSpeciesById.get(speciesId) ?? pokemonSpeciesById.get('1-normal')!;
  const result = useMemo(() => calculatePokemonStats(species, level, ivs), [species, level, ivs]);
  const preset = (Object.entries(presetIvs).find(([, value]) => value.attack === ivs.attack && value.defense === ivs.defense && value.stamina === ivs.stamina)?.[0] ?? 'custom') as Preset;
  const setPreset = (value: Preset) => { if (value !== 'custom') setIvs(presetIvs[value]); };

  return <div class="calculator universal-tool">
    <div class="calculator-header"><div><span class="eyebrow">Exact CP and HP</span><h2>Calculate a Pokémon’s combat power</h2></div><button class="text-button" type="button" onClick={() => { setSpeciesId('1-normal'); setLevel(20); setIvs(presetIvs.perfect); }}>Reset</button></div>
    <div class="secondary-input-grid"><PokemonPicker value={speciesId} onChange={setSpeciesId}/><LevelPicker value={level} onChange={setLevel}/></div>
    <Segmented label="IV preset" value={preset} options={[{ value: 'perfect', label: '15 / 15 / 15' }, { value: 'floor', label: '10 / 10 / 10' }, { value: 'pvp', label: '0 / 15 / 15' }, { value: 'custom', label: 'Custom' }]} onChange={setPreset}/>
    <div class="secondary-input-grid"><IvFields ivs={ivs} setIvs={setIvs}/></div>
    <div class="primary-result primary-result--blue"><span>Calculated CP</span><strong>{result.cp.toLocaleString()} <small>CP</small></strong><p>{species.name}{species.form === 'Normal' ? '' : ` · ${species.form.replaceAll('_', ' ')}`} · level {level} · {ivs.attack}/{ivs.defense}/{ivs.stamina}</p></div>
    <div class="secondary-result-grid"><ResultMetric label="Calculated HP" value={result.hp}/><ResultMetric label="Effective Attack" value={formatStat(result.effectiveAttack)}/><ResultMetric label="Effective Defense" value={formatStat(result.effectiveDefense)}/><ResultMetric label="Effective Stamina" value={formatStat(result.effectiveStamina)}/><ResultMetric label="IV percentage" value={`${result.ivPercent.toFixed(1)}%`}/><ResultMetric label="Pokémon level" value={level}/></div>
    <details class="advanced-settings" open><summary>See the CP calculation <span>+</span></summary><div class="formula-breakdown"><p><strong>Base values:</strong> ({species.baseAttack} + {Math.round(ivs.attack)}) × √({species.baseDefense} + {Math.round(ivs.defense)}) × √({species.baseStamina} + {Math.round(ivs.stamina)})</p><p><strong>Level multiplier:</strong> {result.multiplier.toFixed(8)}²</p><p><strong>Final step:</strong> floor({result.formulaNumerator.toFixed(2)} ÷ 10) = <strong>{result.cp} CP</strong>, with a minimum of 10.</p></div></details>
    <div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult('Pokémon GO CP result', `${species.name} at level ${level} with ${ivs.attack}/${ivs.defense}/${ivs.stamina} IVs: ${result.cp} CP and ${result.hp} HP.`)}>Share result</button></div>
    <p class="assumption-note"><a href={cpMultiplierMeta.sourceUrl} target="_blank" rel="noreferrer">{cpMultiplierMeta.source}</a> · reviewed {cpMultiplierMeta.reviewed}. The base stats and multipliers come from reviewed Game Master extracts; the CP formula is a well-established community-derived mechanic because Niantic does not publish the complete equation.</p>
  </div>;
}
