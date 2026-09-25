import { regularBreedingPals } from './pals';
export const palBreedingRanks = regularBreedingPals.map((pal) => ({ id: pal.id, name: pal.name, rank: pal.breedingPower, rarity: pal.rarity, order: pal.order }));
export const breedingRankMeta = { source: 'Palworld 1.0 breeding-data export', sourceUrl: 'https://github.com/helios57/palworld', sourceType: 'Community-maintained extraction of current game data', reviewed: '2026-09-25', unit: 'hidden CombiRank', notes: 'The local snapshot contains 299 Pals, current generic-pool eligibility and the 1.0 higher-rank tie rule.' } as const;
