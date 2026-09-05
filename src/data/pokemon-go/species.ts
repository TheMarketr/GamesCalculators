import payload from './species.json';
import type { DatasetMeta, PokemonSpecies } from './types';

export const pokemonSpeciesMeta = payload.meta as DatasetMeta;
export const pokemonSpecies = (payload.records as PokemonSpecies[]).sort((a, b) => a.dex - b.dex || a.form.localeCompare(b.form));
export const pokemonSpeciesById = new Map(pokemonSpecies.map((species) => [species.id, species]));
export const pokemonLabel = (species: PokemonSpecies) => species.form === 'Normal' ? `${species.name} · #${species.dex}` : `${species.name} (${species.form.replaceAll('_', ' ')}) · #${species.dex}`;

export const preferredPokemonSpecies = pokemonSpecies.filter((species, index, all) => {
  const normalized = species.form.toLowerCase();
  const eventForm = /fall|winter|spring|summer|costume|anniversary|holiday|party|flower|hat|shirt|fashion|explorer|clone|copy|world_cap|safari|adventure|202\d/.test(normalized);
  if (eventForm) return false;
  return all.findIndex((item) => item.id === species.id) === index;
});
