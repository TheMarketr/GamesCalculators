import { palsById, regularBreedingPals } from '../../data/palworld/pals';
import { specialBreedingCombinations } from '../../data/palworld/special-breeding';
import { palStatScaling } from '../../data/palworld/stat-scaling';
import type { Pal } from '../../data/palworld/types';

const rankChildCache = new Map<number, Pal>();
export function calculateBreeding(parentA: Pal, parentB: Pal, candidates = regularBreedingPals, specials = specialBreedingCombinations) {
  const special = specials.find((combo) => (combo.parentAId === parentA.id && combo.parentBId === parentB.id) || (combo.parentAId === parentB.id && combo.parentBId === parentA.id));
  const targetRank = Math.floor((parentA.breedingPower + parentB.breedingPower + 1) / 2);
  if (special) return { child: candidates.find((pal) => pal.id === special.childId) ?? palsById.get(special.childId)!, targetRank, special: true, combination: special };
  const cached = candidates === regularBreedingPals ? rankChildCache.get(targetRank) : undefined;
  const child = cached ?? [...candidates].sort((a, b) => Math.abs(a.breedingPower - targetRank) - Math.abs(b.breedingPower - targetRank) || a.order - b.order || a.name.localeCompare(b.name))[0];
  if (!cached && candidates === regularBreedingPals && child) rankChildCache.set(targetRank, child);
  return { child, targetRank, special: false, combination: null };
}

export interface ReverseBreedingRow { parentA: Pal; parentB: Pal; child: Pal; special: boolean; targetRank: number }
const reverseCache = new Map<string, ReverseBreedingRow[]>();
export function reverseBreeding(childId: string, candidates = regularBreedingPals) {
  const cached = reverseCache.get(childId); if (cached) return cached;
  const rows: ReverseBreedingRow[] = [];
  for (let a = 0; a < candidates.length; a += 1) for (let b = a; b < candidates.length; b += 1) {
    const result = calculateBreeding(candidates[a], candidates[b], candidates);
    if (result.child?.id === childId) rows.push({ parentA: candidates[a], parentB: candidates[b], child: result.child, special: result.special, targetRank: result.targetRank });
  }
  reverseCache.set(childId, rows); return rows;
}

export interface PalStatInput { level: number; hpPotential: number; attackPotential: number; defensePotential: number; hpBonusPercent: number; attackBonusPercent: number; defenseBonusPercent: number; soulHpPercent: number; soulAttackPercent: number; soulDefensePercent: number; condensationStars: number }
export function calculatePalStats(pal: Pick<Pal, 'baseHp' | 'baseAttack' | 'baseDefense'>, input: PalStatInput) {
  if (pal.baseHp === null || pal.baseAttack === null || pal.baseDefense === null) throw new Error('Selected Pal has no reviewed stat-scaling record');
  const level = Math.max(1, input.level); const condense = 1 + Math.max(0, input.condensationStars) * palStatScaling.condensationPerStar;
  const potential = (value: number) => 1 + Math.max(0, Math.min(100, value)) * palStatScaling.potentialRate;
  const stage = (base: number, bonus: number, soul: number) => Math.floor(Math.floor(base) * (1 + bonus / 100) * (1 + soul / 100) * condense);
  const hpBase = palStatScaling.hpBase + palStatScaling.hpPerLevel * level + pal.baseHp * palStatScaling.hpSpeciesRate * level * potential(input.hpPotential);
  const attackBase = palStatScaling.attackBase + pal.baseAttack * palStatScaling.attackSpeciesRate * level * potential(input.attackPotential);
  const defenseBase = palStatScaling.defenseBase + pal.baseDefense * palStatScaling.defenseSpeciesRate * level * potential(input.defensePotential);
  return { hp: stage(hpBase, input.hpBonusPercent, input.soulHpPercent), attack: stage(attackBase, input.attackBonusPercent, input.soulAttackPercent), defense: stage(defenseBase, input.defenseBonusPercent, input.soulDefensePercent), baseHpStage: Math.floor(hpBase), baseAttackStage: Math.floor(attackBase), baseDefenseStage: Math.floor(defenseBase), condensationMultiplier: condense };
}

