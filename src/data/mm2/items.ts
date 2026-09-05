import type { ValueItem } from '../types';
import sourceSnapshot from './source-snapshot.json';

const reviewed = '2026-08-28';
const source = {
  sourceType: 'community-market' as const,
  sourceLabel: 'Supreme Values MM2 community list',
  sourceUrl: 'https://supremevalues.com/mm2',
  unit: 'Supreme value',
};
const weapon = (slug: string, name: string, category: 'knife' | 'gun' | 'weapon', rarity: string, value: number, demand: number): ValueItem => ({
  slug, name, category, rarity, value, demand, updated: reviewed, lastReviewed: reviewed, ...source,
  note: `Community-market snapshot: ${value.toLocaleString()} value, ${demand}/10 demand. Not an official MM2 price.`,
});

/** Community reference snapshot. Market values can move between editorial reviews. */
export const mm2LegacyItems: ValueItem[] = [
  weapon('gingerscope', 'Gingerscope', 'gun', 'ancient', 17_750, 6),
  weapon('travelers-axe', "Traveler's Axe", 'knife', 'ancient', 8_100, 5),
  weapon('travelers-gun', "Traveler's Gun", 'gun', 'godly', 5_600, 5),
  weapon('evergun', 'Evergun', 'gun', 'godly', 3_450, 5),
  weapon('evergreen', 'Evergreen', 'knife', 'godly', 2_700, 6),
  weapon('alienbeam', 'Alienbeam', 'gun', 'godly', 2_650, 6),
  weapon('celestial', 'Celestial', 'weapon', 'ancient', 2_450, 5),
  weapon('turkey', 'Turkey', 'knife', 'godly', 2_425, 5),
  weapon('raygun', 'Raygun', 'gun', 'godly', 2_150, 6),
  weapon('vampires-gun', "Vampire's Gun", 'gun', 'godly', 1_900, 5),
  weapon('darkshot', 'Darkshot', 'gun', 'godly', 1_800, 6),
  weapon('darksword', 'Darksword', 'knife', 'godly', 1_800, 6),
  weapon('vampires-axe', "Vampire's Axe", 'knife', 'ancient', 1_550, 6),
  weapon('blossom', 'Blossom', 'knife', 'godly', 1_400, 6),
  weapon('sakura', 'Sakura', 'knife', 'godly', 1_400, 6),
  weapon('sunrise', 'Sunrise', 'weapon', 'godly', 1_200, 6),
  weapon('snowcannon', 'Snowcannon', 'gun', 'godly', 835, 4),
  weapon('bauble', 'Bauble', 'weapon', 'godly', 825, 4),
  weapon('sunset', 'Sunset', 'weapon', 'godly', 700, 5.5),
  weapon('soul', 'Soul', 'weapon', 'godly', 610, 5),
  weapon('spirit', 'Spirit', 'weapon', 'godly', 600, 5),
  weapon('rainbow-gun', 'Rainbow Gun', 'gun', 'godly', 430, 5),
  weapon('rainbow', 'Rainbow', 'knife', 'godly', 420, 5),
  weapon('flora', 'Flora', 'knife', 'godly', 410, 4.5),
  weapon('bloom', 'Bloom', 'weapon', 'godly', 400, 4.5),
  weapon('corrupt', 'Corrupt', 'knife', 'unique', 350, 4),
  weapon('heart-wand', 'Heart Wand', 'knife', 'godly', 350, 4.5),
  weapon('xenoknife', 'Xenoknife', 'knife', 'godly', 325, 4.5),
  weapon('xenoshot', 'Xenoshot', 'gun', 'godly', 325, 4.5),
  weapon('ocean', 'Ocean', 'knife', 'godly', 280, 4),
  weapon('waves', 'Waves', 'knife', 'godly', 275, 4),
  weapon('flowerwood-gun', 'Flowerwood Gun', 'gun', 'godly', 265, 4),
  weapon('blizzard', 'Blizzard', 'weapon', 'godly', 265, 4),
  weapon('snowstorm', 'Snowstorm', 'weapon', 'godly', 265, 4),
  weapon('flowerwood-knife', 'Flowerwood Knife', 'knife', 'godly', 260, 4),
  weapon('harvester', 'Harvester', 'gun', 'ancient', 250, 3),
  weapon('watergun', 'Watergun', 'gun', 'godly', 230, 2),
  weapon('snow-dagger', 'Snow Dagger', 'knife', 'godly', 230, 2),
  weapon('icepiercer', 'Icepiercer', 'gun', 'ancient', 160, 3),
  weapon('treat', 'Treat', 'knife', 'godly', 155, 2.5),
  weapon('sweet', 'Sweet', 'knife', 'godly', 150, 2.5),
  weapon('borealis', 'Borealis', 'weapon', 'godly', 145, 3),
  weapon('australis', 'Australis', 'weapon', 'godly', 140, 3),
  weapon('icecream', 'Icecream', 'knife', 'godly', 120, 3),
  weapon('bat', 'Bat', 'knife', 'godly', 120, 3),
  weapon('beachy', 'Beachy', 'knife', 'godly', 105, 3),
  weapon('sands', 'Sands', 'knife', 'godly', 105, 3),
  weapon('pearlshine', 'Pearlshine', 'weapon', 'godly', 85, 3),
  weapon('pearl', 'Pearl', 'weapon', 'godly', 80, 3),
  weapon('icebreaker', 'Icebreaker', 'knife', 'ancient', 65, 1),
  weapon('batwing', 'Batwing', 'knife', 'ancient', 42, 1),
  weapon('elderwood-scythe', 'Elderwood Scythe', 'knife', 'ancient', 38, 1),
  weapon('swirly-axe', 'Swirly Axe', 'knife', 'ancient', 38, 1),
  weapon('hallowscythe', 'Hallowscythe', 'knife', 'ancient', 30, 1),
  weapon('darkbringer', 'Darkbringer', 'gun', 'godly', 35, 3),
  weapon('lightbringer', 'Lightbringer', 'gun', 'godly', 33, 3),
  weapon('luger', 'Luger', 'gun', 'godly', 28, 3),
  weapon('logchopper', 'Logchopper', 'knife', 'ancient', 18, 1),
  weapon('icewing', 'Icewing', 'knife', 'ancient', 13, 1),
];

/**
 * A 300-item, source-dated MM2 market snapshot. Numeric values and demand scores
 * come from the named Supreme Values category linked on each row; MM2 does not
 * publish official player-to-player prices.
 */
export const mm2Items: ValueItem[] = sourceSnapshot.map((item) => ({
  ...item,
  note: `${item.name}: ${item.note}`,
  sourceType: 'community-market' as const,
  sourceLabel: 'Supreme Values MM2 community list',
  unit: 'Supreme value',
  updated: item.lastReviewed,
}));
