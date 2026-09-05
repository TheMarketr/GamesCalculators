import { adoptMePets } from './adopt-me/pets';
import { nightsCatalog } from './99-nights/catalog';
import { bloxFruits } from './blox-fruits/items';
import { fortniteWeapons } from './fortnite/weapons';
import { gardenItems } from './grow-a-garden/items';
import { gtaCharacters, gtaEditionContents, gtaGameplaySystems, gtaLaunchFacts, gtaLocations } from './gta-6/reference';
import { mm2Items } from './mm2/items';
import { ps99Pets } from './pet-simulator-99/pets';
import { brainrots } from './steal-a-brainrot/items';
import type { ValueItem } from './types';

export interface CatalogItem {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  value: number;
  rating: number;
  note: string;
  unit?: string;
  displayValue?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  reviewed?: string;
  lastReviewed?: string;
  ratingLabel?: string;
  ratingMax?: number;
}

const fromValues = (items: ValueItem[], preferIncome = false): CatalogItem[] =>
  items.map((item) => ({
    slug: item.slug,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    value: preferIncome && item.income !== undefined ? item.income : item.value,
    rating: item.demand,
    note: preferIncome && item.income !== undefined
      ? `${item.income.toLocaleString()} cash/sec base income; acquisition cost ${item.value.toLocaleString()}.`
      : item.note ?? 'Reviewed reference value.',
    unit: preferIncome && item.income !== undefined ? 'cash/sec' : item.unit,
    displayValue: `${(preferIncome && item.income !== undefined ? item.income : item.value).toLocaleString()}${preferIncome && item.income !== undefined ? ' cash/sec' : item.unit ? ` ${item.unit}` : ''}`,
    sourceLabel: item.sourceLabel,
    sourceUrl: item.sourceUrl,
    reviewed: item.lastReviewed,
    lastReviewed: item.lastReviewed,
    ratingLabel: item.ratingLabel,
    ratingMax: item.ratingMax,
  }));

