import type { EquipmentItem, Monster, TrainingMethod } from '../../data/osrs/types';
import { levelForXp, xpForLevel } from '../../data/osrs/xp';

export function calculateSkillPlan(input: { currentLevel?: number; currentXp?: number; targetLevel?: number; targetXp?: number; method: TrainingMethod; xpPerActionOverride?: number; actionsPerHour?: number }) {
  const currentXp = Math.max(0, input.currentXp ?? xpForLevel(input.currentLevel ?? 1));
  const targetXp = Math.max(currentXp, input.targetXp ?? xpForLevel(input.targetLevel ?? 99));
  const xpRemaining = targetXp - currentXp;
  const xpPerAction = Math.max(0.0001, input.xpPerActionOverride ?? input.method.xpPerAction);
  const actions = Math.ceil(xpRemaining / xpPerAction);
  const rate = Math.max(0, input.actionsPerHour ?? input.method.actionsPerHour ?? 0);
  return { currentXp, targetXp, xpRemaining, currentLevel: levelForXp(currentXp, 99), targetLevel: levelForXp(targetXp, 99), xpPerAction, actions, hours: rate ? actions / rate : null, percentComplete: targetXp ? Math.min(100, currentXp / targetXp * 100) : 100 };
}

export function calculateXpProgress(currentXp: number, targetLevel: number) {
  const safeXp = Math.max(0, Math.floor(currentXp)); const targetXp = xpForLevel(targetLevel); const level = levelForXp(safeXp, 99); const xpRemaining = Math.max(0, targetXp - safeXp);
  const levelFloor = xpForLevel(level); const nextFloor = xpForLevel(Math.min(99, level + 1));
  return { currentXp: safeXp, currentLevel: level, targetLevel, targetXp, xpRemaining, percentToTarget: targetXp ? Math.min(100, safeXp / targetXp * 100) : 100, currentLevelProgress: nextFloor === levelFloor ? 100 : (safeXp - levelFloor) / (nextFloor - levelFloor) * 100 };
}

export interface CombatLevels { attack: number; strength: number; defence: number; hitpoints: number; ranged: number; magic: number; prayer: number }
export function calculateCombatLevel(levels: CombatLevels) {
  const base = 0.25 * (levels.defence + levels.hitpoints + Math.floor(levels.prayer / 2));
  const melee = 0.325 * (levels.attack + levels.strength);
  const ranged = 0.325 * Math.floor(levels.ranged * 1.5);
  const magic = 0.325 * Math.floor(levels.magic * 1.5);
  const contributions = { Melee: melee, Ranged: ranged, Magic: magic };
  const determiningStyle = (Object.entries(contributions).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Melee') as keyof typeof contributions;
  return { combatLevel: Math.floor(base + contributions[determiningStyle]), base, melee, ranged, magic, determiningStyle };
}

export function nextCombatIncrease(levels: CombatLevels) {
  const current = calculateCombatLevel(levels).combatLevel;
  const keys = Object.keys(levels) as (keyof CombatLevels)[];
  const candidates = keys.map((key) => {
    for (let amount = 1; levels[key] + amount <= 99; amount += 1) if (calculateCombatLevel({ ...levels, [key]: levels[key] + amount }).combatLevel > current) return { stat: key, levels: amount, resultingLevel: current + 1 };
    return null;
  }).filter((value): value is { stat: keyof CombatLevels; levels: number; resultingLevel: number } => Boolean(value));
  return candidates.sort((a, b) => a.levels - b.levels || a.stat.localeCompare(b.stat))[0] ?? null;
}

export function parseDropRate(value: string | number) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  const trimmed = value.trim(); const fraction = trimmed.match(/^\s*([\d.]+)\s*\/\s*([\d.]+)\s*$/);
  if (fraction) {
    const denominator = Number(fraction[2]); const parsed = denominator > 0 ? Number(fraction[1]) / denominator : 0;
    return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
  }
  const numberValue = Number(trimmed.replace('%', ''));
  const parsed = trimmed.includes('%') ? numberValue / 100 : numberValue <= 1 ? numberValue : 1 / numberValue;
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
}

export function calculateDropProbability(rate: string | number, kills: number) {
  const p = parseDropRate(rate); const n = Math.max(0, Math.floor(kills)); const zeroChance = (1 - p) ** n;
  const killsForChance = (target: number) => p <= 0 ? Infinity : p >= 1 ? 1 : Math.ceil(Math.log(1 - target) / Math.log(1 - p));
  return { probability: p, atLeastOne: 1 - zeroChance, zeroChance, expectedDrops: n * p, expectedKills: p ? 1 / p : Infinity, milestones: [0.5, 0.75, 0.9, 0.95, 0.99].map((target) => ({ target, kills: killsForChance(target) })) };
}

