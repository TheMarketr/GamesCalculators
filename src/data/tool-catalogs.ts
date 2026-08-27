import { adoptMePets } from './adopt-me/pets';
import { bloxFruits } from './blox-fruits/items';
import { gardenItems } from './grow-a-garden/items';
import { brainrots } from './steal-a-brainrot/items';

export interface CatalogItem {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  value: number;
  rating: number;
  note: string;
}

const fromValues = (items: { slug: string; name: string; category: string; rarity: string; value: number; demand: number; income?: number }[], preferIncome = false): CatalogItem[] =>
  items.map((item) => ({
    slug: item.slug,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    value: preferIncome && item.income !== undefined ? item.income : item.value,
    rating: item.demand,
    note: preferIncome && item.income !== undefined ? `${item.income.toLocaleString()} income/sec reference` : 'Editable local planning value',
  }));

const rows = (items: [string, string, string, string, number, number, string][]): CatalogItem[] =>
  items.map(([slug, name, category, rarity, value, rating, note]) => ({ slug, name, category, rarity, value, rating, note }));

const gardenPets = rows([
  ['red-fox', 'Red Fox', 'utility', 'rare', 72, 7.6, 'Stealing-crop utility profile'],
  ['dragonfly', 'Dragonfly', 'mutation', 'divine', 96, 9.2, 'Mutation-focused utility profile'],
  ['raccoon', 'Raccoon', 'utility', 'divine', 90, 8.8, 'High-impact utility profile'],
  ['moon-cat', 'Moon Cat', 'growth', 'legendary', 68, 7.2, 'Growth-focused utility profile'],
  ['polar-bear', 'Polar Bear', 'growth', 'legendary', 61, 6.8, 'Harvest support profile'],
  ['bee', 'Bee', 'pollination', 'rare', 54, 6.5, 'Pollination support profile'],
]);

const nightsItems = rows([
  ['scout-profile', 'Scout loadout', 'role profile', 'mobile', 78, 8.1, 'Mobility and early exploration'],
  ['medic-profile', 'Medic loadout', 'role profile', 'support', 74, 8.5, 'Healing and party recovery'],
  ['builder-profile', 'Builder loadout', 'role profile', 'utility', 82, 8.0, 'Base upgrades and crafting'],
  ['gatherer-profile', 'Gatherer loadout', 'role profile', 'economy', 80, 7.8, 'Food, wood and fuel gathering'],
  ['wood', 'Wood', 'resource', 'common', 12, 9.0, 'Core campfire and crafting resource'],
  ['fuel-can', 'Fuel Can', 'fuel', 'uncommon', 36, 8.7, 'Compact fuel reserve'],
  ['cooked-meal', 'Cooked Meal', 'food', 'common', 18, 8.4, 'Party food planning unit'],
  ['bandage', 'Bandage', 'medical', 'uncommon', 24, 8.2, 'Emergency recovery supply'],
  ['scrap', 'Scrap', 'crafting', 'common', 16, 7.9, 'General crafting material'],
  ['bolt', 'Bolt', 'crafting', 'uncommon', 22, 7.6, 'Advanced crafting material'],
]);

const mm2Items = rows([
  ['corrupt', 'Corrupt', 'knife', 'unique', 950, 9.8, 'Editable community-market planning index'],
  ['harvester', 'Harvester', 'gun', 'ancient', 875, 9.4, 'Editable community-market planning index'],
  ['icepiercer', 'Icepiercer', 'gun', 'ancient', 820, 9.2, 'Editable community-market planning index'],
  ['batwing', 'Batwing', 'knife', 'ancient', 120, 8.2, 'Editable community-market planning index'],
  ['luger', 'Luger', 'gun', 'godly', 78, 8.6, 'Editable community-market planning index'],
  ['laser', 'Laser', 'gun', 'godly', 55, 8.1, 'Editable community-market planning index'],
  ['lightbringer', 'Lightbringer', 'gun', 'godly', 42, 7.8, 'Editable community-market planning index'],
  ['darkbringer', 'Darkbringer', 'gun', 'godly', 40, 7.7, 'Editable community-market planning index'],
  ['seer', 'Seer', 'knife', 'godly', 8, 6.4, 'Editable community-market planning index'],
]);

