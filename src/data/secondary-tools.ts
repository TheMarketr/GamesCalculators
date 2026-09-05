type ToolType = 'calculator' | 'generator' | 'reference' | 'tracker' | 'map';

const reviewDateFor = (slug: string, category: string) => {
  if (category === 'Reference') return '2026-08-24';
  if (category === 'Tracker') return '2026-08-21';
  if (category === 'Comparison') return '2026-08-23';
  if (category === 'Trading' || category === 'Values') return '2026-08-25';
  return slug.length % 2 === 0 ? '2026-08-20' : '2026-08-22';
};

const toolTypeFor = (slug: string, name: string, category: string): ToolType => {
  if (['edition-content', 'launch-facts', 'gameplay-systems', 'characters', 'map-locations'].includes(slug)) return 'reference';
  if (category === 'Reference') return 'reference';
  if (category === 'Tracker') return 'tracker';
  if (name.includes('Generator')) return 'generator';
  if (category === 'Map' || name.includes('Map')) return 'map';
  return 'calculator';
};

const tool = (
  slug: string,
  name: string,
  description: string,
  category: string,
  keywords: string[] = [],
  featured = false,
  lastReviewedOverride?: string,
) => {
  const lastReviewed = lastReviewedOverride ?? reviewDateFor(slug, category);
  return { slug, name, shortName: name, description, kind: 'secondary' as const, category, keywords, featured, updated: lastReviewed, lastReviewed, toolType: toolTypeFor(slug, name, category) };
};