const gardenPet = (slug: string, name: string, rarity: string, hunger: number, note: string): CatalogItem => ({
  slug, name, category: 'pet', rarity, value: hunger, rating: 0, note, unit: 'hunger', displayValue: `${hunger.toLocaleString()} hunger`,
  sourceLabel: 'Grow a Garden DB pet reference', sourceUrl: 'https://growagardendb.com/pets', reviewed: '2026-08-28', lastReviewed: '2026-08-28',
});
const gardenPets = [
  gardenPet('starfish', 'Starfish', 'common', 1_500, 'Gains additional XP per second.'),
  gardenPet('crab', 'Crab', 'common', 3_000, 'Occasionally grants a small amount of Sheckles from another player.'),
  gardenPet('seagull', 'Seagull', 'common', 3_500, 'Shoveled plants can drop an equivalent seed; fruits are excluded.'),
  gardenPet('bunny', 'Bunny', 'common', 1_100, 'About every 40 seconds, eats a carrot at a 1.5× value bonus.'),
  gardenPet('dog', 'Dog', 'common', 1_000, 'Every 60 seconds, has a 5% chance to dig up a random seed.'),
  gardenPet('golden-lab', 'Golden Lab', 'common', 1_200, 'Every 60 seconds, has a 10% chance to dig up a Seed Shop seed.'),
  gardenPet('bee', 'Bee', 'uncommon', 25_000, 'About every 25 minutes, applies Pollinated to a nearby fruit.'),
  gardenPet('black-bunny', 'Black Bunny', 'uncommon', 1_300, 'Searches for a carrot and sells it at a marked-up value.'),
  gardenPet('cat', 'Cat', 'uncommon', 1_400, 'Naps every 80 seconds; new fruit within 10 studs grows 1.25× larger.'),
  gardenPet('chicken', 'Chicken', 'uncommon', 3_400, 'Increases egg hatch speed by 10%.'),
  gardenPet('deer', 'Deer', 'uncommon', 2_500, 'Gives berry plants a 3% chance to remain after harvest.'),
  gardenPet('monkey', 'Monkey', 'rare', 7_400, 'About a 2.5% chance to refund harvested fruit; rarer plants have lower odds.'),
  gardenPet('orange-tabby', 'Orange Tabby', 'rare', 1_500, 'Naps every 90 seconds; new fruit within 15 studs grows 1.5× larger.'),
  gardenPet('spotted-deer', 'Spotted Deer', 'rare', 2_500, 'Gives berry plants a 5% chance to remain after harvest.'),
  gardenPet('seal', 'Seal', 'rare', 17_000, 'When selling pets, has a 2.42% chance to return the pet as its egg equivalent.'),
  gardenPet('honey-bee', 'Honey Bee', 'rare', 25_000, 'About every 20 minutes, applies Pollinated to a nearby fruit.'),
  gardenPet('wasp', 'Wasp', 'rare', 28_000, 'Pollinates about every 30 minutes and can advance another pet cooldown.'),
  gardenPet('tarantula-hawk', 'Tarantula Hawk', 'legendary', 28_000, 'Pollinates about every 25 minutes and advances a pet cooldown about every 5 minutes.'),
  gardenPet('capybara', 'Capybara', 'legendary', 30_000, 'Nearby pets do not lose hunger and gain about 3 XP per second.'),
  gardenPet('sand-snake', 'Sand Snake', 'legendary', 28_000, 'Has a 1.31%–3% chance to duplicate a gear or seed-shop purchase.'),
  gardenPet('meerkat', 'Meerkat', 'legendary', 22_000, 'Advances another pet cooldown with a chance to repeat immediately.'),
  gardenPet('parasaurolophus', 'Parasaurolophus', 'legendary', 40_000, 'Reduces the open time of the cosmetic crate with the longest timer.'),
  gardenPet('iguanodon', 'Iguanodon', 'legendary', 40_000, 'Grants bonus XP per second to active Dinosaur-type pets.'),
  gardenPet('pachycephalosaurus', 'Pachycephalosaurus', 'legendary', 40_000, 'Grants a 6% chance to duplicate crafted items.'),
  gardenPet('brown-mouse', 'Brown Mouse', 'mythical', 15_000, 'Gains 750 XP every 8 minutes and increases player jump height by 12%.'),
  gardenPet('giant-ant', 'Giant Ant', 'mythical', 18_000, 'About a 10% chance to duplicate harvested crops, with rarity adjustments.'),
  gardenPet('grey-mouse', 'Grey Mouse', 'mythical', 15_000, 'Gains 500 XP every 10 minutes and increases movement speed by 10%.'),
  gardenPet('praying-mantis', 'Praying Mantis', 'mythical', 55_000, 'Creates a timed zone with 1.5× variant chance for nearby plants.'),
  gardenPet('red-giant-ant', 'Red Giant Ant', 'mythical', 15_000, 'Has a 5% crop-duplication chance plus 5% for fruit-type crops.'),
  gardenPet('snail', 'Snail', 'legendary', 12_000, 'Adds a 5.08% seed-drop chance on harvest and stacks with other Snails.'),
  gardenPet('squirrel', 'Squirrel', 'mythical', 15_000, 'Can save a Reclaimer use and gains additional XP per second.'),
  gardenPet('bear-bee', 'Bear Bee', 'mythical', 45_000, 'About every 25 minutes, applies Honey Glazed to a nearby fruit.'),
  gardenPet('butterfly', 'Butterfly', 'mythical', 26_000, 'Can replace mutations on a heavily mutated fruit with Rainbow.'),
  gardenPet('brontosaurus', 'Brontosaurus', 'mythical', 85_000, 'Increases the base size or weight of hatched pets, subject to a cap.'),
  gardenPet('pack-bee', 'Pack Bee', 'mythical', 25_000, 'Increases backpack size and pollinates a plant about every 25 minutes.'),
  gardenPet('hyacinth-macaw', 'Hyacinth Macaw', 'mythical', 12_000, 'About every 8 minutes, can apply Cloudtouched to a nearby fruit.'),
  gardenPet('axolotl', 'Axolotl', 'mythical', 22_000, 'Gives Summer-type fruit a 6.76% chance to remain after collection.'),
  gardenPet('dilophosaurus', 'Dilophosaurus', 'mythical', 30_000, 'Spits venom to advance cooldowns or grant XP to about three pets.'),
  gardenPet('ankylosaurus', 'Ankylosaurus', 'mythical', 40_000, 'Can return stolen fruit when another player steals from you.'),
  gardenPet('red-fox', 'Red Fox', 'divine', 35_000, 'Attempts to steal seeds from other plots about every 8 minutes.'),
  gardenPet('t-rex', 'T-Rex', 'divine', 60_000, 'Moves a mutation from one fruit to about three other fruits.'),
  gardenPet('dragonfly', 'Dragonfly', 'divine', 100_000, 'About every 5 minutes, turns a random fruit Gold.'),
  gardenPet('spinosaurus', 'Spinosaurus', 'divine', 25_000, 'Devours mutations from three fruits and spreads them to other fruits.'),
  gardenPet('disco-bee', 'Disco Bee', 'divine', 25_000, 'About every 15 minutes, has roughly a 16% chance to apply Disco.'),
  gardenPet('queen-bee', 'Queen Bee', 'divine', 65_000, 'Pollinates fruit and refreshes the active pet with the highest cooldown.'),
  gardenPet('raptor', 'Raptor', 'legendary', 40_000, 'Can grant Amber on collection with a chance that scales with weight.'),
  gardenPet('triceratops', 'Triceratops', 'legendary', 40_000, 'Charges plants to advance growth time and can chain additional uses.'),
  gardenPet('stegosaurus', 'Stegosaurus', 'legendary', 40_000, 'Has a base chance to duplicate harvested fruits, adjusted for rarity.'),
  gardenPet('pterodactyl', 'Pterodactyl', 'mythical', 40_000, 'Can apply Windstruck to nearby fruits with a chance for Twisted instead.'),
  gardenPet('turtle', 'Turtle', 'legendary', 10_000, 'Increases sprinkler duration by about 20%.'),
  gardenPet('petal-bee', 'Petal Bee', 'legendary', 25_000, 'Pollinates fruit and can preserve flower-type fruit after harvest.'),
  gardenPet('moth', 'Moth', 'legendary', 25_000, 'About every 13 minutes, restores all hunger to a random pet.'),
];

