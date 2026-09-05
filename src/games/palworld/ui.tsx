import { useMemo, useState } from 'preact/hooks';
import { Field } from '../../components/tools/CalculatorUi';
import { palLabel, regularBreedingPals, statPals } from '../../data/palworld/pals';

export function PalPicker({ value, onChange, statsOnly = false, label = 'Pal' }: { value: string; onChange: (value: string) => void; statsOnly?: boolean; label?: string }) {
  const [query, setQuery] = useState('');
  const records = statsOnly ? statPals : regularBreedingPals;
  const options = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized ? records.filter((pal) => `${pal.number} ${pal.name}`.toLowerCase().includes(normalized)) : records;
    const selected = records.find((pal) => pal.id === value);
    return selected && !matches.some((pal) => pal.id === selected.id) ? [selected, ...matches] : matches;
  }, [query, records, value]);
  return <Field label={label}><div class="search-select-stack"><input type="search" value={query} placeholder={`Search ${label.toLowerCase()}`} aria-label={`Search ${label}`} onInput={(event) => setQuery((event.currentTarget as HTMLInputElement).value)}/><select value={value} aria-label={`Select ${label}`} onChange={(event) => onChange((event.currentTarget as HTMLSelectElement).value)}>{options.map((pal) => <option value={pal.id}>{palLabel(pal)}</option>)}</select>{options.length === 0 && <small>No matching Pals</small>}</div></Field>;
}
