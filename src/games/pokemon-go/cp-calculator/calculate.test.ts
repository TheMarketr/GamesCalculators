import { describe, expect, it } from 'vitest';
import { calculatePokemonStats, getCpMultiplier } from './calculate';

describe('Pokémon GO CP calculation', () => {
  it('matches the known perfect level 20 Mewtwo raid CP fixture', () => {
    const result = calculatePokemonStats({ baseAttack: 300, baseDefense: 182, baseStamina: 214 }, 20, { attack: 15, defense: 15, stamina: 15 });
    expect(result.cp).toBe(2387);
    expect(result.hp).toBe(136);
    expect(result.ivPercent).toBe(100);
  });

  it('enforces the CP and HP minimums', () => {
    const result = calculatePokemonStats({ baseAttack: 1, baseDefense: 1, baseStamina: 1 }, 1, { attack: 0, defense: 0, stamina: 0 });
    expect(result.cp).toBe(10);
    expect(result.hp).toBe(10);
  });

  it('reads reviewed integer and half-level multipliers', () => {
    expect(getCpMultiplier(20)).toBeCloseTo(0.5974, 7);
    expect(getCpMultiplier(40.5)).toBeGreaterThan(getCpMultiplier(40));
    expect(getCpMultiplier(50)).toBeCloseTo(0.8403, 7);
  });
});
