export type ZmiEssenceType = 'pure' | 'daeyalt';

export interface ZmiExperienceTier {
  minimumLevel: number;
  maximumLevel: number;
  pureXpPerEssence: number;
  daeyaltXpPerEssence: number;
}

export const zmiExperienceMeta = {
  source: 'OSRS Wiki — Ourania Altar',
  sourceUrl: 'https://oldschool.runescape.wiki/w/Ourania_Altar#Experience_rates',
  sourceType: 'Community-maintained game-mechanics reference',
  reviewed: '2026-09-25',
  unit: 'Runecraft XP per essence',
  notes: 'Ourania gives 1.7× normal rune XP. Daeyalt stacks multiplicatively for 2.55× base XP; output changes in level bands.',
} as const;

export const zmiExperienceTiers: ZmiExperienceTier[] = [
  { minimumLevel: 1, maximumLevel: 9, pureXpPerEssence: 9.39, daeyaltXpPerEssence: 14.09 },
  { minimumLevel: 10, maximumLevel: 19, pureXpPerEssence: 10.52, daeyaltXpPerEssence: 15.78 },
  { minimumLevel: 20, maximumLevel: 29, pureXpPerEssence: 11.34, daeyaltXpPerEssence: 17.01 },
  { minimumLevel: 30, maximumLevel: 39, pureXpPerEssence: 12.27, daeyaltXpPerEssence: 18.41 },
  { minimumLevel: 40, maximumLevel: 49, pureXpPerEssence: 12.9, daeyaltXpPerEssence: 19.35 },
  { minimumLevel: 50, maximumLevel: 59, pureXpPerEssence: 13.47, daeyaltXpPerEssence: 20.21 },
  { minimumLevel: 60, maximumLevel: 69, pureXpPerEssence: 13.63, daeyaltXpPerEssence: 20.45 },
  { minimumLevel: 70, maximumLevel: 79, pureXpPerEssence: 14.59, daeyaltXpPerEssence: 21.89 },
  { minimumLevel: 80, maximumLevel: 89, pureXpPerEssence: 14.9, daeyaltXpPerEssence: 22.35 },
  { minimumLevel: 90, maximumLevel: 98, pureXpPerEssence: 15.35, daeyaltXpPerEssence: 23.03 },
  { minimumLevel: 99, maximumLevel: 99, pureXpPerEssence: 15.58, daeyaltXpPerEssence: 23.37 },
];

export function zmiExperienceForLevel(level: number, essence: ZmiEssenceType) {
  const safeLevel = Math.max(1, Math.min(99, Math.floor(level)));
  const tier = zmiExperienceTiers.find((row) => safeLevel >= row.minimumLevel && safeLevel <= row.maximumLevel) ?? zmiExperienceTiers[0];
  return essence === 'daeyalt' ? tier.daeyaltXpPerEssence : tier.pureXpPerEssence;
}
