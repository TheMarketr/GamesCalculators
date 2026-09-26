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
  { name: 'Free Dice Links', detail: 'Source-tracked mply.io links may grant dice once per eligible account. Check discovery time and the game response; a reachable URL is not a guaranteed reward.', href: '/monopoly-go/free-dice-links/' },
  { name: 'Roll multiplier', detail: 'A higher multiplier consumes more dice in one roll and scales eligible landing rewards. It does not choose the next tile for you.', href: '/monopoly-go/wiki/' },
  { name: 'Shields', detail: 'Shields protect landmarks from Shutdown attempts when available. Check your current shield capacity on the board rather than treating collected shields as an unlimited reserve.', href: '/monopoly-go/wiki/' },
  { name: 'Sticker album', detail: 'Albums organize seasonal sticker sets. A complete set and a completed album are different goals; current set requirements belong to the live game screen.', href: '/monopoly-go/sticker-safe-calculator/' },
  { name: 'Sticker duplicates', detail: 'An extra sticker can be traded when its current rules allow it or contribute stars toward a safe. A Gold duplicate still needs an eligible Golden Blitz window for trading.', href: '/monopoly-go/golden-blitz/' },
  { name: 'Bank Heist', detail: 'A Railroad landing can initiate a Bank Heist. Its outcome affects the event points shown for the active tournament, so use current event rules rather than a fixed point table.', href: '/monopoly-go/events/' },
  { name: 'Shutdown', detail: 'Shutdown is a Railroad mini-game targeting another board. Available shields can stop building damage; event scoring depends on the active tournament.', href: '/monopoly-go/events/' },
  { name: 'Boards', detail: 'Boards contain landmarks that you build and upgrade. Prices vary with progress, so this wiki does not publish an unsupported universal board-cost table.', href: '/monopoly-go/wiki/' },
  { name: 'Net Worth', detail: 'Net Worth tracks long-term account progression as landmarks and boards advance. It is not an exchange rate for dice or sticker stars.', href: '/monopoly-go/wiki/' },
  { name: 'Milestones', detail: 'Timed events and tournaments have separate point milestones. Inspect the active reward ladder before spending rolls to chase a specific tier.', href: '/monopoly-go/events/' },
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
