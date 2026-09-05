import { cpMultiplierByLevel, pokemonLevels } from '../../data/pokemon-go/cp-multipliers';
import { powerUpCostByLevel } from '../../data/pokemon-go/power-up-costs';
import { trainerXpByLevel } from '../../data/pokemon-go/trainer-xp';
import { pokemonGoTradeRules, type FriendshipLevel, type TradePokemonClass } from '../../data/pokemon-go/trade-rules';
import type { PokemonMove, PokemonSpecies } from '../../data/pokemon-go/types';

export type PokemonIvs = { attack: number; defense: number; stamina: number };
export type PokemonStatsResult = {
  cp: number;
  hp: number;
  effectiveAttack: number;
  effectiveDefense: number;
  effectiveStamina: number;
  statProduct: number;
  ivPercent: number;
  level: number;
  multiplier: number;
  formulaNumerator: number;
};

const clampIv = (value: number) => Math.max(0, Math.min(15, Math.round(value)));
export const getCpMultiplier = (level: number) => {
  const multiplier = cpMultiplierByLevel.get(level);
  if (!multiplier) throw new Error(`No reviewed Pokémon GO CP multiplier for level ${level}`);
  return multiplier;
};

export function calculatePokemonStats(species: Pick<PokemonSpecies, 'baseAttack' | 'baseDefense' | 'baseStamina'>, level: number, ivs: PokemonIvs): PokemonStatsResult {
  const attackIv = clampIv(ivs.attack);
  const defenseIv = clampIv(ivs.defense);
  const staminaIv = clampIv(ivs.stamina);
  const multiplier = getCpMultiplier(level);
  const effectiveAttack = (species.baseAttack + attackIv) * multiplier;
  const effectiveDefense = (species.baseDefense + defenseIv) * multiplier;
  const effectiveStamina = (species.baseStamina + staminaIv) * multiplier;
  const formulaNumerator = (species.baseAttack + attackIv) * Math.sqrt(species.baseDefense + defenseIv) * Math.sqrt(species.baseStamina + staminaIv) * multiplier ** 2;
  const cp = Math.max(10, Math.floor(formulaNumerator / 10));
  const hp = Math.max(10, Math.floor(effectiveStamina));
  return {
    cp,
    hp,
    effectiveAttack,
    effectiveDefense,
    effectiveStamina,
    statProduct: effectiveAttack * effectiveDefense * hp,
    ivPercent: (attackIv + defenseIv + staminaIv) / 45 * 100,
    level,
    multiplier,
    formulaNumerator,
  };
}

export const purifyIvs = (ivs: PokemonIvs) => ({
  attack: Math.min(15, clampIv(ivs.attack) + 2),
  defense: Math.min(15, clampIv(ivs.defense) + 2),
  stamina: Math.min(15, clampIv(ivs.stamina) + 2),
});

export function calculatePowerUpCost(currentLevel: number, targetLevel: number) {
  let stardust = 0; let candy = 0; let candyXl = 0; let powerUps = 0;
  for (let level = currentLevel; level < targetLevel; level += 0.5) {
    const cost = powerUpCostByLevel.get(level);
    if (!cost) throw new Error(`No reviewed power-up cost for Pokémon level ${level}`);
    stardust += cost.stardust_to_upgrade;
    candy += cost.candy_to_upgrade;
    candyXl += cost.xl_candy_to_upgrade;
    powerUps += 1;
  }
  return { stardust, candy, candyXl, powerUps };
}

export function calculateTrainerXp(currentLevel: number, currentXp: number, targetLevel: number) {
  const currentFloor = trainerXpByLevel.get(currentLevel);
  const targetXp = trainerXpByLevel.get(targetLevel);
  if (currentFloor === undefined || targetXp === undefined) throw new Error('Trainer level is outside the reviewed XP table');
  const totalCurrentXp = Math.max(currentFloor, currentXp);
  const xpRemaining = Math.max(0, targetXp - totalCurrentXp);
  const span = Math.max(1, targetXp - currentFloor);
  return { totalCurrentXp, targetXp, xpRemaining, levelsRemaining: Math.max(0, targetLevel - currentLevel), percentComplete: Math.min(100, Math.max(0, (totalCurrentXp - currentFloor) / span * 100)) };
}

export function trainerLevelFromXp(totalXp: number) {
  return [...trainerXpByLevel.entries()].sort((a, b) => a[0] - b[0]).reduce((level, [candidate, xp]) => totalXp >= xp ? candidate : level, 1);
}

export function calculateTrade(friendship: FriendshipLevel, pokemonClass: TradePokemonClass, distanceKm: number) {
  const distanceRule = [...pokemonGoTradeRules.candyByDistance].reverse().find((rule) => distanceKm >= rule.minimumKm) ?? pokemonGoTradeRules.candyByDistance[0];
  return {
    stardust: pokemonGoTradeRules.stardust[pokemonClass][friendship],
    candy: distanceRule.candy,
    guaranteedCandyXl: distanceKm >= 100,
    xlNote: distanceRule.xlNote,
    specialTrade: pokemonClass.startsWith('special'),
  };
}

