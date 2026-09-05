import { describe, expect, it } from 'vitest';
import { levelForXp, xpForLevel } from '../../data/osrs/xp';
import { calculateCombatLevel, calculateDropProbability, calculateDps, calculateMaxHit, calculateToaUniqueChance, hitChance } from './calculate';

describe('OSRS exact formulas', () => {
  it('matches the level 99 XP threshold and reverse lookup', () => {
    expect(xpForLevel(99)).toBe(13_034_431);
    expect(levelForXp(13_034_430, 99)).toBe(98);
    expect(levelForXp(13_034_431, 99)).toBe(99);
  });

  it('matches common combat-level endpoints', () => {
    expect(calculateCombatLevel({ attack: 1, strength: 1, defence: 1, hitpoints: 10, ranged: 1, magic: 1, prayer: 1 }).combatLevel).toBe(3);
    expect(calculateCombatLevel({ attack: 99, strength: 99, defence: 99, hitpoints: 99, ranged: 99, magic: 99, prayer: 99 }).combatLevel).toBe(126);
  });

  it('uses the independent-attempt drop formula and reverse milestones', () => {
    const result = calculateDropProbability('1/512', 512);
    expect(result.atLeastOne).toBeCloseTo(0.63248, 4);
    expect(result.expectedDrops).toBe(1);
    expect(result.milestones.find((row) => row.target === 0.5)?.kills).toBe(355);
    expect(calculateDropProbability('1/1', 1).milestones.every((row) => row.kills === 1)).toBe(true);
    expect(calculateDropProbability('not-a-rate', 100).probability).toBe(0);
  });

  it('calculates a melee max hit with visible effective-level steps', () => {
    const result = calculateMaxHit({ style: 'melee', level: 99, boost: 19, prayerMultiplier: 1.23, styleBonus: 3, strengthBonus: 132 });
    expect(result.effectiveLevel).toBe(156);
    expect(result.finalMaxHit).toBe(48);
  });

  it('keeps hit chance and DPS deterministic', () => {
    expect(hitChance(10_000, 5_000)).toBeCloseTo(0.749925, 5);
    const result = calculateDps({ style: 'melee', level: 99, boost: 19, attackPrayer: 1.2, strengthPrayer: 1.23, attackStyleBonus: 3, strengthStyleBonus: 3, attackBonus: 100, strengthBonus: 132, attackSpeed: 4, monster: { id: 'fixture', name: 'Fixture', combatLevel: 1, hitpoints: 100, defenceLevel: 100, defenceStab: 0, defenceSlash: 0, defenceCrush: 0, defenceMagic: 0, defenceRanged: 0, source: 'Fixture', sourceUrl: 'https://example.com', reviewed: '2026-09-05' }, monsterDefenceBonus: 50 });
    expect(result.maxHit).toBe(48);
    expect(result.dps).toBeGreaterThan(5);
  });

  it('uses the current ToA scaled raid-level formula', () => {
    const result = calculateToaUniqueChance(400, 37_000);
    expect(result.scaledRaidLevel).toBe(340);
    expect(result.pointsPerPercent).toBe(3_700);
    expect(result.chancePercent).toBe(10);
  });
});
