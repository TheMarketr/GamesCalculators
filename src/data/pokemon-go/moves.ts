import payload from './moves.json';
import type { DatasetMeta, PokemonMove, PokemonMovePool } from './types';

export const moveMeta = payload.meta as DatasetMeta;
export const pveFastMoves = payload.records.pveFast as PokemonMove[];
export const pveChargedMoves = payload.records.pveCharged as PokemonMove[];
export const pvpFastMoves = payload.records.pvpFast as PokemonMove[];
export const pvpChargedMoves = payload.records.pvpCharged as PokemonMove[];
export const pokemonMovePools = payload.records.bySpecies as Record<string, PokemonMovePool>;
