import type { ValueItem } from '../types';

const reviewed = '2026-09-04';
const source = {
  sourceType: 'developer-set' as const,
  sourceLabel: 'Blox Fruits Wiki dealer-price table',
  sourceUrl: 'https://bloxguidesgg.com/games/blox-fruits/wiki/fruits',
  unit: 'Beli',
};

const fruit = (slug: string, name: string, type: string, rarity: string, value: number, permanentPrice: number): ValueItem => ({
  slug, name, category: `${type} fruit`, rarity, value, permanentPrice, demand: 0, updated: reviewed, lastReviewed: reviewed, ...source,
  note: `${value.toLocaleString()} Beli Dealer price; permanent version ${permanentPrice.toLocaleString()} Robux.${name === 'Tiger' ? ' Tiger replaced the former Leopard fruit after its rework.' : ''} This is not a community trade valuation.`,
});

/** 41 usable priced Dealer rows. Two source-listed Meme/admin variants have no usable Dealer price and are excluded. */
export const bloxFruits: ValueItem[] = [
  fruit('rocket', 'Rocket', 'Natural', 'common', 5_000, 50),
  fruit('spin', 'Spin', 'Natural', 'common', 7_500, 75),
  fruit('blade', 'Blade', 'Natural', 'common', 30_000, 100),
  fruit('spring', 'Spring', 'Natural', 'common', 60_000, 180),
  fruit('bomb', 'Bomb', 'Natural', 'common', 80_000, 220),
  fruit('smoke', 'Smoke', 'Elemental', 'common', 100_000, 250),
  fruit('spike', 'Spike', 'Natural', 'common', 180_000, 380),
  fruit('flame', 'Flame', 'Elemental', 'uncommon', 250_000, 550),
  fruit('ice', 'Ice', 'Elemental', 'uncommon', 350_000, 750),
  fruit('sand', 'Sand', 'Elemental', 'uncommon', 420_000, 850),
  fruit('dark', 'Dark', 'Elemental', 'uncommon', 500_000, 950),
  fruit('eagle', 'Eagle', 'Beast', 'uncommon', 550_000, 975),
  fruit('diamond', 'Diamond', 'Natural', 'uncommon', 600_000, 1_000),
  fruit('light', 'Light', 'Elemental', 'rare', 650_000, 1_100),
  fruit('rubber', 'Rubber', 'Natural', 'rare', 750_000, 1_200),
  fruit('ghost', 'Ghost', 'Natural', 'rare', 940_000, 1_275),
  fruit('magma', 'Magma', 'Elemental', 'rare', 960_000, 1_300),
  fruit('quake', 'Quake', 'Natural', 'legendary', 1_000_000, 1_500),
  fruit('buddha', 'Buddha', 'Beast', 'legendary', 1_200_000, 1_650),
  fruit('love', 'Love', 'Natural', 'legendary', 1_300_000, 1_700),
  fruit('creation', 'Creation', 'Natural', 'legendary', 1_400_000, 1_750),
  fruit('spider', 'Spider', 'Natural', 'legendary', 1_500_000, 1_800),
  fruit('sound', 'Sound', 'Natural', 'legendary', 1_700_000, 1_900),
  fruit('phoenix', 'Phoenix', 'Beast', 'legendary', 1_800_000, 2_000),
  fruit('portal', 'Portal', 'Natural', 'legendary', 1_900_000, 2_000),
  fruit('lightning', 'Lightning', 'Elemental', 'legendary', 2_100_000, 2_100),
  fruit('pain', 'Pain', 'Natural', 'legendary', 2_300_000, 2_200),
  fruit('blizzard', 'Blizzard', 'Elemental', 'legendary', 2_400_000, 2_250),
  fruit('gravity', 'Gravity', 'Natural', 'mythical', 2_500_000, 2_300),
  fruit('mammoth', 'Mammoth', 'Beast', 'mythical', 2_700_000, 2_350),
  fruit('t-rex', 'T-Rex', 'Beast', 'mythical', 2_700_000, 2_350),
  fruit('dough', 'Dough', 'Elemental', 'mythical', 2_800_000, 2_400),
  fruit('shadow', 'Shadow', 'Natural', 'mythical', 2_900_000, 2_425),
  fruit('venom', 'Venom', 'Natural', 'mythical', 3_000_000, 2_450),
  fruit('gas', 'Gas', 'Elemental', 'mythical', 3_200_000, 2_500),
  fruit('spirit', 'Spirit', 'Natural', 'mythical', 3_400_000, 2_550),
  fruit('tiger', 'Tiger', 'Beast', 'mythical', 5_000_000, 3_000),
  fruit('yeti', 'Yeti', 'Beast', 'mythical', 5_000_000, 3_000),
  fruit('kitsune', 'Kitsune', 'Beast', 'mythical', 8_000_000, 4_000),
  fruit('control', 'Control', 'Natural', 'mythical', 9_000_000, 4_000),
  fruit('dragon', 'Dragon', 'Beast', 'mythical', 15_000_000, 5_000),
];
