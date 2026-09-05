import type { ValueItem } from '../types';

const reviewed = '2026-08-28';
const classSource = 'https://www.pcgamer.com/roblox/99-nights-in-the-forest-classes/';
const foodSource = 'https://dinokid.wiki/food/';
const recipeSource = 'https://99nightsintheforest.com/wiki';

const gameClass = (slug: string, name: string, cost: number, stars: number, tier: string, currency = 'diamonds'): ValueItem => ({
  slug, name, category: 'class', rarity: `${stars}-star · ${tier} tier`, value: cost, demand: stars, ratingLabel: 'stars', ratingMax: 5, updated: reviewed, lastReviewed: reviewed,
  sourceType: 'community-wiki', sourceLabel: 'PC Gamer class reference', sourceUrl: classSource, unit: currency,
  note: `${cost} ${currency}; ${stars}-star class. ${tier} is the source's editorial tier, not an in-game stat.`,
});
const food = (slug: string, name: string, hunger: number, note: string): ValueItem => ({
  slug, name, category: 'food', rarity: 'consumable', value: hunger, demand: 0, updated: reviewed, lastReviewed: reviewed,
  sourceType: 'community-wiki', sourceLabel: 'DinoKid food reference', sourceUrl: foodSource, unit: 'hunger units', note,
});
const recipe = (slug: string, name: string, materials: number, bench: number, note: string): ValueItem => ({
  slug, name, category: 'crafting', rarity: `bench ${bench}`, value: materials, demand: 0, updated: reviewed, lastReviewed: reviewed,
  sourceType: 'community-wiki', sourceLabel: '99 Nights community recipe reference', sourceUrl: recipeSource, unit: 'material pieces', note,
});

export const nightsClasses: ValueItem[] = [
  gameClass('big-game-hunter', 'Big Game Hunter', 600, 5, 'S'),
  gameClass('cyborg', 'Cyborg', 600, 5, 'S'),
  gameClass('necromancer', 'Necromancer', 600, 5, 'S'),
  gameClass('vampire', 'Vampire', 600, 5, 'S'),
  gameClass('assassin', 'Assassin', 500, 5, 'A'),
  gameClass('beastmaster', 'Beastmaster', 400, 4, 'A'),
  gameClass('brawler', 'Brawler', 200, 3, 'A'),
  gameClass('chef', 'Chef', 150, 4, 'A'),
  gameClass('explorer', 'Explorer', 80, 3, 'A'),
  gameClass('fire-bandit', 'Fire Bandit', 200, 4, 'A'),
  gameClass('gambler', 'Gambler', 55, 3, 'A'),
  gameClass('lumberjack', 'Lumberjack', 70, 3, 'A'),
  gameClass('alien', 'Alien', 100, 3, 'B'),
  gameClass('berserker', 'Berserker', 100, 3, 'B'),
  gameClass('blacksmith', 'Blacksmith', 200, 4, 'B'),
  gameClass('brute', 'Brute', 50, 2, 'B'),
  gameClass('poison-master', 'Poison Master', 200, 4, 'B'),
  gameClass('pyromaniac', 'Pyromaniac', 600, 5, 'B'),
  gameClass('snowman', 'Snowman', 100, 3, 'B'),
  gameClass('witch', 'Witch', 900, 3, 'B', 'candy'),
  gameClass('base-defender', 'Base Defender', 40, 2, 'C'),
  gameClass('cook', 'Cook', 40, 2, 'C'),
  gameClass('farmer', 'Farmer', 80, 3, 'C'),
  gameClass('fisherman', 'Fisherman', 50, 2, 'C'),
  gameClass('medic', 'Medic', 40, 2, 'C'),
  gameClass('ranger', 'Ranger', 70, 3, 'C'),
  gameClass('camper', 'Camper', 10, 1, 'D'),
  gameClass('santas-helper', "Santa's Helper", 30, 1, 'event', 'candy'),
];

export const nightsFood: ValueItem[] = [
  food('carrot', 'Carrot', 1, 'Restores 1 hunger unit; can be eaten raw.'),
  food('berry', 'Berry', 1, 'Restores 1 hunger unit; common forage food.'),
  food('apple', 'Apple', 1, 'Restores 1 hunger unit.'),
  food('chili', 'Chili', 1, 'Restores 1 hunger unit.'),
  food('corn', 'Corn', 2, 'Restores 2 hunger units.'),
  food('pumpkin', 'Pumpkin', 4, 'Restores 4 hunger units.'),
  food('cooked-morsel', 'Cooked Morsel', 2, 'Approximately 2 hunger units after cooking.'),
  food('cooked-steak', 'Cooked Steak', 2, 'Approximately 2 hunger units after cooking.'),
  food('cooked-ribs', 'Cooked Ribs', 4, 'Approximately 4 hunger units after cooking.'),
  food('hearty-stew', 'Hearty Stew', 4, 'Restores about half the hunger bar and 15 HP.'),
  food('carrot-cake', 'Carrot Cake', 4, 'Restores 4 hunger, 10 HP and grants about 9 minutes of night vision.'),
  food('pumpkin-soup', 'Pumpkin Soup', 4, 'Restores 4 hunger and grants about 2 minutes of warmth.'),
];

export const nightsRecipes: ValueItem[] = [
  recipe('map', 'Map', 3, 1, 'Requires 3 Wood.'),
  recipe('farm-plot', 'Farm Plot', 10, 1, 'Requires 10 Wood.'),
  recipe('wood-rain-storage', 'Wood Rain Storage', 15, 1, 'Requires 15 Wood.'),
  recipe('sundial', 'Sundial', 10, 1, 'Requires 5 Wood and 5 Scrap.'),
  recipe('teleporter', 'Teleporter', 20, 2, 'Requires 10 Wood and 10 Scrap.'),
  recipe('bear-trap', 'Bear Trap', 3, 2, 'Requires 3 Scrap.'),
  recipe('bed', 'Bed', 15, 2, 'Requires 10 Wood and 5 Rabbit Pelts.'),
  recipe('shelf', 'Shelf', 5, 2, 'Requires 5 Wood.'),
  recipe('biofuel-processor', 'Biofuel Processor', 20, 3, 'Requires 15 Scrap and 5 Wood.'),
  recipe('generator', 'Generator', 22, 4, 'Requires 20 Scrap and 2 Cultist Medallions.'),
];

export const nightsCatalog = [...nightsClasses, ...nightsFood, ...nightsRecipes];
