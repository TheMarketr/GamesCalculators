import { describe, expect, it } from 'vitest';
import { nightsClasses, nightsFood, nightsRecipes } from './99-nights/catalog';
import { adoptMePets } from './adopt-me/pets';
import { bloxFruits } from './blox-fruits/items';
import { fortniteWeapons } from './fortnite/weapons';
import { fortniteXpMilestones, fortniteXpReview } from './fortnite/xp';
import { gardenItems } from './grow-a-garden/items';
import { mm2Items } from './mm2/items';
import { ps99Pets } from './pet-simulator-99/pets';
import { brainrots } from './steal-a-brainrot/items';
import { getToolCatalog } from './tool-catalogs';
import type { ValueItem } from './types';

const datasets: Record<string, { items: ValueItem[]; minimum: number }> = {
  mm2: { items: mm2Items, minimum: 50 },
  ps99: { items: ps99Pets, minimum: 50 },
  garden: { items: gardenItems, minimum: 50 },
  blox: { items: bloxFruits, minimum: 41 },
  brainrot: { items: brainrots, minimum: 40 },
  adoptMe: { items: adoptMePets, minimum: 25 },
  nightsClasses: { items: nightsClasses, minimum: 25 },
  nightsFood: { items: nightsFood, minimum: 10 },
  nightsRecipes: { items: nightsRecipes, minimum: 10 },
  fortniteWeapons: { items: fortniteWeapons, minimum: 40 },
};

describe('expanded game datasets', () => {
  for (const [name, dataset] of Object.entries(datasets)) {
    it(`${name} has enough unique, sourced records`, () => {
      expect(dataset.items.length).toBeGreaterThanOrEqual(dataset.minimum);
      expect(new Set(dataset.items.map((item) => item.slug)).size).toBe(dataset.items.length);
      expect(dataset.items.every((item) => item.value > 0)).toBe(true);
      expect(dataset.items.every((item) => item.updated === '2026-08-28')).toBe(true);
      expect(dataset.items.every((item) => Boolean(item.sourceLabel && item.sourceUrl && item.unit))).toBe(true);
    });
  }

  it('keeps benchmark records tied to the reviewed metric', () => {
    expect(bloxFruits.find((item) => item.slug === 'dragon')?.value).toBe(15_000_000);
    expect(gardenItems.find((item) => item.slug === 'bone-blossom')?.baseWeight).toBe(2.85);
    expect(brainrots.find((item) => item.slug === 'garama-and-madundung')?.income).toBe(50_000_000);
    expect(ps99Pets.find((item) => item.slug === 'huge-empyrean-axolotl')?.value).toBe(915_200_000_000);
    expect(mm2Items.find((item) => item.slug === 'gingerscope')?.value).toBe(17_750);
    expect(adoptMePets.find((item) => item.slug === 'bat-dragon')?.value).toBe(288);
  });

  it('builds the Fortnite XP milestone table from the reviewed per-level rate', () => {
    expect(fortniteXpReview.xpPerLevel).toBe(80_000);
    expect(fortniteXpMilestones.find((row) => row.levels === 100)?.xp).toBe(8_000_000);
  });

  it('uses sourced Grow a Garden pet records instead of generic utility profiles', () => {
    const pets = getToolCatalog('grow-a-garden', 'pets');
    expect(pets.length).toBeGreaterThanOrEqual(50);
    expect(pets.every((pet) => pet.sourceLabel === 'Grow a Garden DB pet reference')).toBe(true);
    expect(pets.find((pet) => pet.slug === 'dragonfly')?.displayValue).toBe('100,000 hunger');
  });
});
