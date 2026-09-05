import payload from './evolutions.json';
import type { DatasetMeta, EvolutionEdge } from './types';

export const evolutionMeta = payload.meta as DatasetMeta;
export const pokemonEvolutions = payload.records as EvolutionEdge[];
export const evolutionsFrom = (speciesId: string) => pokemonEvolutions.filter((edge) => edge.fromId === speciesId);
