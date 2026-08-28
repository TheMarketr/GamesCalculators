export const fortniteXpReview = {
  reviewed: '2026-08-28',
  xpPerLevel: 80_000,
  sourceLabel: 'Fortnite.GG XP table',
  sourceUrl: 'https://fortnite.gg/xp-table',
  note: 'The current table uses 80,000 XP for each standard level. Epic can change progression rules between seasons.',
};

export const fortniteXpMilestones = [1, 5, 10, 25, 50, 75, 100, 150, 200].map((levels) => ({
  levels,
  xp: levels * fortniteXpReview.xpPerLevel,
}));
