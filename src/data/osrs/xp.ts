export const osrsXpMeta = { source: 'OSRS Wiki — Experience', sourceUrl: 'https://oldschool.runescape.wiki/w/Experience', sourceType: 'Community wiki', reviewed: '2026-09-05', unit: 'experience points', notes: 'The local table is generated from the exact integer formula through level 126 for virtual-level calculations.' } as const;

export function xpForLevel(level: number) {
  const target = Math.max(1, Math.min(126, Math.floor(level)));
  let points = 0;
  for (let current = 1; current < target; current += 1) points += Math.floor(current + 300 * 2 ** (current / 7));
  return Math.floor(points / 4);
}

export const osrsXpTable = Array.from({ length: 126 }, (_, index) => ({ level: index + 1, xp: xpForLevel(index + 1) }));
export const levelForXp = (xp: number, cap = 126) => osrsXpTable.filter((row) => row.level <= cap && row.xp <= Math.max(0, xp)).at(-1)?.level ?? 1;