export function potentialRange(pal: Pick<Pal, 'baseHp' | 'baseAttack' | 'baseDefense'>, displayed: { hp: number; attack: number; defense: number }, input: Omit<PalStatInput, 'hpPotential' | 'attackPotential' | 'defensePotential'>) {
  const matching = { hp: [] as number[], attack: [] as number[], defense: [] as number[] };
  for (let value = 0; value <= 100; value += 1) {
    const stats = calculatePalStats(pal, { ...input, hpPotential: value, attackPotential: value, defensePotential: value });
    if (stats.hp === displayed.hp) matching.hp.push(value);
    if (stats.attack === displayed.attack) matching.attack.push(value);
    if (stats.defense === displayed.defense) matching.defense.push(value);
  }
  const range = (values: number[], target: number, key: 'hp' | 'attack' | 'defense') => {
    if (values.length) return { minimum: values[0], maximum: values.at(-1)!, exactDisplayMatch: true };
    const nearest = Array.from({ length: 101 }, (_, value) => ({ value, gap: Math.abs(calculatePalStats(pal, { ...input, hpPotential: value, attackPotential: value, defensePotential: value })[key] - target) })).sort((a, b) => a.gap - b.gap)[0];
    return { minimum: nearest.value, maximum: nearest.value, exactDisplayMatch: false };
  };
  return { hp: range(matching.hp, displayed.hp, 'hp'), attack: range(matching.attack, displayed.attack, 'attack'), defense: range(matching.defense, displayed.defense, 'defense') };
}

const choose = (n: number, k: number) => { if (k < 0 || k > n) return 0; let value = 1; for (let i = 1; i <= k; i += 1) value = value * (n - k + i) / i; return value; };
export function calculatePassiveInheritance(parentPassives: string[], desiredPassives: string[]) {
  const pool = [...new Set(parentPassives.filter(Boolean))]; const desired = [...new Set(desiredPassives.filter((name) => pool.includes(name)))]; const weights = [{ count: 1, probability: 0.4 }, { count: 2, probability: 0.3 }, { count: 3, probability: 0.2 }, { count: 4, probability: 0.1 }];
  const chanceAllDesired = weights.reduce((sum, roll) => { const inherited = Math.min(roll.count, pool.length); const chance = inherited >= desired.length && desired.length > 0 ? choose(pool.length - desired.length, inherited - desired.length) / choose(pool.length, inherited) : desired.length === 0 ? 1 : 0; return sum + roll.probability * chance; }, 0);
  const chanceAllWithoutRandom = desired.length >= 4 ? chanceAllDesired : chanceAllDesired * 0.4;
  return { uniqueParentPassives: pool.length, desiredAvailable: desired.length, chanceAllDesired, chanceAllWithoutRandom, riskAdditionalRandom: desired.length >= 4 ? 0 : 0.6 };
}

export function calculateMutation(eggs: number, probability: number) {
  const count = Math.max(0, Math.floor(eggs)); const p = Math.max(0, Math.min(1, probability)); const zero = (1 - p) ** count;
  return { perEgg: p, atLeastOne: 1 - zero, zero, expected: count * p, eggs: count };
}

export function calculateWorkSpeed(input: { baseWorkSpeed: number; passivePercent: number; foodPercent: number; soulPercent: number; buildingPercent: number; workload: number }) {
  const multiplier = (1 + input.passivePercent / 100) * (1 + input.foodPercent / 100) * (1 + input.soulPercent / 100) * (1 + input.buildingPercent / 100);
  const effectiveWorkSpeed = Math.max(0.0001, input.baseWorkSpeed * multiplier); const workPerSecond = effectiveWorkSpeed / 100; const seconds = Math.ceil(Math.max(0, input.workload) / workPerSecond); const baselineSeconds = Math.ceil(Math.max(0, input.workload) / (Math.max(0.0001, input.baseWorkSpeed) / 100));
  return { effectiveWorkSpeed, workPerSecond, seconds, baselineSeconds, timeSaved: Math.max(0, baselineSeconds - seconds), multiplier };
}