const ps99Items = rows([
  ['titanic-cat', 'Titanic Cat', 'pet', 'titanic', 12000000000, 9.8, 'Editable diamond planning reference'],
  ['titanic-red-panda', 'Titanic Red Panda', 'pet', 'titanic', 9800000000, 9.5, 'Editable diamond planning reference'],
  ['huge-cat', 'Huge Cat', 'pet', 'huge', 175000000, 9.3, 'Editable diamond planning reference'],
  ['huge-dragon', 'Huge Dragon', 'pet', 'huge', 132000000, 8.9, 'Editable diamond planning reference'],
  ['huge-happy-rock', 'Huge Happy Rock', 'pet', 'huge', 42000000, 8.4, 'Editable diamond planning reference'],
  ['rainbow-exclusive', 'Rainbow Exclusive', 'pet', 'exclusive', 12000000, 7.8, 'Editable diamond planning reference'],
  ['gold-exclusive', 'Golden Exclusive', 'pet', 'exclusive', 6500000, 7.3, 'Editable diamond planning reference'],
  ['exclusive-pet', 'Exclusive Pet', 'pet', 'exclusive', 2200000, 6.9, 'Editable diamond planning reference'],
]);

const fortniteWeapons = rows([
  ['balanced-ar', 'Balanced Assault Rifle', 'rifle', 'archetype', 185, 8.5, 'Balanced mid-range planning profile'],
  ['burst-ar', 'Burst Assault Rifle', 'rifle', 'archetype', 198, 8.2, 'Burst accuracy planning profile'],
  ['pump-shotgun', 'Pump Shotgun', 'shotgun', 'archetype', 170, 9.0, 'High single-shot planning profile'],
  ['auto-shotgun', 'Auto Shotgun', 'shotgun', 'archetype', 205, 8.4, 'Close-range sustained profile'],
  ['rapid-smg', 'Rapid SMG', 'smg', 'archetype', 218, 8.1, 'High fire-rate planning profile'],
  ['precision-dmr', 'Precision DMR', 'marksman', 'archetype', 142, 7.8, 'Long-range planning profile'],
]);

const gtaCharacters = rows([
  ['lucia-caminos', 'Lucia Caminos', 'protagonist', 'confirmed', 95, 9.8, 'Central playable character'],
  ['jason-duval', 'Jason Duval', 'protagonist', 'confirmed', 95, 9.8, 'Central playable character'],
  ['cal-hampton', 'Cal Hampton', 'associate', 'confirmed', 72, 7.8, 'Jason associate'],
  ['boobie-ike', 'Boobie Ike', 'entrepreneur', 'confirmed', 78, 8.0, 'Vice City entrepreneur'],
  ['dre-quan-priest', "Dre'Quan Priest", 'music', 'confirmed', 76, 7.9, 'Music-industry character'],
  ['real-dimez', 'Real Dimez', 'music', 'confirmed', 74, 7.7, 'Rap duo profile'],
  ['raul-bautista', 'Raul Bautista', 'robbery crew', 'confirmed', 84, 8.5, 'Experienced bank robber'],
  ['brian-heder', 'Brian Heder', 'associate', 'confirmed', 70, 7.5, 'Veteran smuggler'],
]);

const gtaLocations = rows([
  ['vice-city', 'Vice City', 'city', 'confirmed region', 100, 10, 'Urban center of the Leonida setting'],
  ['leonida-keys', 'Leonida Keys', 'coast', 'confirmed region', 76, 8.5, 'Island-chain region'],
  ['grassrivers', 'Grassrivers', 'wetlands', 'confirmed region', 72, 8.2, 'Wetlands region'],
  ['port-gellhorn', 'Port Gellhorn', 'city', 'confirmed region', 80, 8.6, 'Coastal city region'],
  ['ambrosia', 'Ambrosia', 'industrial', 'confirmed region', 68, 7.8, 'Industrial region'],
  ['mount-kalaga', 'Mount Kalaga', 'nature', 'confirmed region', 74, 8.0, 'Northern wilderness region'],
]);

export function getToolCatalog(gameSlug: string, toolSlug: string): CatalogItem[] {
  if (gameSlug === 'grow-a-garden') return toolSlug === 'pets' ? gardenPets : fromValues(gardenItems);
  if (gameSlug === 'blox-fruits') return fromValues(bloxFruits);
  if (gameSlug === 'steal-a-brainrot') return fromValues(brainrots, toolSlug === 'income-comparison');
  if (gameSlug === 'adopt-me') return fromValues(adoptMePets);
  if (gameSlug === '99-nights') return nightsItems;
  if (gameSlug === 'mm2') return mm2Items;
  if (gameSlug === 'pet-simulator-99') return ps99Items;
  if (gameSlug === 'fortnite') return fortniteWeapons;
  if (gameSlug === 'gta-6') return toolSlug === 'characters' ? gtaCharacters : gtaLocations;
  return [];
}
