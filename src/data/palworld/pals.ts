import payload from './pals.json';
import type { Pal, PalworldMeta } from './types';
export const palworldMeta = payload.meta as PalworldMeta;
export const pals = payload.records as Pal[];
export const palsById = new Map(pals.map((pal) => [pal.id, pal]));
export const regularBreedingPals = pals.filter((pal) => pal.regularEligible && !pal.isBoss).sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }) || a.name.localeCompare(b.name));
export const statPals = pals.filter((pal) => pal.baseHp !== null && pal.baseAttack !== null && pal.baseDefense !== null && !pal.isBoss).sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
export const palLabel = (pal: Pal) => `#${pal.number} ${pal.name}`;
