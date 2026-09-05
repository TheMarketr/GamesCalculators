import { describe, expect, it } from 'vitest';
import { calculateEvolutionRange, calculatePowerUpCost, calculatePokemonStats, calculateTrade, calculateTrainerXp, purifyIvs, trainerLevelFromXp } from './calculate';

describe('Pokémon GO progression calculations', () => {
  it('keeps IVs through an exact evolution calculation', () => {
    const bulbasaur = { id: '1-normal', dex: 1, name: 'Bulbasaur', form: 'Normal', baseAttack: 118, baseDefense: 111, baseStamina: 128 };
    const ivysaur = { id: '2-normal', dex: 2, name: 'Ivysaur', form: 'Normal', baseAttack: 151, baseDefense: 143, baseStamina: 155 };
    expect(calculatePokemonStats(ivysaur, 20, { attack: 15, defense: 15, stamina: 15 }).cp).toBeGreaterThan(calculatePokemonStats(bulbasaur, 20, { attack: 15, defense: 15, stamina: 15 }).cp);
    const range = calculateEvolutionRange(bulbasaur, ivysaur, calculatePokemonStats(bulbasaur, 20, { attack: 15, defense: 15, stamina: 15 }).cp);
    expect(range.minimum).toBeLessThanOrEqual(calculatePokemonStats(ivysaur, 20, { attack: 15, defense: 15, stamina: 15 }).cp);
    expect(range.maximum).toBeGreaterThanOrEqual(range.minimum);
  });

  it('adds two purification IV points without exceeding 15', () => {
    expect(purifyIvs({ attack: 13, defense: 14, stamina: 7 })).toEqual({ attack: 15, defense: 15, stamina: 9 });
  });

  it('sums reviewed half-level power-up costs', () => {
    expect(calculatePowerUpCost(1, 2)).toEqual({ stardust: 400, candy: 2, candyXl: 0, powerUps: 2 });
  });

  it('looks trainer levels up in the current Game Master table', () => {
    expect(trainerLevelFromXp(0)).toBe(1);
    expect(trainerLevelFromXp(2_500)).toBe(2);
    expect(calculateTrainerXp(1, 0, 2).xpRemaining).toBe(2_500);
  });

  it('applies trade friendship and distance rules', () => {
    expect(calculateTrade('best', 'special-unregistered', 120)).toMatchObject({ stardust: 40_000, candy: 3, guaranteedCandyXl: true });
  });
});
