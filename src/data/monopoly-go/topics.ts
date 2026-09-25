export const monopolySources = {
  trading: {
    label: "MONOPOLY GO — Benefits of Trading",
    url: "https://www.monopolygo.com/news/104/tycoon-bootcamp-benefits-of-trading",
  },
  club: {
    label: "MONOPOLY GO — Tycoon Club access",
    url: "https://www.monopolygo.com/news/tycoon-club-not-every-tycoon-knows-this-shortcut",
  },
  partners: {
    label: "MONOPOLY GO — Partners Events",
    url: "https://www.monopolygo.com/news/125/tycoon-bootcamp-partners-events",
  },
  help: {
    label: "MONOPOLY GO Help Center",
    url: "https://support.monopolygo.com/",
  },
};
export const monopolyTopics = [
  {
    name: "Dice rolls",
    detail:
      "Rolls move your token around the board. A multiplier spends more rolls on a turn; it does not guarantee a particular landing.",
    href: "/monopoly-go/tycoon-club/",
  },
  {
    name: "Golden Blitz",
    detail:
      "A limited trading window for the Gold Stickers selected for that event. Other Gold Stickers remain unavailable for ordinary trades.",
    href: "/monopoly-go/golden-blitz/",
  },
  {
    name: "Safe exchanges",
    detail:
      "Use Make an Exchange when sending a duplicate and expecting a sticker in return. Review the proposed return before approving it.",
    href: "/monopoly-go/golden-blitz/",
  },
  {
    name: "Sticker stars",
    detail:
      "Duplicate stickers contribute to the star balance shown by your album. Enter that displayed balance when planning a safe.",
    href: "/monopoly-go/sticker-safe-calculator/",
  },
  {
    name: "Tycoon Club",
    detail:
      "The official website offers the Daily Wheel and a shop gift. This site provides a personal checklist; collection happens on the publisher website.",
    href: "/monopoly-go/tycoon-club/",
  },
  {
    name: "Partners",
    detail:
      "Partner currency is spent on event wheel spins that award attraction points. Points and currency are different quantities.",
    href: "/monopoly-go/partner-event/",
  },
  {
    name: "Quick Wins",
    detail:
      "Claim rewards after finishing the objectives shown in the game. During relevant events those rewards can include Partner Currency.",
    href: "/monopoly-go/partner-event/",
  },
  {
    name: "Tournament milestones",
    detail:
      "Shutdowns and Bank Heists contribute to tournament progress. Read the current milestone list because reward tiers change between events.",
    href: "/monopoly-go/events/",
  },
  {
    name: "Event schedules",
    detail:
      "Stored UTC timestamps identify an exact instant. The schedule converts that instant to your device timezone and keeps ended events in history.",
    href: "/monopoly-go/events/",
  },
  {
    name: "Shop gift",
    detail:
      "The in-game shop gift and Tycoon Club gift have separate locations and availability. Check the relevant timer before returning.",
    href: "/monopoly-go/tycoon-club/",
  },
].map((topic) => ({
  ...topic,
  source: "MONOPOLY GO official help and Tycoon Bootcamp",
  sourceUrl: ["Golden Blitz", "Safe exchanges"].includes(topic.name)
    ? monopolySources.trading.url
    : ["Tycoon Club", "Shop gift"].includes(topic.name)
      ? monopolySources.club.url
      : ["Partners", "Quick Wins"].includes(topic.name)
        ? monopolySources.partners.url
        : monopolySources.help.url,
  reviewedAt: "2026-09-25",
  unit: "reference",
}));
