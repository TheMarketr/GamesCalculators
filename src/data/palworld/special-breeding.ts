import payload from './special-breeding.json';
import type { PalworldMeta, SpecialBreedingCombination } from './types';
export const specialBreedingMeta = payload.meta as PalworldMeta;
export const specialBreedingCombinations = payload.records as SpecialBreedingCombination[];
