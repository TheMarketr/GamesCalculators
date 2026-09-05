import { regularBreedingPals } from './pals';
export const palBreedingRanks = regularBreedingPals.map((pal) => ({ id: pal.id, name: pal.name, rank: pal.breedingPower, rarity: pal.rarity, order: pal.order }));
export const breedingRankMeta = { source: 'Palworld Wiki — Breeding', sourceUrl: 'https://palworld.wiki.gg/wiki/Breeding', sourceType: 'Community wiki and extracted game data', reviewed: '2026-09-05', unit: 'hidden breeding rank', notes: 'Lower ranks generally correspond to rarer or stronger offspring candidates.' } as const;
