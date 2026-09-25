// Constants verified against the public Aimlabs converter implementation on the review date.
// This is a specialist reference, not a claim that each game publisher documents the formula.
const metadata = {
  source: "Aimlabs public sensitivity converter implementation",
  sourceUrl: "https://aimlabs.com/mouse-sensitivity-converter",
  reviewedAt: "2026-09-25",
  unit: "degrees per mouse count at sensitivity 1",
  sourceType: "community-derived" as const,
};
export const sensitivityGames = [
  {
    id: "valorant",
    game: "VALORANT",
    yaw: 0.07,
    note: "PC hipfire sensitivity.",
    ...metadata,
  },
  {
    id: "cs2",
    game: "Counter-Strike 2 / CS:GO",
    yaw: 0.022,
    note: "Default m_yaw only.",
    ...metadata,
  },
  {
    id: "apex",
    game: "Apex Legends",
    yaw: 0.022,
    note: "PC hipfire, no ADS multiplier.",
    ...metadata,
  },
  {
    id: "fortnite",
    game: "Fortnite",
    yaw: 0.005555,
    note: "Enter the displayed percentage: 5 means 5%, not 0.05.",
    ...metadata,
  },
  {
    id: "overwatch",
    game: "Overwatch 2",
    yaw: 0.0066,
    note: "PC base sensitivity.",
    ...metadata,
  },
  {
    id: "aimlab",
    game: "Aimlabs (native profile)",
    yaw: 0.05,
    note: "Native Aimlabs profile only. Its VALORANT game profile uses VALORANT values directly.",
    ...metadata,
  },
];
