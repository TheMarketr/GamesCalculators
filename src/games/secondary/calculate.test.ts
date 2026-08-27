import { describe, expect, it } from 'vitest';
import { calculateSecondary } from './calculate';

const metric = (formula: Parameters<typeof calculateSecondary>[0], values: Record<string, number>, label: string) =>
  calculateSecondary(formula, values).find((item) => item.label === label)?.value;

describe('secondary calculator formulas', () => {
  it('stacks mutation multipliers and quantity', () => {
    expect(metric('mutation', { base: 100, primary: 2, secondary: 5, quantity: 3 }, 'Total value')).toBe(3000);
  });

  it('calculates profit after initial crop cost', () => {
    expect(metric('profit', { cost: 100, sale: 60, harvests: 3, quantity: 2 }, 'Profit')).toBe(160);
  });

  it('calculates probability across repeated independent attempts', () => {
    expect(metric('odds', { chance: 10, attempts: 2, boost: 1 }, 'At least one after attempts')).toBeCloseTo(19);
  });

  it('uses the four-pet neon requirement', () => {
    expect(metric('neon', { owned: 2, fullGrown: 1, tasksPerPet: 100 }, 'Pets still needed')).toBe(2);
    expect(metric('neon', { owned: 2, fullGrown: 1, tasksPerPet: 100 }, 'Estimated tasks remaining')).toBe(300);
  });

  it('uses the sixteen-pet mega requirement', () => {
    expect(metric('mega', { owned: 8, fullGrown: 4, tasksPerPet: 100 }, 'Pets still needed')).toBe(8);
  });

  it('converts Overworld coordinates to Nether coordinates', () => {
    expect(metric('coordinates', { x: 800, z: -400, scale: 8 }, 'Nether X')).toBe(100);
    expect(metric('coordinates', { x: 800, z: -400, scale: 8 }, 'Nether Z')).toBe(-50);
  });

  it('calculates three-dimensional distance', () => {
    expect(metric('distance', { x1: 0, y1: 0, z1: 0, x2: 3, y2: 4, z2: 0 }, '3D distance')).toBe(5);
  });

  it('converts items into stacks and leftovers', () => {
    expect(metric('stack', { count: 130, stackSize: 64 }, 'Full stacks')).toBe(2);
    expect(metric('stack', { count: 130, stackSize: 64 }, 'Leftover items')).toBe(2);
  });

  it('calculates eDPI from DPI and sensitivity percent', () => {
    expect(metric('edpi', { dpi: 800, sensitivity: 6.5 }, 'eDPI')).toBe(52);
  });

  it('preserves eDPI during sensitivity conversion', () => {
    expect(metric('sensitivity', { currentDpi: 800, currentSensitivity: 6, targetDpi: 1600 }, 'Matching new sensitivity')).toBe(3);
  });

  it('uses the first hit at time zero for TTK', () => {
    expect(metric('ttk', { damage: 50, rpm: 600, health: 200 }, 'Shots to eliminate')).toBe(4);
    expect(metric('ttk', { damage: 50, rpm: 600, health: 200 }, 'Estimated TTK')).toBeCloseTo(.3);
  });

  it('flags a high anvil cost', () => {
    expect(metric('anvil', { itemCost: 20, enchantCost: 20, priorWorks: 1, rename: 0 }, 'Survival result')).toBe('Too Expensive');
  });

  it('calculates remaining run progress', () => {
    expect(metric('progress', { current: 37, target: 99, players: 4 }, 'Nights remaining')).toBe(62);
  });

  it('calculates a purchase total with tax', () => {
    expect(metric('gta-cost', { base: 70, extras: 10, tax: 10, saved: 0 }, 'Estimated checkout total')).toBeCloseTo(88);
  });

  it('calculates a map scenario area', () => {
    expect(metric('map-size', { width: 12, height: 10, speed: 60 }, 'Scenario area')).toBe(120);
  });

  it('calculates GTA VI mission profit per run', () => {
    expect(metric('gta-mission', { payout: 100000, cost: 10000, bonus: 10, minutes: 20, runs: 3 }, 'Net payout per run')).toBeCloseTo(100000);
  });

  it('splits a GTA VI crew payout after costs', () => {
    expect(metric('gta-split', { take: 500000, cost: 50000, players: 4, leader: 40 }, 'Leader payout')).toBe(180000);
    expect(metric('gta-split', { take: 500000, cost: 50000, players: 4, leader: 40 }, 'Each other crew member')).toBe(90000);
  });

  it('reduces wanted planning risk after vehicle and outfit changes', () => {
    const before = Number(metric('gta-wanted', { witnesses: 3, heat: 3, knownVehicle: 1, knownOutfit: 1, changedVehicle: 0, changedOutfit: 0 }, 'Planning risk score'));
    const after = Number(metric('gta-wanted', { witnesses: 3, heat: 3, knownVehicle: 1, knownOutfit: 1, changedVehicle: 1, changedOutfit: 1 }, 'Planning risk score'));
    expect(after).toBeLessThan(before);
  });
});