type PvpRankRow = PokemonStatsResult & { ivs: PokemonIvs };
const pvpCache = new Map<string, PvpRankRow[]>();

export function buildPvpRankings(species: PokemonSpecies, cpCap: number, maximumLevel = 50): PvpRankRow[] {
  const key = `${species.id}:${cpCap}:${maximumLevel}`;
  const cached = pvpCache.get(key);
  if (cached) return cached;
  const eligibleLevels = pokemonLevels.filter((level) => level <= maximumLevel).sort((a, b) => b - a);
  const rows: PvpRankRow[] = [];
  for (let attack = 0; attack <= 15; attack += 1) for (let defense = 0; defense <= 15; defense += 1) for (let stamina = 0; stamina <= 15; stamina += 1) {
    const ivs = { attack, defense, stamina };
    const level = cpCap === Infinity ? eligibleLevels[0] : eligibleLevels.find((candidate) => calculatePokemonStats(species, candidate, ivs).cp <= cpCap);
    if (level === undefined) continue;
    rows.push({ ...calculatePokemonStats(species, level, ivs), ivs });
  }
  rows.sort((a, b) => b.statProduct - a.statProduct || b.cp - a.cp || a.ivs.attack - b.ivs.attack || b.ivs.defense - a.ivs.defense || b.ivs.stamina - a.ivs.stamina);
  pvpCache.set(key, rows);
  return rows;
}

export function calculatePvpRank(species: PokemonSpecies, ivs: PokemonIvs, cpCap: number, maximumLevel = 50) {
  const rows = buildPvpRankings(species, cpCap, maximumLevel);
  const index = rows.findIndex((row) => row.ivs.attack === clampIv(ivs.attack) && row.ivs.defense === clampIv(ivs.defense) && row.ivs.stamina === clampIv(ivs.stamina));
  const row = rows[index] ?? rows.at(-1)!;
  const best = rows[0];
  return { ...row, rank: index + 1, rankPercent: best.statProduct ? row.statProduct / best.statProduct * 100 : 0, best };
}

export function calculateEvolutionRange(currentSpecies: PokemonSpecies, targetSpecies: PokemonSpecies, currentCp: number) {
  let minimum = Infinity; let maximum = 0; let matches = 0; let closestGap = Infinity;
  for (const level of pokemonLevels) for (let attack = 0; attack <= 15; attack += 1) for (let defense = 0; defense <= 15; defense += 1) for (let stamina = 0; stamina <= 15; stamina += 1) {
    const ivs = { attack, defense, stamina };
    const sourceCp = calculatePokemonStats(currentSpecies, level, ivs).cp;
    const gap = Math.abs(sourceCp - currentCp);
    if (gap < closestGap) { closestGap = gap; minimum = Infinity; maximum = 0; matches = 0; }
    if (gap === closestGap) {
      const evolvedCp = calculatePokemonStats(targetSpecies, level, ivs).cp;
      minimum = Math.min(minimum, evolvedCp); maximum = Math.max(maximum, evolvedCp); matches += 1;
    }
  }
  return { minimum, maximum, matches, sourceCpTolerance: closestGap };
}

export function calculateMoveDps(fastMove: PokemonMove, chargedMove: PokemonMove, mode: 'pve' | 'pvp', effectiveAttack: number, targetDefense = 150) {
  const fastSeconds = mode === 'pve' ? Math.max(0.1, (fastMove.duration ?? 500) / 1000) : Math.max(0.5, (fastMove.turn_duration ?? 1) * 0.5);
  const chargedSeconds = mode === 'pve' ? Math.max(0.1, (chargedMove.duration ?? 2500) / 1000) : 0.5;
  const fastEnergy = Math.max(1, fastMove.energy_delta);
  const chargedEnergy = Math.max(1, Math.abs(chargedMove.energy_delta));
  const fastCount = Math.ceil(chargedEnergy / fastEnergy);
  const neutralDamage = (power: number) => Math.max(1, Math.floor(0.5 * power * Math.max(1, effectiveAttack) / Math.max(1, targetDefense)) + 1);
  const fastDamage = neutralDamage(fastMove.power);
  const chargedDamage = neutralDamage(chargedMove.power);
  const cycleSeconds = fastCount * fastSeconds + chargedSeconds;
  return {
    fastDps: fastDamage / fastSeconds,
    chargedDps: chargedDamage / chargedSeconds,
    cycleDps: (fastCount * fastDamage + chargedDamage) / cycleSeconds,
    fastEnergy,
    chargedEnergy,
    fastCount,
    cycleSeconds,
    fastDamage,
    chargedDamage,
  };
}
