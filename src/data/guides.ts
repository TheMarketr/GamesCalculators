export interface GuideConfig {
  slug: string;
  gameSlug: string;
  game: string;
  title: string;
  description: string;
  category: string;
  readingTime: string;
  updated: string;
  keywords: string[];
}

export const guides: GuideConfig[] = [
  { slug: 'grow-a-garden/value-planning-guide', gameSlug: 'grow-a-garden', game: 'Grow a Garden', title: 'Grow a Garden Value Planning Guide', description: 'Learn how weight, growth variants and mutations combine before comparing crops or trades.', category: 'Values', readingTime: '4 min read', updated: '2026-08-27', keywords: ['crop values', 'mutations', 'trade planning'] },
  { slug: 'blox-fruits/trading-guide', gameSlug: 'blox-fruits', game: 'Blox Fruits', title: 'Blox Fruits Trading Guide', description: 'Use value and demand together to build clearer, more balanced fruit offers.', category: 'Trading', readingTime: '4 min read', updated: '2026-08-26', keywords: ['fruit trading', 'trade values', 'demand'] },
  { slug: 'steal-a-brainrot/collection-planning-guide', gameSlug: 'steal-a-brainrot', game: 'Steal a Brainrot', title: 'Steal a Brainrot Collection Planning Guide', description: 'Compare collection value and income without letting one large number hide the items doing the work.', category: 'Collections', readingTime: '4 min read', updated: '2026-08-27', keywords: ['collection value', 'income', 'mutations'] },
  { slug: '99-nights/run-planning-guide', gameSlug: '99-nights', game: '99 Nights in the Forest', title: '99 Nights in the Forest Run Planning Guide', description: 'Turn your target night into a practical checklist for players, food, fuel and crafting supplies.', category: 'Survival', readingTime: '5 min read', updated: '2026-08-27', keywords: ['99 nights guide', 'run planner', 'food and fuel'] },
  { slug: 'adopt-me/fair-trading-guide', gameSlug: 'adopt-me', game: 'Adopt Me', title: 'Adopt Me Fair Trading Guide', description: 'Compare pet variants, demand and offer totals before deciding whether a trade is a win, fair or lose.', category: 'Trading', readingTime: '5 min read', updated: '2026-08-27', keywords: ['pet trading', 'wfl', 'pet values'] },
  { slug: 'mm2/value-list-guide', gameSlug: 'mm2', game: 'Murder Mystery 2', title: 'How to Read an MM2 Value List', description: 'Use rarity, category, demand and update dates to compare MM2 items more carefully.', category: 'Values', readingTime: '4 min read', updated: '2026-08-27', keywords: ['mm2 values', 'knife values', 'trading values'] },
  { slug: 'pet-simulator-99/pet-value-guide', gameSlug: 'pet-simulator-99', game: 'Pet Simulator 99', title: 'Pet Simulator 99 Pet Value Guide', description: 'Separate power, rarity and trading value when comparing pets or estimating an inventory.', category: 'Values', readingTime: '4 min read', updated: '2026-08-27', keywords: ['pet values', 'pet comparison', 'inventory value'] },
  { slug: 'minecraft/anvil-too-expensive', gameSlug: 'minecraft', game: 'Minecraft', title: 'Minecraft Anvil “Too Expensive” Explained', description: 'Understand the 40-level survival limit, prior-work penalties and practical ways to combine enchantments.', category: 'Enchanting', readingTime: '4 min read', updated: '2026-08-26', keywords: ['anvil cost', 'prior work penalty'] },
  { slug: 'fortnite/xp-planning-guide', gameSlug: 'fortnite', game: 'Fortnite', title: 'Fortnite XP Planning Guide', description: 'Set a realistic level target, estimate the remaining XP and turn it into a flexible match plan.', category: 'Progress', readingTime: '4 min read', updated: '2026-08-27', keywords: ['fortnite xp', 'battle pass levels', 'level planning'] },
  { slug: 'gta-6/release-planning-guide', gameSlug: 'gta-6', game: 'GTA VI', title: 'GTA VI Release Planning Guide', description: 'Check the countdown, announced platforms and download-time scenarios from one practical checklist.', category: 'Release', readingTime: '4 min read', updated: '2026-08-27', keywords: ['gta 6 release date', 'platforms', 'download planning'] },
];
