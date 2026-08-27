export interface FortniteXpInput { currentLevel: number; targetLevel: number; currentLevelXp: number; xpPerLevel: number; xpPerMatch: number }
export function calculateFortniteXp(input: FortniteXpInput) {
  const current = Math.max(1, Math.floor(input.currentLevel));
  const target = Math.max(current, Math.floor(input.targetLevel));
  const perLevel = Math.max(1, Math.floor(input.xpPerLevel));
  const progress = Math.max(0, Math.min(perLevel, input.currentLevelXp));
  const xpNeeded = Math.max(0, (target - current) * perLevel - progress);
  return { current, target, levelsRemaining: target - current, xpNeeded, matches: Math.ceil(xpNeeded / Math.max(1, input.xpPerMatch)), progressPercent: progress / perLevel * 100 };
}