export const secondaryTools = {
  'grow-a-garden': [
    tool('mutation-calculator', 'Grow a Garden Mutation Calculator', 'Stack growth and mutation multipliers to estimate a crop value range.', 'Values', ['mutation multiplier'], true),
    tool('profit-calculator', 'Grow a Garden Profit Calculator', 'Calculate profit, margin, payback harvests and return on seed cost.', 'Planning', ['crop profit', 'roi'], true),
    tool('crop-comparison', 'Grow a Garden Crop Comparison', 'Compare two reviewed crops by base Sheckle value and base-weight context.', 'Comparison'),
    tool('prices', 'Grow a Garden Prices', 'Search 54 crops by base Sheckle value and source-reviewed base weight.', 'Reference'),
    tool('items', 'Grow a Garden Items', 'Explore a combined local catalog of crops and garden pets with source-specific units and notes.', 'Reference'),
    tool('pets', 'Grow a Garden Pet Comparison', 'Compare garden pet planning profiles and utility ratings.', 'Comparison'),
    tool('best-crops', 'Best Grow a Garden Crops', 'Rank reviewed crops by documented base Sheckle value.', 'Reference'),
  ],
  'blox-fruits': [
    tool('damage-calculator', 'Blox Fruits Damage Calculator', 'Estimate combo damage after stats, mastery, bonuses and target defense.', 'Combat', ['damage'], true),
    tool('stat-calculator', 'Blox Fruits Stat Calculator', 'Allocate a stat budget and check points remaining before committing a build.', 'Builds'),
    tool('build-calculator', 'Blox Fruits Build Calculator', 'Score a fruit, melee, sword and defense allocation for your preferred playstyle.', 'Builds'),
    tool('mastery-calculator', 'Blox Fruits Mastery Calculator', 'Estimate mastery progress and actions needed for a target level.', 'Progress'),
    tool('fruit-values', 'Blox Fruits Fruit Values', 'Search all 41 fruits by Dealer Beli price, type, rarity and permanent Robux price.', 'Reference', [], false, '2026-09-04'),
    tool('fruit-comparison', 'Blox Fruits Fruit Comparison', 'Compare two fruits by documented Dealer price without inventing demand.', 'Comparison', [], false, '2026-09-04'),
    tool('best-fruits', 'Best Blox Fruits', 'Rank all 41 fruits by documented Dealer Beli price.', 'Reference', [], false, '2026-09-04'),
  ],
  'steal-a-brainrot': [
    tool('trade-calculator', 'Steal a Brainrot Trade Calculator', 'Compare two bundles by documented acquisition cost while keeping income separate.', 'Trading', ['trade values'], true),
    tool('income-calculator', 'Steal a Brainrot Income Calculator', 'Project income per second, minute, hour and a custom play session.', 'Income', ['income per second'], true),
    tool('mutation-calculator', 'Steal a Brainrot Mutation Calculator', 'Estimate value and income after mutation and event multipliers.', 'Values'),
    tool('rebirth-calculator', 'Steal a Brainrot Rebirth Calculator', 'Estimate rebirth time from current cash, target cost and income rate.', 'Progress'),
    tool('values', 'Steal a Brainrot Values', 'Search 45 Brainrots by acquisition cost, base income and rarity.', 'Reference'),
    tool('collection-tracker', 'Steal a Brainrot Collection Tracker', 'Track collected Brainrots locally on this device with completion progress.', 'Tracker'),
    tool('income-comparison', 'Steal a Brainrot Income Comparison', 'Compare two Brainrots by income, value and payback efficiency.', 'Comparison'),
  ],
  '99-nights': [
    tool('characters', '99 Nights Characters', 'Search 28 classes by diamond or event cost, star count and editorial tier.', 'Reference', ['99 nights characters'], true),
    tool('class-comparison', '99 Nights Class Comparison', 'Compare two named classes by cost, stars and source-labeled tier.', 'Comparison'),
    tool('crafting-calculator', '99 Nights Crafting Calculator', 'Calculate complete crafts, consumed resources and leftovers.', 'Crafting', [], true),
    tool('fuel-calculator', '99 Nights Fuel Calculator', 'Estimate fuel needed for the remaining nights with a safety reserve.', 'Survival'),
    tool('food-calculator', '99 Nights Food Calculator', 'Plan meals for the party and estimate the recommended reserve.', 'Survival'),
    tool('progress-calculator', '99 Nights Progress Calculator', 'Measure run completion and nights remaining to your target.', 'Progress', [], true),
    tool('run-planner', '99 Nights Run Planner', 'Combine party size, nights, food, fuel and crafting reserves in one plan.', 'Planning'),
    tool('codes', '99 Nights Codes Tracker', 'Save codes you want to try and mark redeemed codes locally.', 'Tracker', ['99 nights codes']),
    tool('items', '99 Nights Items', 'Search a sourced food table with hunger, healing and timed-effect notes.', 'Reference'),
    tool('crafting', '99 Nights Crafting Reference', 'Filter 10 sourced recipes by bench level and material requirements.', 'Reference'),
  ],
  'adopt-me': [
    tool('trade-calculator', 'Adopt Me Trade Calculator', 'Compare both sides of a pet trade with values, demand and a fair range.', 'Trading', ['adopt me trade calculator'], true),
    tool('pet-value-calculator', 'Adopt Me Pet Value Calculator', 'Build a pet list and calculate regular, neon and mega value totals.', 'Values'),
    tool('neon-calculator', 'Adopt Me Neon Calculator', 'Calculate pets and aging work remaining for a neon pet.', 'Pets'),
    tool('mega-neon-calculator', 'Adopt Me Mega Neon Calculator', 'Plan the pets, neons and aging work needed for a mega neon.', 'Pets'),
    tool('age-calculator', 'Adopt Me Age Calculator', 'Estimate tasks and play time remaining to fully age pets.', 'Progress'),
    tool('egg-odds-calculator', 'Adopt Me Egg Odds Calculator', 'Estimate the chance and expected eggs needed for a target rarity.', 'Odds'),
    tool('pet-values', 'Adopt Me Pet Values', 'Search 25 higher-value pets from a dated AdoptMe.rocks community index.', 'Reference'),
    tool('inventory-calculator', 'Adopt Me Inventory Calculator', 'Select pets, quantities and variants to total an inventory locally.', 'Inventory'),
  ],
  mm2: [
    tool('value-calculator', 'MM2 Value Calculator', 'Select weapons and quantities to calculate a collection value total.', 'Values', ['mm2 value'], true, '2026-09-03'),
    tool('value-list', 'MM2 Value List', 'Search and sort a 300-item, source-dated Supreme Values community snapshot.', 'Reference', ['mm2 value list'], true, '2026-09-03'),
    tool('trade-calculator', 'MM2 Trade Calculator', 'Compare two multi-item MM2 offers and calculate the value gap.', 'Trading', ['mm2 trade values'], true, '2026-09-03'),
    tool('trading-values', 'MM2 Trading Values', 'Browse demand-rated, tradeable MM2 items with value and category filters.', 'Reference', [], false, '2026-09-03'),
    tool('knife-values', 'MM2 Knife Values', 'Search only knife records and rank them by current community value.', 'Reference', [], false, '2026-09-03'),
    tool('inventory-calculator', 'MM2 Inventory Calculator', 'Select weapons and quantities to total your saved inventory.', 'Inventory', [], false, '2026-09-03'),
    tool('weapon-comparison', 'MM2 Weapon Comparison', 'Compare two weapons by value, demand and category.', 'Comparison', [], false, '2026-09-03'),
    tool('crate-odds-calculator', 'MM2 Crate Odds Calculator', 'Estimate the chance of at least one target pull across multiple crates.', 'Odds'),
    tool('godly-values', 'MM2 Godly Values', 'Search only Godly-tier items with per-record source dates and demand context.', 'Reference', [], false, '2026-09-03'),
    tool('collection-tracker', 'MM2 Collection Tracker', 'Track collected weapons locally and view completion progress.', 'Tracker', [], false, '2026-09-03'),
  ],
  'pet-simulator-99': [
    tool('value-calculator', 'Pet Simulator 99 Value Calculator', 'Total selected pets from a 50-row BIG Games API RAP snapshot.', 'Values', ['ps99 value'], true),
    tool('trade-calculator', 'Pet Simulator 99 Trade Calculator', 'Compare pet offers by dated Recent Auction Price without inventing demand.', 'Trading', [], true),
    tool('pet-values', 'Pet Simulator 99 Pet Values', 'Search and sort 50 high-RAP pet records synced from the BIG Games API.', 'Reference'),
    tool('hatch-odds-calculator', 'Pet Simulator 99 Hatch Odds Calculator', 'Estimate hatch probability across eggs, boosts and luck multipliers.', 'Odds', [], true),
    tool('power-calculator', 'Pet Simulator 99 Power Calculator', 'Estimate team power from pet strength, quantity and boosts.', 'Power'),
    tool('pet-comparison', 'Pet Simulator 99 Pet Comparison', 'Compare two pets by value, demand and power index.', 'Comparison'),
    tool('enchant-calculator', 'Pet Simulator 99 Enchant Calculator', 'Estimate stacked enchant effects with diminishing returns.', 'Builds'),
    tool('diamond-calculator', 'Pet Simulator 99 Diamond Calculator', 'Project diamonds earned over a custom farming session.', 'Income'),
    tool('inventory-calculator', 'Pet Simulator 99 Inventory Calculator', 'Select pets and quantities to total your inventory value.', 'Inventory'),
    tool('pets', 'Pet Simulator 99 Pets', 'Search and filter a practical local pet reference.', 'Reference'),
  ],
  minecraft: [
    tool('nether-coordinates-calculator', 'Minecraft Nether Coordinates Calculator', 'Convert coordinates between the Overworld and Nether with safe rounding.', 'Coordinates', [], true),
    tool('coordinates-calculator', 'Minecraft Coordinates Calculator', 'Calculate coordinate offsets, direction and straight-line travel distance.', 'Coordinates'),
    tool('anvil-calculator', 'Minecraft Anvil Calculator', 'Estimate prior-work penalties, total level cost and the too-expensive threshold.', 'Enchanting', [], true),
    tool('dome-calculator', 'Minecraft Dome Calculator', 'Estimate dome layers, footprint and block count from a diameter.', 'Building'),
    tool('sphere-calculator', 'Minecraft Sphere Calculator', 'Estimate sphere dimensions and block count for filled or hollow builds.', 'Building'),
    tool('distance-calculator', 'Minecraft Distance Calculator', 'Calculate 2D and 3D distance plus Nether-equivalent travel.', 'Coordinates'),
    tool('damage-calculator', 'Minecraft Damage Calculator', 'Estimate post-armor damage using armor, toughness and protection.', 'Combat'),
    tool('spiral-staircase-calculator', 'Minecraft Spiral Staircase Calculator', 'Plan turns, steps, rise and materials for a spiral staircase.', 'Building'),
    tool('stack-calculator', 'Minecraft Stack Calculator', 'Convert item counts into stacks, leftovers and shulker boxes.', 'Inventory'),
    tool('oval-generator', 'Minecraft Oval Generator', 'Estimate pixel-oval dimensions, rows and block count.', 'Building'),
  ],
  fortnite: [
    tool('account-value-calculator', 'Fortnite Account Value Calculator', 'Create a private collection estimate from cosmetic counts and user-set values.', 'Collection'),
    tool('edpi-calculator', 'Fortnite eDPI Calculator', 'Calculate mouse eDPI with low, medium or high sensitivity guidance.', 'Settings', ['fortnite edpi'], true),
    tool('sensitivity-calculator', 'Fortnite Sensitivity Calculator', 'Convert sensitivity between DPI settings while preserving eDPI.', 'Settings'),
    tool('level-calculator', 'Fortnite Level Calculator', 'Estimate XP and matches needed to reach a target level.', 'Progress'),
    tool('battle-pass-calculator', 'Fortnite Battle Pass Calculator', 'Plan daily XP and matches required before a season deadline.', 'Progress'),
    tool('ttk-calculator', 'Fortnite TTK Calculator', 'Estimate shots and time to eliminate for damage, fire rate and health.', 'Combat'),
    tool('weapon-comparison', 'Fortnite Weapon Comparison', 'Compare 44 rifle, shotgun and SMG rows by DPS, damage, fire rate, magazine and reload.', 'Comparison'),
    tool('xp-per-level', 'Fortnite XP Per Level', 'Use the reviewed 80,000-XP standard-level table or calculate a custom range.', 'Reference'),
  ],
  'gta-6': [
    tool('cost', 'GTA VI Cost Planner', 'Model game price, tax, add-ons and savings without presenting unconfirmed pricing as fact.', 'Planning', ['gta 6 cost'], true),
    tool('map-size', 'GTA VI Map Size Estimator', 'Compare map-area scenarios and estimate travel time at different speeds.', 'Map'),
    tool('map-locations', 'GTA VI Map Locations', 'Search 9 sourced Leonida regions and districts without invented coordinates.', 'Map'),
    tool('characters', 'GTA VI Characters', 'Browse 10 named GTA VI character profiles sourced from Rockstar.', 'Reference'),
    tool('gameplay-systems', 'GTA VI Gameplay Systems', 'Search 24 sourced mechanics and activities, with each item labeled as interview-confirmed or observed in official footage.', 'Reference', ['gta 6 gameplay features', 'gta vi activities']),
    tool('edition-content', 'GTA VI Edition Content', 'Search 22 official Standard, Ultimate and preorder inclusions without guessing their cash value.', 'Editions', ['gta 6 ultimate edition', 'gta vi preorder bonus']),
    tool('launch-facts', 'GTA VI Launch Facts', 'Check 12 sourced launch facts and clearly marked unknowns covering platforms, preload, physical copies and PC status.', 'Release', ['gta 6 release date', 'gta vi preload']),
    tool('edition-comparison', 'GTA VI Edition Comparison', 'Compare the announced Standard and Ultimate editions using regional prices and the value you assign to included extras.', 'Planning'),
    tool('mission-earnings-calculator', 'GTA VI Mission Earnings Calculator', 'Estimate net payout, profit per hour and runs needed using the mission values you observe after launch.', 'Money', ['gta 6 mission payout', 'gta vi money per hour'], true),
    tool('payout-split-calculator', 'GTA VI Payout Split Calculator', 'Split a user-entered take after setup costs and compare leader and crew shares.', 'Money', ['gta 6 payout split', 'heist split calculator']),
    tool('wanted-escape-planner', 'GTA VI Wanted Escape Planner', 'Score visible escape risks from witnesses, vehicle, outfit and search pressure without claiming an official police formula.', 'Gameplay', ['gta 6 wanted system', 'gta vi escape planner'], true),
    tool('garage-value-calculator', 'GTA VI Garage Value Calculator', 'Total vehicle purchases, upgrades and fees using your own observed prices.', 'Collection', ['gta 6 car value', 'garage calculator']),
    tool('activity-session-planner', 'GTA VI Activity Session Planner', 'Fit story missions, travel and open-world activities into a realistic play session.', 'Planning', ['gta 6 activities', 'session planner']),
  ],
} as const;
