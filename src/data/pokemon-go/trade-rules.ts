export type FriendshipLevel = 'good' | 'great' | 'ultra' | 'best';
export type TradePokemonClass = 'standard-registered' | 'special-registered' | 'standard-unregistered' | 'special-unregistered';

export const pokemonGoTradeRules = {
  reviewed: '2026-09-05',
  source: 'Pokémon GO Help Center — Trading Pokémon',
  sourceUrl: 'https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/96-trading-pokemon/',
  sourceType: 'Official support rules with documented friendship discounts',
  unit: 'Stardust and Candy',
  stardust: {
    'standard-registered': { good: 100, great: 100, ultra: 100, best: 100 },
    'special-registered': { good: 20_000, great: 16_000, ultra: 1_600, best: 800 },
    'standard-unregistered': { good: 20_000, great: 16_000, ultra: 1_600, best: 800 },
    'special-unregistered': { good: 1_000_000, great: 800_000, ultra: 80_000, best: 40_000 },
  } satisfies Record<TradePokemonClass, Record<FriendshipLevel, number>>,
  candyByDistance: [
    { minimumKm: 0, maximumKm: 9.999, candy: 1, xlNote: 'No guaranteed Candy XL from distance alone.' },
    { minimumKm: 10, maximumKm: 99.999, candy: 2, xlNote: 'Candy XL remains eligibility-based; distance does not guarantee it.' },
    { minimumKm: 100, maximumKm: Infinity, candy: 3, xlNote: 'A 100 km or longer trade meets the distance condition for a guaranteed Candy XL under the reviewed rule set.' },
  ],
  notes: 'Special trades, daily limits, age, location, Mythical restrictions and temporary events can change whether a trade is allowed or discounted.',
} as const;
