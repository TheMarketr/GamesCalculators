import type { GameConfig, ToolConfig } from './games';

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorDetail {
  title: string;
  body: string;
  points: string[];
}

export interface CalculatorContent {
  overview: string[];
  problem: string;
  useCases: string[];
  steps: string[];
  resultTips: string[];
  details: CalculatorDetail[];
  faqs: CalculatorFaq[];
}

interface GameEditorial {
  gameplay: string;
  decisions: string;
  changingData: string;
  goals: string[];
}

const gameEditorial: Record<string, GameEditorial> = {
  'grow-a-garden': {
    gameplay: 'Grow a Garden combines crop progression, mutations, pets and player trading, so a single displayed number rarely explains the whole decision.',
    decisions: 'Players use these tools to compare crop returns, mutation stacks, trade offers and the time or currency tied up in a garden plan.',
    changingData: 'Crop values, mutation effects, demand and event availability can move after balance changes or community market shifts.',
    goals: ['compare crops before spending resources', 'understand how multipliers change an outcome', 'plan trades with value and demand in view'],
  },
  'blox-fruits': {
    gameplay: 'Blox Fruits mixes leveling, combat builds, mastery and a player-driven fruit trade economy.',
    decisions: 'The useful answer depends on whether you are planning damage, allocating stats, leveling mastery or comparing both value and demand in a trade.',
    changingData: 'Fruit demand, community values and combat balance can change after updates, even when the calculator formula stays the same.',
    goals: ['test a build before committing points', 'compare fruit trade value with demand', 'estimate progress toward a mastery or combat target'],
  },
  'steal-a-brainrot': {
    gameplay: 'Steal a Brainrot centers on collecting units, growing income, applying mutations and deciding when an upgrade or trade improves the collection.',
    decisions: 'A strong plan separates total collection value from income rate, payback time and demand instead of treating every large number as equally useful.',
    changingData: 'Event units, mutation multipliers, income rates and community demand may change as the game receives updates.',
    goals: ['identify the units driving collection income', 'compare trade totals without hiding demand', 'plan rebirth or upgrade timing'],
  },
  '99-nights': {
    gameplay: '99 Nights in the Forest is a survival-planning game where party size, food, fuel, crafting resources and target nights affect one another.',
    decisions: 'These tools turn a run goal into quantities and checkpoints that a group can review before leaving safety.',
    changingData: 'Recipes, class utility and survival balance can change, so planning outputs should be checked against the current in-game rules.',
    goals: ['prepare enough food and fuel for the party', 'compare classes or loadouts for a run', 'track progress and crafting reserves'],
  },
  'adopt-me': {
    gameplay: 'Adopt Me trading depends on pet identity, regular or neon form, fly and ride traits, age, availability and player demand.',
    decisions: 'A calculator can organize an offer and expose the value gap, but a fair trade also depends on demand, preference and how quickly an item is likely to move.',
    changingData: 'Pet values and demand are community references rather than official prices and can move after events, rotations or trading trends.',
    goals: ['compare both sides of a pet trade', 'plan neon and mega-neon requirements', 'estimate the value of a pet collection'],
  },
  mm2: {
    gameplay: 'Murder Mystery 2 has a trading economy built around weapon rarity, category, demand and changing community value references.',
    decisions: 'Players need to compare complete offers and inventory totals rather than judge a trade from rarity labels alone.',
    changingData: 'MM2 trading values and demand are community estimates; new items, duping concerns and market interest can change them.',
    goals: ['compare knife and weapon values', 'check a multi-item trade gap', 'track a collection without creating an account'],
  },
  'pet-simulator-99': {
    gameplay: 'Pet Simulator 99 combines pet power, rarity, enchant effects, diamonds, hatching odds and a fast-moving trading economy.',
    decisions: 'Power for progression and diamond value for trading are different measurements, so the right tool depends on the decision you are making.',
    changingData: 'Pet supply, demand, rap-style references and farming balance can change quickly after updates or events.',
    goals: ['compare pet power separately from trade value', 'estimate hatch odds and farming returns', 'total a trade or inventory in diamonds'],
  },
  minecraft: {
    gameplay: 'Minecraft rewards careful building, coordinate conversion, resource planning, enchanting and experience management.',
    decisions: 'Block geometry and coordinate math are deterministic, while travel safety, resource collection and survival outcomes still depend on the world and the player.',
    changingData: 'Edition differences and future game updates can affect mechanics such as experience, combat or enchanting, so the displayed assumptions matter.',
    goals: ['turn dimensions into buildable block patterns', 'convert and compare coordinates accurately', 'plan experience, enchantments and materials'],
  },
  fortnite: {
    gameplay: 'Fortnite combines aim settings, hardware performance, weapon timing and seasonal XP progression.',
    decisions: 'Players use calculators to set realistic targets, compare sensitivity consistently and estimate ranges before changing settings or scheduling play time.',
    changingData: 'Seasons, XP pacing, weapons, drivers and game patches can change results, while real FPS also varies by map, fight and background load.',
    goals: ['plan Battle Pass or level progress', 'compare sensitivity without losing effective aim speed', 'estimate performance and combat timing'],
  },
  'gta-6': {
    gameplay: 'GTA VI planning currently focuses on confirmed release information, platform status, storage and download scenarios, and clearly labeled map concepts.',
    decisions: 'The tools separate confirmed facts from user-entered assumptions so release preparation does not turn rumors into calculator output.',
    changingData: 'Release details, editions, file size, PC information and map data can change or remain unannounced until Rockstar publishes an update.',
    goals: ['track confirmed release timing', 'model download and budget scenarios', 'review platform or map information with clear status labels'],
  },
};

