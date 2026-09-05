import { describe, expect, it } from 'vitest';
import gePrices from './osrs/ge-prices.json';
import { osrsSkills } from './osrs/skills';
import { osrsTrainingMethods } from './osrs/training-methods';
import { cpMultipliers, cpMultiplierMeta } from './pokemon-go/cp-multipliers';
import { pokemonEvolutions, evolutionMeta } from './pokemon-go/evolutions';
import { pokemonSpecies, pokemonSpeciesMeta } from './pokemon-go/species';
import { trainerXpByLevel, trainerXpMeta } from './pokemon-go/trainer-xp';
import { pals, palworldMeta, statPals } from './palworld/pals';
import { specialBreedingCombinations, specialBreedingMeta } from './palworld/special-breeding';
import { games, publishedTools } from './games';

const validReviewDate = (value: string) => /^20\d{2}-\d{2}-\d{2}$/.test(value);

describe('Pokémon GO static data', () => {
  it('keeps species IDs unique with reviewed source metadata', () => {
    expect(pokemonSpecies.length).toBeGreaterThan(1_000);
    expect(new Set(pokemonSpecies.map((species) => species.id)).size).toBe(pokemonSpecies.length);
    expect(pokemonSpecies.every((species) => species.baseAttack > 0 && species.baseDefense > 0 && species.baseStamina > 0)).toBe(true);
    expect(pokemonSpeciesMeta.sourceUrl).toMatch(/^https:/);
    expect(validReviewDate(pokemonSpeciesMeta.reviewed)).toBe(true);
  });

  it('contains half-level multipliers, evolution edges and trainer XP thresholds', () => {
    expect(cpMultipliers.length).toBeGreaterThanOrEqual(99);
    expect(cpMultipliers.every((row) => row.level >= 1 && row.level <= 50 && row.multiplier > 0 && row.multiplier < 1)).toBe(true);
    expect(pokemonEvolutions.length).toBeGreaterThan(500);
    expect(trainerXpByLevel.size).toBeGreaterThanOrEqual(50);
    for (const meta of [cpMultiplierMeta, evolutionMeta, trainerXpMeta]) expect(validReviewDate(meta.reviewed)).toBe(true);
  });
});

describe('OSRS static data', () => {
  it('covers every skill with at least one sourced training method', () => {
    expect(new Set(osrsTrainingMethods.map((method) => method.id)).size).toBe(osrsTrainingMethods.length);
    for (const skill of osrsSkills) expect(osrsTrainingMethods.some((method) => method.skill === skill)).toBe(true);
    expect(osrsTrainingMethods.every((method) => method.xpPerAction > 0 && method.sourceUrl.startsWith('https://') && validReviewDate(method.reviewed))).toBe(true);
  });

  it('ships a dated local GE snapshot instead of a runtime price dependency', () => {
    expect(gePrices.records.length).toBeGreaterThan(4_000);
    expect(new Set(gePrices.records.map((item) => item.id)).size).toBe(gePrices.records.length);
    expect(validReviewDate(gePrices.meta.reviewed)).toBe(true);
    expect(Number.isNaN(Date.parse(gePrices.meta.snapshotTimestamp))).toBe(false);
  });
});

describe('Palworld static data', () => {
  it('keeps Pal IDs unique and validates stat ranges', () => {
    expect(pals.length).toBeGreaterThan(200);
    expect(new Set(pals.map((pal) => pal.id)).size).toBe(pals.length);
    expect(statPals.length).toBeGreaterThan(150);
    expect(statPals.every((pal) => pal.baseHp! > 0 && pal.baseAttack! > 0 && pal.baseDefense! > 0)).toBe(true);
    expect(validReviewDate(palworldMeta.reviewed)).toBe(true);
  });

  it('keeps every special breeding reference connected to a known Pal', () => {
    const ids = new Set(pals.map((pal) => pal.id));
    expect(specialBreedingCombinations.length).toBeGreaterThan(150);
    expect(specialBreedingCombinations.every((combo) => ids.has(combo.parentAId) && ids.has(combo.parentBId) && ids.has(combo.childId))).toBe(true);
    expect(validReviewDate(specialBreedingMeta.reviewed)).toBe(true);
  });
});

describe('new cluster registration', () => {
  it('publishes all requested hubs, tools and semantic related links', () => {
    const expectedCounts = { 'pokemon-go': 9, osrs: 16, palworld: 8 } as const;
    for (const [slug, count] of Object.entries(expectedCounts)) {
      const game = games.find((entry) => entry.slug === slug);
      expect(game?.tools).toHaveLength(count);
      expect(game?.tools.every((tool) => tool.related?.length === 3)).toBe(true);
      expect(game?.tools.every((tool) => tool.related?.every((related) => game.tools.some((candidate) => candidate.slug === related)))).toBe(true);
    }
    expect(publishedTools.filter((tool) => tool.game.slug === 'pokemon-go' || tool.game.slug === 'osrs' || tool.game.slug === 'palworld')).toHaveLength(33);
  });
});
