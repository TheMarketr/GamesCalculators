import type { ValueItem } from '../types';

const reviewed = '2026-08-28';
const source = {
  sourceType: 'community-market' as const,
  sourceLabel: 'AdoptMe.rocks community value index',
  sourceUrl: 'https://adoptme.rocks/',
  unit: 'community index',
};
const pet = (slug: string, name: string, rarity: string, value: number): ValueItem => ({
  slug, name, category: 'pet', rarity, value, demand: 0, updated: reviewed, ...source,
  note: 'Fan-made community index snapshot; not an official Adopt Me trade value.',
});

export const adoptMePets: ValueItem[] = [
  pet('bat-dragon', 'Bat Dragon', 'legendary', 288),
  pet('shadow-dragon', 'Shadow Dragon', 'legendary', 195),
  pet('giraffe', 'Giraffe', 'legendary', 130),
  pet('frost-dragon', 'Frost Dragon', 'legendary', 100),
  pet('owl', 'Owl', 'legendary', 83.43),
  pet('parrot', 'Parrot', 'legendary', 65.66),
  pet('crow', 'Crow', 'legendary', 54.22),
  pet('evil-unicorn', 'Evil Unicorn', 'legendary', 46.99),
  pet('giant-panda', 'Giant Panda', 'legendary', 36.14),
  pet('african-wild-dog', 'African Wild Dog', 'ultra-rare', 34.34),
  pet('hedgehog', 'Hedgehog', 'ultra-rare', 32.53),
  pet('balloon-unicorn', 'Balloon Unicorn', 'legendary', 31.33),
  pet('blazing-lion', 'Blazing Lion', 'legendary', 30.72),
  pet('diamond-butterfly', 'Diamond Butterfly', 'legendary', 29.52),
  pet('orchid-butterfly', 'Orchid Butterfly', 'legendary', 27.71),
  pet('dalmatian', 'Dalmatian', 'ultra-rare', 26.51),
  pet('arctic-reindeer', 'Arctic Reindeer', 'legendary', 22.89),
  pet('haetae', 'Haetae', 'legendary', 16.87),
  pet('pelican', 'Pelican', 'ultra-rare', 15.66),
  pet('cow', 'Cow', 'rare', 15.21),
  pet('peppermint-penguin', 'Peppermint Penguin', 'ultra-rare', 14.76),
  pet('strawberry-shortcake-bat-dragon', 'Strawberry Shortcake Bat Dragon', 'legendary', 14.76),
  pet('cryptid', 'Cryptid', 'legendary', 13.55),
  pet('turtle', 'Turtle', 'legendary', 13.55),
  pet('yeti', 'Yeti', 'ultra-rare', 0.78),
];
