import { describe, expect, it } from 'vitest';
import type { Pal } from '../../data/palworld/types';
import { calculateBreeding, calculateMutation, calculatePalStats, calculatePassiveInheritance, calculateWorkSpeed, potentialRange } from './calculate';

const pal = (id: string, rank: number, order: number): Pal => ({ id, bpClass: id, name: id, number: String(order), breedingPower: rank, rarity: 1, maleProbability: 50, elements: [], order, isBoss: false, regularEligible: true, baseHp: 70, baseAttack: 70, baseDefense: 70 });

describe('Palworld mechanics', () => {
  it('uses the normal rounded-average rank and deterministic tie order', () => {
    const a = pal('a', 400, 0); const b = pal('b', 600, 1); const early = pal('early', 490, 2); const late = pal('late', 510, 3);
    const result = calculateBreeding(a, b, [early, late], []);
    expect(result.targetRank).toBe(500);
    expect(result.child.id).toBe('early');
  });

  it('applies a special breeding override before rank selection', () => {
    const a = pal('a', 10, 0); const b = pal('b', 20, 1); const special = pal('special', 999, 2);
    expect(calculateBreeding(a, b, [a, b, special], [{ parentAId: 'a', parentBId: 'b', childId: 'special', parentAGender: null, parentBGender: null }]).child.id).toBe('special');
  });

  it('calculates level-one zero-Potential stats with double flooring', () => {
    const result = calculatePalStats(pal('lamball', 1, 1), { level: 1, hpPotential: 0, attackPotential: 0, defensePotential: 0, hpBonusPercent: 0, attackBonusPercent: 0, defenseBonusPercent: 0, soulHpPercent: 0, soulAttackPercent: 0, soulDefensePercent: 0, condensationStars: 0 });
    expect(result).toMatchObject({ hp: 540, attack: 105, defense: 55 });
  });

  it('recovers a displayed-stat Potential interval', () => {
    const fixture = pal('fixture', 1, 1); const inputs = { level: 10, hpBonusPercent: 0, attackBonusPercent: 0, defenseBonusPercent: 0, soulHpPercent: 0, soulAttackPercent: 0, soulDefensePercent: 0, condensationStars: 0 };
    const shown = calculatePalStats(fixture, { ...inputs, hpPotential: 73, attackPotential: 42, defensePotential: 15 });
    const range = potentialRange(fixture, shown, inputs);
    expect(range.hp.minimum).toBeLessThanOrEqual(73); expect(range.hp.maximum).toBeGreaterThanOrEqual(73);
    expect(range.attack.minimum).toBeLessThanOrEqual(42); expect(range.defense.maximum).toBeGreaterThanOrEqual(15);
  });

  it('uses documented inheritance weights and mutation odds', () => {
    const inherit = calculatePassiveInheritance(['Artisan', 'Serious', 'Work Slave', 'Lucky'], ['Artisan', 'Serious', 'Work Slave', 'Lucky']);
    expect(inherit.chanceAllDesired).toBeCloseTo(0.1);
    expect(calculateMutation(100, 0.01).atLeastOne).toBeCloseTo(0.633967, 5);
  });

  it('converts Work Speed to workload per second', () => {
    const result = calculateWorkSpeed({ baseWorkSpeed: 200, passivePercent: 50, foodPercent: 0, soulPercent: 0, buildingPercent: 0, workload: 600 });
    expect(result.effectiveWorkSpeed).toBe(300); expect(result.workPerSecond).toBe(3); expect(result.seconds).toBe(200);
  });
});