const categoryPurpose: Record<string, { action: string; inputs: string; output: string; caution: string }> = {
  Values: { action: 'turn item, crop or pet selections into a comparable reference total', inputs: 'item identity, quantity, variant, mutation and demand when available', output: 'a transparent reference value and the contributions behind it', caution: 'Reference values are not guaranteed sale prices or official publisher values.' },
  Trading: { action: 'compare both sides of an offer before accepting or declining', inputs: 'every item on each side, quantities, variants, demand and any important adds', output: 'the value gap, relative demand and a planning verdict', caution: 'A close numerical result can still be a poor trade when demand, preference or scam risk differs.' },
  Planning: { action: 'convert a goal, cost or deadline into a practical plan', inputs: 'the target, current progress, available time and user-set assumptions', output: 'the remaining requirement, pace or budget needed', caution: 'Plans are scenarios, not promises; leave room for interruptions, patches and unknown details.' },
  Progress: { action: 'measure progress and estimate what remains before a target', inputs: 'current level or progress, target and a realistic earning rate', output: 'remaining progress, actions or time under the selected assumptions', caution: 'Actual earning rates vary by mode, skill, boosts, quests and future balance changes.' },
  Combat: { action: 'model damage, shots or timing from a controlled set of combat inputs', inputs: 'base damage, relevant stats, bonuses, defense and attack timing', output: 'an estimated damage or time-to-eliminate result', caution: 'Live combat includes accuracy, range, movement, latency and patch-specific mechanics.' },
  Builds: { action: 'test an allocation before spending limited points or resources', inputs: 'the available budget, chosen stats and preferred playstyle', output: 'a build summary with remaining points and trade-offs', caution: 'A mathematically balanced build is not automatically the best build for every player or activity.' },
  Comparison: { action: 'place two options beside each other using the same criteria', inputs: 'the two items or profiles plus the metric relevant to your goal', output: 'side-by-side strengths, gaps and efficiency signals', caution: 'The highest score only wins the selected comparison; context and player preference still matter.' },
  Reference: { action: 'search, filter and sort a focused local game reference', inputs: 'a search term, category, rarity or sort preference', output: 'matching entries with visible reference fields and update context', caution: 'Reference lists are snapshots and should be checked after major game or economy updates.' },
  Income: { action: 'project earnings across a selected play session', inputs: 'income rate, quantity, boosts and session length', output: 'earnings per interval and a session total', caution: 'Downtime, collection limits and balance changes can make real earnings lower than a continuous-rate projection.' },
  Odds: { action: 'translate a per-attempt chance into multi-attempt probability', inputs: 'base chance, attempts and any verified luck multiplier', output: 'the chance of at least one success plus an expectation estimate', caution: 'Probability describes many possible runs and never guarantees a result on a specific attempt.' },
  Building: { action: 'turn dimensions into a block pattern or material estimate', inputs: 'width, diameter, height, fill mode and other shape settings', output: 'a build pattern, row plan or estimated block count', caution: 'Decorative blocks, terrain work and design changes should be added to the material buffer.' },
  Coordinates: { action: 'convert or compare world positions without mental arithmetic', inputs: 'source coordinates, dimension or destination position and rounding preference', output: 'converted coordinates, offsets, direction or travel distance', caution: 'Check safe terrain and portal-linking conditions before traveling or building at the result.' },
  Enchanting: { action: 'plan levels, materials and combining order before using resources', inputs: 'current levels, bookshelves, item history and desired enchantment setup', output: 'estimated costs and threshold warnings', caution: 'Edition, version and random enchantment offers can change the practical result.' },
  Inventory: { action: 'total and organize a collection on this device', inputs: 'owned items, quantities and applicable variants', output: 'an inventory total and item-by-item breakdown', caution: 'Saved browser data can be cleared by private browsing, storage cleanup or a different device.' },
  Tracker: { action: 'record collection or code progress privately in the browser', inputs: 'the entries you have collected, redeemed or still need', output: 'completion progress and a reusable local checklist', caution: 'The tracker does not verify third-party codes or synchronize across devices.' },
  Pets: { action: 'plan pet variants, aging work or side-by-side pet choices', inputs: 'pet type, current form, age and desired neon or mega goal', output: 'remaining pets, stages or comparison context', caution: 'Event availability and player demand can matter more than a simple variant multiplier.' },
  Settings: { action: 'convert or compare control settings consistently', inputs: 'mouse DPI, in-game sensitivity and the target setup', output: 'effective sensitivity and a matched conversion', caution: 'Comfort, mousepad space and aim style should guide the final setting after the numerical match.' },
  Collection: { action: 'create a private user-defined collection estimate', inputs: 'owned quantities and the values you choose for each group', output: 'an organized estimate with clearly user-supplied assumptions', caution: 'This is not an appraisal or permission to buy, sell or transfer an account.' },
  Survival: { action: 'estimate supplies for a target survival run', inputs: 'party size, remaining nights, consumption and safety reserve', output: 'recommended food, fuel or other run resources', caution: 'Unexpected encounters and team strategy can increase consumption beyond the estimate.' },
  Crafting: { action: 'calculate complete crafts and leftover materials', inputs: 'available ingredients and recipe requirements', output: 'maximum crafts, consumed materials and leftovers', caution: 'Verify the current recipe and workstation requirements in game.' },
  Map: { action: 'explore or model locations and travel scenarios', inputs: 'location filters, area assumptions, route or speed', output: 'matching places, estimated scale or travel time', caution: 'Unconfirmed locations and map-size scenarios must not be treated as released map facts.' },
  Release: { action: 'check confirmed release timing or platform status', inputs: 'your time zone, platform or the confirmed date currently shown', output: 'a countdown or clearly labeled availability status', caution: 'Only publisher announcements can confirm or change release information.' },
  Performance: { action: 'estimate a practical performance range for a hardware and settings combination', inputs: 'CPU, GPU, resolution, preset and performance mode', output: 'an FPS range rather than a falsely exact benchmark', caution: 'Drivers, temperatures, memory, background apps and live match conditions affect real FPS.' },
  Power: { action: 'combine unit strength, quantity and boosts into a team estimate', inputs: 'base power, quantity and active multipliers', output: 'estimated team power and each factor\'s contribution', caution: 'Hidden caps, encounter rules and future balance changes may affect in-game performance.' },
};

