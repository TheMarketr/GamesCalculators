export function calculateEnchant(targetLevel: number, slot: number) {
  const target = Math.max(1, Math.min(30, Math.round(targetLevel)));
  const selectedSlot = Math.max(1, Math.min(3, Math.round(slot)));
  const bookshelves = target >= 30 ? 15 : Math.max(0, Math.min(15, Math.ceil((target - 8) / 2)));
  return { targetLevel: target, slot: selectedSlot, bookshelves, lapis: selectedSlot, levelsConsumed: selectedSlot, recommendedPlayerLevel: target };
}
