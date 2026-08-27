export function totalXpAtLevel(level: number): number {
  const value = Math.max(0, Math.floor(level));
  if (value <= 16) return value * value + 6 * value;
  if (value <= 31) return Math.floor(2.5 * value * value - 40.5 * value + 360);
  return Math.floor(4.5 * value * value - 162.5 * value + 2220);
}
export function calculateXp(currentLevel: number, targetLevel: number) {
  const current = Math.max(0, Math.floor(currentLevel));
  const target = Math.max(current, Math.floor(targetLevel));
  const xp = totalXpAtLevel(target) - totalXpAtLevel(current);
  return { current, target, xp, bottles: Math.ceil(xp / 7), quartzOre: Math.ceil(xp / 3.5), mobKills: Math.ceil(xp / 5) };
}