const fallbackPurpose = {
  action: 'turn game inputs into a clearer decision',
  inputs: 'the values shown in the calculator and the assumptions that match your situation',
  output: 'a transparent estimate with a visible breakdown',
  caution: 'Treat the result as planning support and verify important decisions in the current game version.',
};

export function buildCalculatorContent(game: GameConfig, tool: ToolConfig): CalculatorContent {
  const editorial = gameEditorial[game.slug];
  const purpose = categoryPurpose[tool.category] ?? fallbackPurpose;
  const gameName = game.shortName ?? game.name;
  const searchPhrase = tool.keywords?.[0] ?? tool.category.toLowerCase();

  const overview = [
    `${tool.name} helps players ${purpose.action}. ${tool.description}`,
    `${editorial.gameplay} ${editorial.decisions}`,
  ];

  const faqs: CalculatorFaq[] = [
    {
      question: `What does the ${tool.name} calculate?`,
      answer: `It uses ${purpose.inputs} to produce ${purpose.output}. The calculator is designed for ${gameName} players researching ${searchPhrase}, and the result changes as you adjust the inputs.`,
    },
    {
      question: `How do I use this ${gameName} calculator?`,
      answer: `Start with the values that match your current ${gameName} situation, review any default assumptions, then change one input at a time. Read the breakdown as well as the headline result so you can see which factor has the largest effect.`,
    },
    {
      question: `Is this ${tool.shortName} accurate?`,
      answer: `The calculation follows the assumptions shown on the page and the logic is tested separately from the interface. ${purpose.caution} The displayed data review date is ${tool.updated}.`,
    },
    {
      question: `Is this an official ${gameName} tool?`,
      answer: `No. GamesCalculators is an independent fan utility and is not affiliated with or endorsed by the game publisher. Names are used only to identify the game the calculator supports.`,
    },
    {
      question: `Why can ${gameName} results change after an update?`,
      answer: `${editorial.changingData} Check the visible update date and current in-game information after a major patch.`,
    },
    {
      question: `Can I use the ${tool.name} on mobile?`,
      answer: `Yes. The calculator is designed for current phone and desktop browsers, needs no account, and performs its calculations in your browser.`,
    },
    {
      question: `Does GamesCalculators save or sell my calculator inputs?`,
      answer: `Calculator inputs are processed in your browser. Tools that save a checklist or collection use local browser storage; clearing browser data or switching devices can remove that saved state.`,
    },
    {
      question: `Is the ${tool.name} free to use?`,
      answer: `Yes. The calculator and its supporting ${gameName} gameplay explanation are free to use without registration or a paid result screen.`,
    },
  ];

  return {
    overview,
    problem: `The practical problem is deciding what to do next without guessing from an isolated number. This tool keeps ${purpose.inputs} together, then explains ${purpose.output} so the result can be checked before you act in ${game.name}.`,
    useCases: [
      `Use it when you want to ${editorial.goals[0]}.`,
      `Run a second scenario to ${editorial.goals[1]}.`,
      `Compare the breakdown when you need to ${editorial.goals[2]}.`,
    ],
    steps: [
      `Choose the ${gameName} inputs that match your current situation.`,
      'Replace example or default values with the numbers you can verify in game.',
      'Review the result breakdown, warnings and assumptions—not only the largest number.',
      'Change one variable and compare scenarios before making the final gameplay decision.',
    ],
    resultTips: [
      `Match the output to your goal: ${purpose.output}.`,
      `Check the update date (${tool.updated}) after a major ${gameName} patch or event.`,
      'Leave a sensible buffer when the result depends on time, player behavior, random outcomes or market demand.',
    ],
    details: [
      {
        title: `Inputs that matter for this ${tool.category.toLowerCase()} tool`,
        body: `The calculator is most useful when its inputs reflect the same scenario you will face in ${gameName}.`,
        points: [purpose.inputs, 'Any visible variant, boost, edition or rounding choice', 'The current game version and the displayed data review date'],
      },
      {
        title: 'How to interpret the result',
        body: `Read the result as ${purpose.output}. Use the detailed rows to identify which input drives the answer and compare at least two plausible scenarios.`,
        points: ['Headline result for a fast comparison', 'Breakdown for the factors behind the total', 'Warnings and assumptions for limits the number cannot capture'],
      },
      {
        title: `Limits of a ${gameName} calculator`,
        body: purpose.caution,
        points: [editorial.changingData, 'Randomness and player behavior cannot be guaranteed by a formula', 'Publisher announcements and current in-game rules take priority over third-party references'],
      },
    ],
    faqs,
  };
}
