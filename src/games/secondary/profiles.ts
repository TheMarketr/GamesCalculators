export interface NumericField {
  key: string;
  label: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export type FormulaKey =
  | 'mutation' | 'profit' | 'damage' | 'stats' | 'build' | 'mastery'
  | 'income' | 'rebirth' | 'crafting' | 'fuel' | 'food' | 'progress' | 'run'
  | 'neon' | 'mega' | 'age' | 'odds' | 'power' | 'enchant' | 'diamonds'
  | 'coordinates' | 'coordinate-delta' | 'anvil' | 'dome' | 'sphere' | 'distance'
  | 'minecraft-damage' | 'spiral' | 'stack' | 'oval' | 'account' | 'edpi'
  | 'sensitivity' | 'level' | 'battle-pass' | 'ttk' | 'gta-cost' | 'map-size'
  | 'edition' | 'gta-mission' | 'gta-split' | 'gta-wanted' | 'gta-garage'
  | 'gta-session';

export interface CalculatorProfile {
  formula: FormulaKey;
  eyebrow: string;
  heading: string;
  note: string;
  fields: NumericField[];
}

export type SecondaryMode = 'formula' | 'reference' | 'comparison' | 'trade' | 'portfolio' | 'tracker' | 'codes';
const comparisonTools = new Set(['crop-comparison', 'fruit-comparison', 'best-fruits', 'income-comparison', 'class-comparison', 'weapon-comparison', 'pet-comparison']);
const referenceTools = new Set(['prices', 'items', 'best-crops', 'fruit-values', 'values', 'characters', 'crafting', 'pet-values', 'value-list', 'trading-values', 'knife-values', 'godly-values', 'map-locations', 'pets']);

export function getSecondaryMode(gameSlug: string, toolSlug: string): SecondaryMode {
  if (toolSlug === 'codes') return 'codes';
  if (toolSlug === 'collection-tracker') return 'tracker';
  if (toolSlug === 'trade-calculator') return 'trade';
  if (gameSlug === 'grow-a-garden' && toolSlug === 'pets') return 'comparison';
  if (toolSlug === 'inventory-calculator' || toolSlug === 'pet-value-calculator' || ((gameSlug === 'mm2' || gameSlug === 'pet-simulator-99') && toolSlug === 'value-calculator')) return 'portfolio';
  if (comparisonTools.has(toolSlug)) return 'comparison';
  if (referenceTools.has(toolSlug)) return 'reference';
  return 'formula';
}

const field = (key: string, label: string, defaultValue: number, min = 0, max = 1000000, step = 1, suffix?: string): NumericField => ({ key, label, defaultValue, min, max, step, suffix });
const profile = (formula: FormulaKey, heading: string, note: string, fields: NumericField[], eyebrow = 'Interactive planner'): CalculatorProfile => ({ formula, heading, note, fields, eyebrow });

const profiles: Record<string, CalculatorProfile> = {
  'grow-a-garden/mutation-calculator': profile('mutation', 'Stack crop multipliers', 'Enter the base value and the multipliers active on the crop. The calculation multiplies each effect once.', [field('base', 'Base crop value', 5000), field('primary', 'Growth multiplier', 2, 1, 100, .1, '×'), field('secondary', 'Mutation multiplier', 5, 1, 1000, .1, '×'), field('quantity', 'Quantity', 1, 1, 999)]),
  'grow-a-garden/profit-calculator': profile('profit', 'Plan crop profit and ROI', 'Use your own seed cost and expected sell value; market and mutation outcomes can vary.', [field('cost', 'Seed or input cost', 2500), field('sale', 'Sell value per harvest', 4500), field('harvests', 'Expected harvests', 3, 1, 100), field('quantity', 'Plots planted', 8, 1, 1000)]),

  'blox-fruits/damage-calculator': profile('damage', 'Estimate combo damage', 'This is a transparent planning model, not a combat-engine simulation. Adjust defense and bonuses to match your test case.', [field('base', 'Base move damage', 1800), field('stat', 'Allocated stat points', 1800), field('mastery', 'Mastery level', 350), field('bonus', 'Accessory / race bonus', 10, 0, 300, 1, '%'), field('defense', 'Target reduction', 25, 0, 90, 1, '%')], 'Combat estimate'),
  'blox-fruits/stat-calculator': profile('stats', 'Allocate your stat budget', 'The result flags overspending and shows how evenly the selected build is distributed.', [field('total', 'Available stat points', 7650), field('one', 'Melee', 2550), field('two', 'Defense', 2550), field('three', 'Primary damage stat', 2550)]),
  'blox-fruits/build-calculator': profile('build', 'Score a Blox Fruits build', 'Set planned points in each major category. The score highlights offense, survivability and unused points.', [field('fruit', 'Blox Fruit points', 2550), field('melee', 'Melee points', 1275), field('sword', 'Sword points', 1275), field('defense', 'Defense points', 2550)]),
  'blox-fruits/mastery-calculator': profile('mastery', 'Plan mastery progress', 'Use an observed average actions-per-level and action time for a practical session estimate.', [field('current', 'Current mastery', 200), field('target', 'Target mastery', 350), field('actions', 'Actions per mastery level', 6, 1, 1000), field('seconds', 'Seconds per action', 18, .1, 3600, .1)]),

  'steal-a-brainrot/income-calculator': profile('income', 'Project collection income', 'Use the income shown in your current game session and any active multiplier.', [field('base', 'Income per second', 50000), field('quantity', 'Matching units', 2, 1, 999), field('multiplier', 'Active multiplier', 1, 0, 1000, .1, '×'), field('minutes', 'Session length', 60, 1, 100000, 1, ' min')], 'Income projection'),
  'steal-a-brainrot/mutation-calculator': profile('mutation', 'Apply mutation multipliers', 'Enter current local reference value and the active mutation or event multipliers.', [field('base', 'Base value or income', 50000), field('primary', 'Mutation multiplier', 3, 1, 1000, .1, '×'), field('secondary', 'Event multiplier', 1, 1, 1000, .1, '×'), field('quantity', 'Quantity', 1, 1, 999)]),
  'steal-a-brainrot/rebirth-calculator': profile('rebirth', 'Estimate time to rebirth', 'The estimate assumes a steady income rate and does not include offline changes.', [field('current', 'Current cash', 2500000), field('target', 'Rebirth cost', 10000000), field('income', 'Income per second', 25000, .01), field('boost', 'Income multiplier', 1, .01, 1000, .1, '×')]),

  '99-nights/crafting-calculator': profile('crafting', 'Calculate crafts and leftovers', 'Set resources on hand and the material costs per craft.', [field('wood', 'Wood available', 80), field('scrap', 'Scrap available', 30), field('woodCost', 'Wood per craft', 8, 1), field('scrapCost', 'Scrap per craft', 3, 1)], 'Crafting planner'),
  '99-nights/fuel-calculator': profile('fuel', 'Plan campfire fuel', 'Set a measured per-night burn rate and add a reserve for unexpected delays.', [field('current', 'Current night', 37), field('target', 'Target night', 99), field('perNight', 'Fuel units per night', 3, .1, 1000, .1), field('reserve', 'Safety reserve', 15, 0, 200, 1, '%')], 'Survival planner'),
  '99-nights/food-calculator': profile('food', 'Plan party food', 'Use your party’s observed meal use and keep a reserve for recovery or slower nights.', [field('current', 'Current night', 37), field('target', 'Target night', 99), field('players', 'Players', 4, 1, 20), field('perNight', 'Meals per player per night', .75, .01, 20, .05)], 'Survival planner'),
  '99-nights/progress-calculator': profile('progress', 'Measure run progress', 'Progress is measured against the target night you choose.', [field('current', 'Current night', 37), field('target', 'Target night', 99, 1), field('players', 'Players remaining', 4, 1, 20)]),
  '99-nights/run-planner': profile('run', 'Build a remaining-run reserve', 'Combines nights remaining, party size and per-night consumption into one safety score.', [field('current', 'Current night', 37), field('target', 'Target night', 99), field('players', 'Players', 4, 1, 20), field('food', 'Food on hand', 120), field('fuel', 'Fuel on hand', 160)]),

  'adopt-me/neon-calculator': profile('neon', 'Plan a neon pet', 'A neon requires four fully grown pets. Use completed pets to measure remaining aging work.', [field('owned', 'Matching pets owned', 2, 0, 100), field('fullGrown', 'Fully grown matching pets', 1, 0, 100), field('tasksPerPet', 'Estimated tasks per pet', 150, 1, 10000)]),
  'adopt-me/mega-neon-calculator': profile('mega', 'Plan a mega neon pet', 'A mega neon requires sixteen fully grown base pets, combined through four neons.', [field('owned', 'Matching base pets owned', 8, 0, 100), field('fullGrown', 'Fully grown base pets', 4, 0, 100), field('tasksPerPet', 'Estimated tasks per pet', 150, 1, 10000)]),
  'adopt-me/age-calculator': profile('age', 'Estimate pet aging time', 'Use the number of stages and tasks that remain for the pet you are aging.', [field('stages', 'Growth stages remaining', 4, 0, 6), field('tasksPerStage', 'Tasks per stage', 30, 1, 1000), field('minutesPerTask', 'Average minutes per task', 2.5, .1, 60, .1)]),
  'adopt-me/egg-odds-calculator': profile('odds', 'Estimate egg odds', 'Enter the in-game rarity chance for the current egg. Results show probability, not a guarantee.', [field('chance', 'Target chance per egg', 3, .0001, 100, .01, '%'), field('attempts', 'Eggs opened', 20, 1, 1000000), field('boost', 'Luck multiplier', 1, .01, 100, .01, '×')], 'Probability calculator'),

  'mm2/crate-odds-calculator': profile('odds', 'Estimate crate odds', 'Enter the displayed or observed chance for the item tier you are targeting.', [field('chance', 'Chance per crate', 1, .0001, 100, .01, '%'), field('attempts', 'Crates opened', 50, 1, 1000000), field('boost', 'Event multiplier', 1, .01, 100, .01, '×')], 'Probability calculator'),

  'pet-simulator-99/hatch-odds-calculator': profile('odds', 'Estimate hatch odds', 'Use the current in-game chance and total active luck multiplier; every hatch remains random.', [field('chance', 'Base chance per egg', .01, .000001, 100, .0001, '%'), field('attempts', 'Eggs hatched', 10000, 1, 1000000000), field('boost', 'Total luck multiplier', 5, .01, 100000, .1, '×')], 'Probability calculator'),
  'pet-simulator-99/power-calculator': profile('power', 'Calculate team power', 'Combines pet power, equipped count and active boosts without claiming hidden server modifiers.', [field('base', 'Power per pet', 2500000), field('quantity', 'Pets equipped', 15, 1, 100), field('boost', 'Team boost', 25, 0, 10000, 1, '%'), field('enchant', 'Enchant bonus', 10, 0, 10000, 1, '%')]),
  'pet-simulator-99/enchant-calculator': profile('enchant', 'Estimate stacked enchants', 'Repeated enchants use a visible diminishing-return model so the estimate avoids false precision.', [field('base', 'Bonus per enchant', 20, 0, 10000, .1, '%'), field('copies', 'Matching enchants', 3, 1, 20), field('falloff', 'Effect retained per extra copy', 75, 0, 100, 1, '%')]),
  'pet-simulator-99/diamond-calculator': profile('diamonds', 'Project diamond farming', 'Enter an observed rate from your current area and boosts for a session estimate.', [field('rate', 'Diamonds per minute', 125000), field('minutes', 'Session length', 60, 1, 100000, 1, ' min'), field('boost', 'Active boost', 50, 0, 10000, 1, '%')]),

  'minecraft/nether-coordinates-calculator': profile('coordinates', 'Convert Overworld and Nether coordinates', 'Overworld horizontal coordinates divide by eight in the Nether; Nether coordinates multiply by eight in the Overworld.', [field('x', 'X coordinate', 800, -30000000, 30000000), field('z', 'Z coordinate', -400, -30000000, 30000000), field('scale', 'Source scale (8 = Overworld)', 8, 1, 8)]),
  'minecraft/coordinates-calculator': profile('coordinate-delta', 'Calculate coordinate travel', 'The result shows the horizontal offset, direction and straight-line distance.', [field('x1', 'Start X', 120, -30000000, 30000000), field('z1', 'Start Z', -80, -30000000, 30000000), field('x2', 'Target X', 760, -30000000, 30000000), field('z2', 'Target Z', 240, -30000000, 30000000)]),
  'minecraft/anvil-calculator': profile('anvil', 'Estimate anvil level cost', 'The prior-work penalty doubles with each previous anvil operation. Java Edition survival normally blocks costs of 40 or more.', [field('itemCost', 'Base item cost', 8), field('enchantCost', 'Enchantment cost', 12), field('priorWorks', 'Previous anvil operations', 2, 0, 20), field('rename', 'Rename cost', 0, 0, 1)]),
  'minecraft/dome-calculator': profile('dome', 'Estimate a Minecraft dome', 'Uses geometric volume and surface estimates with a pixel-build adjustment.', [field('diameter', 'Dome diameter', 31, 3, 501), field('thickness', 'Wall thickness', 1, 1, 20)]),
  'minecraft/sphere-calculator': profile('sphere', 'Estimate a Minecraft sphere', 'Choose 1 for hollow or 0 for filled. Counts are geometric estimates for planning materials.', [field('diameter', 'Sphere diameter', 31, 3, 501), field('hollow', 'Hollow (1 yes, 0 no)', 1, 0, 1), field('thickness', 'Shell thickness', 1, 1, 20)]),
  'minecraft/distance-calculator': profile('distance', 'Calculate Minecraft distance', 'Shows horizontal, full 3D and Nether-equivalent horizontal distance.', [field('x1', 'Start X', 0, -30000000, 30000000), field('y1', 'Start Y', 64, -64, 512), field('z1', 'Start Z', 0, -30000000, 30000000), field('x2', 'Target X', 800, -30000000, 30000000), field('y2', 'Target Y', 80, -64, 512), field('z2', 'Target Z', -400, -30000000, 30000000)]),
  'minecraft/damage-calculator': profile('minecraft-damage', 'Estimate post-armor damage', 'Uses the Java-style armor and toughness reduction model plus an entered protection reduction.', [field('damage', 'Incoming damage', 20, 0, 100000, .5), field('armor', 'Armor points', 20, 0, 30, 1), field('toughness', 'Armor toughness', 8, 0, 20, 1), field('protection', 'Protection reduction', 16, 0, 80, 1, '%')]),
  'minecraft/spiral-staircase-calculator': profile('spiral', 'Plan a spiral staircase', 'Estimates steps and block volume from rise, radius, turns and walkway width.', [field('height', 'Vertical rise', 24, 1, 500), field('radius', 'Outer radius', 5, 2, 100), field('turns', 'Full turns', 2, .25, 20, .25), field('width', 'Walkway width', 2, 1, 20)]),
  'minecraft/stack-calculator': profile('stack', 'Convert items into storage units', 'Set the actual maximum stack size for the item; shulker estimates assume 27 slots.', [field('count', 'Total items', 2500, 0, 1000000000), field('stackSize', 'Items per stack', 64, 1, 1000)]),
  'minecraft/oval-generator': profile('oval', 'Estimate a pixel oval', 'Returns row count and filled or outline block estimates for the chosen dimensions.', [field('width', 'Width', 31, 3, 501), field('height', 'Height', 19, 3, 501), field('thickness', 'Outline thickness', 1, 1, 20)]),

  'fortnite/account-value-calculator': profile('account', 'Build a private collection estimate', 'This user-entered replacement-cost estimate is not a resale valuation and remains only in your browser.', [field('skins', 'Skins owned', 120), field('pickaxes', 'Pickaxes owned', 55), field('emotes', 'Emotes owned', 80), field('average', 'Average V-Bucks per item', 900, 0, 10000)]),
  'fortnite/edpi-calculator': profile('edpi', 'Calculate Fortnite eDPI', 'eDPI equals mouse DPI multiplied by in-game sensitivity as a decimal.', [field('dpi', 'Mouse DPI', 800, 50, 32000), field('sensitivity', 'In-game sensitivity', 6.5, .1, 100, .1, '%')]),
  'fortnite/sensitivity-calculator': profile('sensitivity', 'Convert sensitivity between DPI settings', 'Preserves your current eDPI when moving to a different mouse DPI.', [field('currentDpi', 'Current DPI', 800, 50, 32000), field('currentSensitivity', 'Current sensitivity', 6.5, .1, 100, .1, '%'), field('targetDpi', 'New DPI', 1600, 50, 32000)]),
  'fortnite/level-calculator': profile('level', 'Plan Fortnite levels', 'Set the current season values you see in game; XP requirements can change between seasons.', [field('current', 'Current level', 42), field('target', 'Target level', 100), field('xpPerLevel', 'Average XP per level', 80000), field('xpPerMatch', 'Average XP per match', 18000)]),
  'fortnite/battle-pass-calculator': profile('battle-pass', 'Plan Battle Pass progress', 'Calculates a daily XP pace and matches per day from your own season deadline.', [field('current', 'Current level', 42), field('target', 'Target level', 100), field('xpPerLevel', 'Average XP per level', 80000), field('days', 'Days remaining', 28, 1, 365), field('xpPerMatch', 'Average XP per match', 18000)]),
  'fortnite/ttk-calculator': profile('ttk', 'Estimate time to eliminate', 'Assumes repeated body damage at a steady fire rate and ignores travel time, reloads and missed shots.', [field('damage', 'Damage per shot', 32, .01), field('rpm', 'Fire rate', 540, .01), field('health', 'Target health + shields', 200, .01)]),
  'fortnite/xp-per-level': profile('level', 'Calculate XP across levels', 'Use the current season requirement shown in game for a custom level range.', [field('current', 'Start level', 1), field('target', 'End level', 100), field('xpPerLevel', 'Average XP per level', 80000), field('xpPerMatch', 'Average XP per match', 18000)]),

  'gta-6/cost': profile('gta-cost', 'Plan a GTA VI purchase budget', 'Official regional pricing, taxes and edition contents can change. Enter the prices available to you.', [field('base', 'Game price', 70, 0, 1000, .01, '$'), field('tax', 'Sales tax', 8, 0, 100, .1, '%'), field('extras', 'Add-ons or accessories', 25, 0, 10000, .01, '$'), field('saved', 'Amount already saved', 40, 0, 10000, .01, '$')]),
  'gta-6/map-size': profile('map-size', 'Compare map-size scenarios', 'Enter scenario dimensions rather than treating pre-release estimates as confirmed map measurements.', [field('width', 'Scenario width', 12, .1, 1000, .1, ' km'), field('height', 'Scenario height', 10, .1, 1000, .1, ' km'), field('speed', 'Average travel speed', 60, .1, 1000, .1, ' km/h')]),
  'gta-6/edition-comparison': profile('edition', 'Compare Standard and Ultimate editions', 'Rockstar Games currently lists Standard and Ultimate editions. Enter the actual regional store prices and your personal value for the Ultimate extras.', [field('standard', 'Standard Edition price', 70, 0, 1000, .01, '$'), field('premium', 'Ultimate Edition price', 100, 0, 1000, .01, '$'), field('extrasValue', 'Value of Ultimate extras to you', 35, 0, 1000, .01, '$')]),
  'gta-6/mission-earnings-calculator': profile('gta-mission', 'Estimate mission earnings', 'GTA VI mission payouts are not entered as official values here. Use amounts and times observed in your own game after launch.', [field('payout', 'Gross payout per run', 25000, 0, 1000000000, 100, '$'), field('cost', 'Setup and supply cost per run', 2500, 0, 1000000000, 100, '$'), field('bonus', 'Bonus payout', 10, 0, 1000, .1, '%'), field('minutes', 'Minutes per run', 18, .1, 1440, .1), field('runs', 'Planned runs', 4, 1, 1000)], 'Post-launch money planner'),
  'gta-6/payout-split-calculator': profile('gta-split', 'Split a crew payout', 'Enter a total take and costs from the activity you are playing. This does not assume an unconfirmed GTA VI multiplayer economy.', [field('take', 'Total take', 500000, 0, 10000000000, 100, '$'), field('cost', 'Setup costs', 50000, 0, 10000000000, 100, '$'), field('players', 'Crew members', 4, 1, 8), field('leader', 'Leader share', 40, 0, 100, 1, '%')], 'Crew payout model'),
  'gta-6/wanted-escape-planner': profile('gta-wanted', 'Plan a lower-risk escape', 'The Extended Look showed witness, description, vehicle and disguise feedback, but Rockstar has not published its internal formula. This is a transparent checklist score.', [field('witnesses', 'Witness exposure (0–5)', 3, 0, 5), field('heat', 'Wanted pressure (0–6)', 3, 0, 6), field('knownVehicle', 'Known vehicle (1 yes, 0 no)', 1, 0, 1), field('knownOutfit', 'Known outfit (1 yes, 0 no)', 1, 0, 1), field('changedVehicle', 'Changed vehicle (1 yes, 0 no)', 0, 0, 1), field('changedOutfit', 'Changed outfit / disguise (1 yes, 0 no)', 0, 0, 1)], 'Showcase-informed planning model'),
  'gta-6/garage-value-calculator': profile('gta-garage', 'Estimate garage investment', 'Use current in-game purchase and upgrade prices after launch. The result is money invested, not a guaranteed resale value.', [field('vehicles', 'Vehicles owned', 8, 0, 500), field('averagePrice', 'Average purchase price', 65000, 0, 1000000000, 100, '$'), field('upgrades', 'Average upgrades per vehicle', 18000, 0, 1000000000, 100, '$'), field('fees', 'Other garage costs', 10000, 0, 1000000000, 100, '$'), field('resaleRate', 'Estimated resale rate', 60, 0, 100, 1, '%')], 'Collection budget'),
  'gta-6/activity-session-planner': profile('gta-session', 'Plan a GTA VI play session', 'Use the activity and travel times you observe. The presentation showed many activities but did not publish their final durations or rewards.', [field('session', 'Session length', 120, 5, 1440, 5, ' min'), field('mission', 'Average mission time', 25, 1, 600, 1, ' min'), field('travel', 'Travel and setup per mission', 8, 0, 300, 1, ' min'), field('freeRoam', 'Reserved free-roam time', 30, 0, 1440, 5, ' min')], 'Time planner'),
};

export function getCalculatorProfile(gameSlug: string, toolSlug: string): CalculatorProfile | undefined {
  return profiles[`${gameSlug}/${toolSlug}`];
}