export function getToolCatalog(gameSlug: string, toolSlug: string): CatalogItem[] {
  if (gameSlug === 'grow-a-garden') {
    if (toolSlug === 'pets') return gardenPets;
    if (toolSlug === 'items') return [...fromValues(gardenItems), ...gardenPets];
    if (toolSlug === 'best-crops') return fromValues([...gardenItems].sort((a, b) => b.value - a.value).slice(0, 20));
    return fromValues(gardenItems);
  }
  if (gameSlug === 'blox-fruits') return fromValues(bloxFruits);
  if (gameSlug === 'steal-a-brainrot') return fromValues(brainrots, toolSlug === 'income-comparison');
  if (gameSlug === 'adopt-me') return fromValues(adoptMePets);
  if (gameSlug === '99-nights') return fromValues(nightsCatalog);
  if (gameSlug === 'mm2') return fromValues(mm2Items);
  if (gameSlug === 'pet-simulator-99') return fromValues(ps99Pets);
  if (gameSlug === 'fortnite') return fromValues(fortniteWeapons);
  if (gameSlug === 'gta-6') {
    if (toolSlug === 'characters') return gtaCharacters;
    if (toolSlug === 'map-locations') return gtaLocations;
    if (toolSlug === 'gameplay-systems') return gtaGameplaySystems;
    if (toolSlug === 'edition-content') return gtaEditionContents;
    if (toolSlug === 'launch-facts') return gtaLaunchFacts;
  }
  return [];
}
