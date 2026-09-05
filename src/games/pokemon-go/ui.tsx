import { useMemo, useState, type Dispatch, type StateUpdater } from 'preact/hooks';
import { Field } from '../../components/tools/CalculatorUi';
import { pokemonLabel, preferredPokemonSpecies } from '../../data/pokemon-go/species';
import { pokemonLevels } from '../../data/pokemon-go/cp-multipliers';
import type { PokemonIvs } from './calculate';

export function PokemonPicker({ value, onChange, label = 'Pokémon', ids }: { value: string; onChange: (id: string) => void; label?: string; ids?: Set<string> }) {
  const records = ids ? preferredPokemonSpecies.filter((species) => ids.has(species.id)) : preferredPokemonSpecies;
  const [query, setQuery] = useState('');
  const options = useMemo(() => { const normalized = query.trim().toLowerCase(); const matches = normalized ? records.filter((species) => pokemonLabel(species).toLowerCase().includes(normalized)) : records; const selected = records.find((species) => species.id === value); return selected && !matches.some((species) => species.id === selected.id) ? [selected, ...matches] : matches; }, [query, records, value]);
  return <Field label={label}><div class="search-select-stack"><input type="search" value={query} placeholder={`Search ${label.toLowerCase()}`} aria-label={`Search ${label}`} onInput={(event) => setQuery((event.currentTarget as HTMLInputElement).value)}/><select value={value} aria-label={`Select ${label}`} onChange={(event) => onChange((event.currentTarget as HTMLSelectElement).value)}>{options.map((species) => <option value={species.id} key={species.id}>{pokemonLabel(species)}</option>)}</select>{options.length === 0 && <small>No matching Pokémon</small>}</div></Field>;
}

export function LevelPicker({ value, onChange, label = 'Pokémon level', minimum = 1, maximum = 50 }: { value: number; onChange: (level: number) => void; label?: string; minimum?: number; maximum?: number }) {
  return <Field label={label}><select value={value} onChange={(event) => onChange(Number((event.currentTarget as HTMLSelectElement).value))}>{pokemonLevels.filter((level) => level >= minimum && level <= maximum).map((level) => <option value={level} key={level}>{level}</option>)}</select></Field>;
}

export function IvFields({ ivs, setIvs }: { ivs: PokemonIvs; setIvs: Dispatch<StateUpdater<PokemonIvs>> }) {
  const field = (key: keyof PokemonIvs, label: string) => <Field label={label} hint="0–15"><input type="number" min="0" max="15" step="1" value={ivs[key]} onInput={(event) => setIvs({ ...ivs, [key]: Number((event.currentTarget as HTMLInputElement).value) })}/></Field>;
  return <>{field('attack', 'Attack IV')}{field('defense', 'Defense IV')}{field('stamina', 'Stamina IV')}</>;
}

export const formatStat = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 });