export type CombatStyle = 'melee' | 'ranged' | 'magic';
export function calculateMaxHit(input: { style: CombatStyle; level: number; boost: number; prayerMultiplier: number; styleBonus: number; strengthBonus: number; magicBaseDamage?: number; damageMultiplier?: number }) {
  const boosted = Math.max(1, input.level + input.boost);
  if (input.style === 'magic') {
    const base = Math.max(0, input.magicBaseDamage ?? 0); const finalMaxHit = Math.floor(base * (1 + Math.max(-100, input.strengthBonus) / 100) * (input.damageMultiplier ?? 1));
    return { effectiveLevel: boosted, baseMaxHit: base, finalMaxHit, strengthBonus: input.strengthBonus, appliedMultiplier: input.damageMultiplier ?? 1 };
  }
  const effectiveLevel = Math.floor(boosted * input.prayerMultiplier) + input.styleBonus + 8;
  const baseMaxHit = Math.floor(0.5 + effectiveLevel * (input.strengthBonus + 64) / 640);
  return { effectiveLevel, baseMaxHit, finalMaxHit: Math.floor(baseMaxHit * (input.damageMultiplier ?? 1)), strengthBonus: input.strengthBonus, appliedMultiplier: input.damageMultiplier ?? 1 };
}

export function hitChance(attackRoll: number, defenceRoll: number) {
  if (attackRoll > defenceRoll) return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  return attackRoll / (2 * (defenceRoll + 1));
}

export function calculateDps(input: { style: CombatStyle; level: number; boost: number; attackPrayer: number; strengthPrayer: number; attackStyleBonus: number; strengthStyleBonus: number; attackBonus: number; strengthBonus: number; attackSpeed: number; monster: Monster; monsterDefenceBonus: number; damageMultiplier?: number; magicBaseDamage?: number }) {
  const boosted = Math.max(1, input.level + input.boost);
  const effectiveAttack = Math.floor(boosted * input.attackPrayer) + input.attackStyleBonus + 8;
  const attackRoll = effectiveAttack * (input.attackBonus + 64);
  const defenceRoll = (input.monster.defenceLevel + 9) * (input.monsterDefenceBonus + 64);
  const accuracy = hitChance(attackRoll, defenceRoll);
  const max = calculateMaxHit({ style: input.style, level: input.level, boost: input.boost, prayerMultiplier: input.strengthPrayer, styleBonus: input.strengthStyleBonus, strengthBonus: input.strengthBonus, damageMultiplier: input.damageMultiplier, magicBaseDamage: input.magicBaseDamage });
  const expectedDamage = accuracy * max.finalMaxHit / 2; const attackSeconds = Math.max(1, input.attackSpeed) * 0.6; const dps = expectedDamage / attackSeconds;
  return { effectiveAttack, attackRoll, defenceRoll, accuracy, maxHit: max.finalMaxHit, expectedDamage, attackSeconds, dps, timeToKill: dps ? input.monster.hitpoints / dps : Infinity };
}

export function totalEquipment(items: EquipmentItem[]) {
  const keys = ['attackStab', 'attackSlash', 'attackCrush', 'attackMagic', 'attackRanged', 'defenceStab', 'defenceSlash', 'defenceCrush', 'defenceMagic', 'defenceRanged', 'meleeStrength', 'rangedStrength', 'magicDamage', 'prayer'] as const;
  return Object.fromEntries(keys.map((key) => [key, items.reduce((sum, item) => sum + item[key], 0)])) as Record<typeof keys[number], number>;
}

export function calculateAlch(item: { highAlch: number; highPrice: number | null }, natureRuneCost: number, quantity: number) {
  const count = Math.max(0, Math.floor(quantity)); const buyPrice = Math.max(0, item.highPrice ?? 0); const grossPerItem = item.highAlch - buyPrice; const netPerItem = item.highAlch - buyPrice - Math.max(0, natureRuneCost);
  return { geBuyPrice: buyPrice, highAlch: item.highAlch, grossPerItem, netPerItem, totalProfit: netPerItem * count, profitPer100: netPerItem * 100, profitPer1000: netPerItem * 1000, quantity: count };
}

export function calculateToaUniqueChance(raidLevel: number, rewardPoints: number) {
  const level = Math.max(0, raidLevel); const scaledRaidLevel = level <= 310 ? level : level <= 430 ? 310 + (level - 310) / 3 : 350 + (level - 430) / 6;
  const pointsPerPercent = 10_500 - 20 * scaledRaidLevel; const chancePercent = Math.min(55, Math.max(0, rewardPoints) / pointsPerPercent);
  return { scaledRaidLevel, pointsPerPercent, chancePercent, capped: chancePercent >= 55 };
}
