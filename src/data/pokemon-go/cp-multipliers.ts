import payload from './cp-multipliers.json';
import type { CpMultiplier, DatasetMeta } from './types';

export const cpMultiplierMeta = payload.meta as DatasetMeta;
export const cpMultipliers = payload.records as CpMultiplier[];
export const cpMultiplierByLevel = new Map(cpMultipliers.map((record) => [record.level, record.multiplier]));
export const pokemonLevels = cpMultipliers.map((record) => record.level);
