export interface GuideDepthProfile {
  context: string;
  measurement: string;
  verification: string;
  scenario: string;
}

export interface GuideFocusProfile {
  label: string;
  decision: string;
  pitfall: string;
  success: string;
}

const gameProfiles: Record<string, GuideDepthProfile> = {
  'grow-a-garden': {
    context: 'Grow a Garden decisions are easiest to understand when the crop, current weight, growth variant, attached mutations and the purpose of the calculation are recorded separately. A display value can be useful without being a guaranteed trade price, because player demand and event availability may move faster than a static reference table. Keep the calculator result, the live trade offer and your personal collection goal as three different pieces of information.',
    measurement: 'For a repeatable comparison, record the same crop at its unmodified base state before adding weight or mutation effects. Compare one change at a time and keep screenshots of unusual combinations. This makes it possible to see whether a surprising result comes from the base crop, the weight curve, a growth variant or stacked mutation assumptions rather than accepting one large number without an explanation.',
    verification: 'After an update, confirm newly added crops, renamed mutations, multiplier changes and event availability in the live game before relying on an older plan. Community lists can help locate a change, but the game state and clearly dated evidence should decide whether the reference needs revision. Recalculate saved examples whenever one of their ingredients changes.',
    scenario: 'Imagine two crops that show similar estimated value. One has a desirable limited mutation while the other reaches the number mostly through weight. A collector may prefer the limited combination, while a player optimizing garden income may care more about a repeatable crop. The useful answer therefore includes both the numeric estimate and the reason that estimate matters for the current goal.',
  },
  'blox-fruits': {
    context: 'Blox Fruits planning combines several systems that should not be collapsed into one score: character stats, fruit or weapon choice, mastery requirements, mobility, survivability and the activity being attempted. A build that clears routine enemies quickly may perform differently in a boss, raid or player-versus-player situation. Write down the activity first so every recommendation has a concrete target.',
    measurement: 'Use current stat points, mastery level, equipment and repeatable action times as the baseline. If a plan changes several things at once, create separate scenarios for each change. Tracking the number of actions or minutes required for a milestone is more dependable than saying a method feels fast, because the recorded rate can be compared with a later sea, quest route or balance patch.',
    verification: 'Blox Fruits updates can change fruit behavior, mastery routes, level caps, items and trade demand. Confirm the version, re-read official update information and test a short sample before committing a full session or expensive trade. A community build is a starting hypothesis, not proof that the same allocation fits every device, play style or activity.',
    scenario: 'A fruit-focused player may gain immediate damage from another fruit stat investment but lose comfort if defense or melee resources fall too low. A hybrid setup may feel flexible yet delay important damage thresholds. Compare the focused and hybrid paths at the next meaningful milestone, then choose the one whose weaknesses you can actually manage during the target activity.',
  },
  'steal-a-brainrot': {
    context: 'Steal a Brainrot planning works best when collection value, income rate, mutation effects, slot pressure and acquisition risk are considered separately. A rare-looking unit is not automatically the best income upgrade, and a high listed value does not erase the time needed to earn back its cost. Decide whether the goal is collection completion, cash flow or trading before ranking alternatives.',
    measurement: 'Record the current income per second, occupied slots and the exact variant of every compared unit. Calculate the gain over the unit being replaced rather than using the new unit’s total income as if all of it were additional. The difference between old and new income is the amount that pays back the acquisition cost, so it is the correct value for a break-even estimate.',
    verification: 'Event units, mutations, machine recipes and community demand can shift after updates. Verify the live output and variant labels, then compare them with dated references. Keep trade confidence separate from calculator confidence: the arithmetic may be correct even when a community price or a seller’s description is unreliable.',
    scenario: 'Suppose a purchase adds a large headline income but replaces a unit that was already producing most of that amount. The true improvement may be small and the payback period long. A cheaper unit with a lower headline value can be the stronger upgrade when its net gain is larger relative to cost and it does not consume a strategically important slot.',
  },
  '99-nights': {
    context: 'A 99 Nights in the Forest run is a resource plan under uncertainty. Food, fuel, party size, travel time, rescue goals and unexpected delays interact, so a single best-case total is not enough. Separate required consumption from the safety reserve and describe the conditions that would cause the group to turn back, gather more supplies or change objectives.',
    measurement: 'Measure consumption over several ordinary day-and-night cycles rather than one unusually calm or chaotic interval. Record the party size and any role that changes gathering or usage. Use the observed average as the baseline, then add a reserve for detours, missed pickups and emergency recovery instead of hiding those risks inside an unexplained round number.',
    verification: 'Updates, difficulty settings and group composition can change how quickly supplies disappear. Recheck a short sample at the start of a new run and update the calculator when the measured rate differs. A checklist should support situational judgment: it cannot predict every encounter, map layout or decision made by other players.',
    scenario: 'A party may appear to have enough fuel for the planned nights when only the ideal burn rate is considered. If one member spends extra time away from camp or the route produces fewer pickups, that plan fails early. Adding a visible reserve makes the tradeoff clear and lets the group decide whether another objective is worth consuming it.',
  },
  'adopt-me': {
    context: 'Adopt Me planning involves both progression and a player-driven trading market. Pet age, neon or mega requirements, potion use, variant traits, demand and personal collection goals should be recorded separately. A calculated task total can be dependable while a trade value remains changeable, so do not present both numbers with the same level of certainty.',
    measurement: 'For aging projects, start with the number of eligible pets already owned and record their current age stages. Estimate tasks from the remaining stages, then compare sessions using an observed tasks-per-session rate. For trades, enter every item and important variant on both sides so one attractive headline pet does not hide several meaningful adds.',
    verification: 'Seasonal events, retired eggs, new pets and balance changes can affect availability or demand. Confirm the exact pet, age, neon or mega status, fly or ride effects and other variants in the final trade window. Use dated value references as context and give priority to the live offer plus your own collection objective.',
    scenario: 'A mega project that starts with several partially aged pets can require far fewer tasks than a simple sixteen-pet multiplication suggests. Conversely, potion assumptions can make a schedule look shorter than the resources actually allow. Listing owned progress and boosts separately produces a plan that can be updated after every session without starting over.',
  },
  'mm2': {
    context: 'Murder Mystery 2 trading decisions depend on item identity, variant, value reference, demand, stability and the shape of the complete offer. A nominally equal trade may still be difficult to reverse if one side contains low-demand items. Treat published values as a comparison tool and not as an official promise that another player must accept.',
    measurement: 'List every weapon or collectible on both sides and preserve variants such as chroma, ancient, vintage or event versions. Compare total reference value, then inspect how much of each total comes from the most liquid items. A balanced offer made of recognizable, consistently requested items can be more useful than a larger total concentrated in difficult inventory.',
    verification: 'Check the live trade window before confirming because icons, names and quantities can be misread under pressure. Revisit dated community lists when events or major updates change supply. Never treat urgency, a private message or a claim about an immediate value increase as evidence; verify independently and decline when the details do not match.',
    scenario: 'Consider an offer that is slightly higher by one reference list but consists of several weak-demand items. If the goal is to trade again soon, accepting may create more work and exposure to another uncertain valuation. If the goal is collection completion, the same offer could be reasonable. The decision changes with intent even though the arithmetic does not.',
  },
  'pet-simulator-99': {
    context: 'Pet Simulator 99 comparisons should separate pet power, variant, enchant or boost effects, market demand, hatch probability and the player’s current progression goal. A high-number pet is not automatically the best use of diamonds if it adds little to the active team or is difficult to resell. Define whether the decision targets power, collection, hatching or trading.',
    measurement: 'Record the exact normal, golden, rainbow, shiny or huge variant and compare the improvement over the pets currently equipped. For hatching, use per-egg probability, eggs per batch and the actual number of attempts available. Expected attempts describe a long-run average; the chance of success after a chosen number of eggs is the better way to plan a finite session.',
    verification: 'Machine recipes, boosts, event eggs and market demand can change. Confirm the current in-game labels and test the observed hatch or income setup after an update. Community prices are useful signals but require a date, a variant and enough recent trades to distinguish a stable range from one optimistic listing.',
    scenario: 'A one-in-many hatch chance does not mean success is due on the average attempt. A player can miss after that point or succeed immediately. Calculate the probability across the complete batch, decide how many resources can be spent without harming another goal and stop at the planned limit rather than chasing a result because earlier attempts failed.',
  },
  minecraft: {
    context: 'Minecraft calculations are often deterministic, but the correct answer still depends on edition, version, coordinates, dimensions, geometry and the exact mechanic being used. A mathematically accurate conversion can produce a bad build or portal link when the starting block, rounding rule or nearby portal search is misunderstood. Record the environment before applying the number.',
    measurement: 'Use exact coordinates or dimensions from the debug screen and blueprint, then keep the unrounded result beside the build-ready integer. For repeated construction, count one symmetric section and verify it before duplicating the pattern. For experience or enchanting, separate displayed levels from total experience points because the cost per level is not constant.',
    verification: 'Java and Bedrock behavior can differ, and updates may alter commands, world height, portal behavior or item mechanics. Confirm the edition and version, test the result in a safe location or copy of the world and keep the original coordinates. A calculator should make the transformation transparent enough to reproduce by hand.',
    scenario: 'An Overworld coordinate divided by eight may land between Nether blocks. Choosing a rounded block without checking nearby portal locations can connect to an existing portal instead of the intended destination. Preserve the decimal conversion, inspect both sides and move the frame deliberately when the first link does not behave as expected.',
  },
  fortnite: {
    context: 'Fortnite changes through seasons, hotfixes and performance updates, so a useful plan starts with the current mode, platform, input method and season deadline. Battle Royale, Zero Build and creator experiences can reward different habits, while the same PC may produce different frame rates in a quiet test and a crowded endgame. Record the scenario instead of relying on one headline number.',
    measurement: 'For XP, note the current level, target, remaining days and repeatable XP from the activities you actually complete. For performance, capture resolution, rendering mode, preset, frame-rate cap and a representative match sample. For mouse settings, calculate eDPI from DPI and in-game sensitivity, then change only one variable before repeating the same practice route.',
    verification: 'Read current Epic patch notes and the in-game quest screen before using an older XP route or settings recommendation. Re-test after a driver, rendering-mode or major Fortnite update. A calculator estimate should be shown as a range because fights, player-built structures, effects, temperature and background software can all influence observed performance.',
    scenario: 'A player averaging strong FPS in an empty creative island may still experience lows during a stacked match. Lowering a visual setting is useful only if the repeatable match test improves and the image remains readable. Likewise, an XP schedule should use sustainable daily activity rather than assuming every remaining day will deliver an unusually large quest reward.',
  },
  'gta-6': {
    context: 'GTA VI planning currently requires a strict separation between confirmed Rockstar information, observations from official footage, press interpretation and fan estimates. Release date, announced platforms and named Leonida regions can be cited directly, while exact file size, economy balance, map scale and many gameplay formulas remain unknown. A useful pre-launch guide labels that status beside every recommendation.',
    measurement: 'Use scenario ranges for unconfirmed quantities and show how the result changes rather than selecting one rumor as fact. Download planning can compare several possible file sizes and measured connection speeds; map and economy planning can organize categories without inventing exact coordinates or payouts. Replace a scenario only when Rockstar or the released game supplies firmer evidence.',
    verification: 'Recheck Rockstar’s official GTA VI site, Newswire and Support pages before purchase, preload or platform decisions. After launch, verify mechanics through repeatable in-game tests and record the version. Press reports can explain what was visible in a presentation, but edited footage should not be treated as proof that every transition or action is freely controlled.',
    scenario: 'A storage plan based on one rumored file size can fail even when the download-time formula is correct. Comparing a low, expected and high scenario exposes the uncertainty and encourages extra free space. The same method applies to payouts, travel time and wanted-system behavior: plan the range now, then replace assumptions with measured values later.',
  },
};

const focusProfiles: Record<string, GuideFocusProfile> = {
  trading: {
    label: 'trade evaluation',
    decision: 'Evaluate the complete offer in two passes. First check identity, variants, quantities and the arithmetic. Then check demand, reversibility, collection usefulness and the cost of being wrong. Keeping the numeric pass separate from the judgment pass prevents a large total from disguising a poor fit for the player’s actual goal.',
    pitfall: 'The most common mistake is allowing one rare-looking item, an urgent countdown or a claimed future increase to replace verification. Another is mixing values from different lists or dates. Use one dated baseline, disclose uncertainty and read the final confirmation screen slowly. If an item cannot be identified precisely, remove it from the calculation until it can.',
    success: 'A successful trade decision is explainable afterward: both sides are recorded, important variants are visible, the chosen value source is dated and the result matches the collection or resale objective. Winning is not merely getting the larger displayed number; it is accepting a risk you understand for an outcome you actually want.',
  },
  progress: {
    label: 'progress scheduling',
    decision: 'Translate the distant goal into remaining units, then into a daily or per-session target. Use a conservative repeatable rate for the base schedule and treat one-time quests, boosts or unusually efficient sessions as optional acceleration. This produces a plan that survives a missed day without pretending that every session will be perfect.',
    pitfall: 'Players often divide the total by their best-ever session, forget prerequisite time or double-count a bonus that applies only once. The result looks motivating but fails quickly. Measure several normal sessions, include setup and queue time, and keep earned progress separate from expected future rewards.',
    success: 'A useful schedule shows what to do today, how much buffer remains and when to revise the plan. Progress can be checked after every session without changing the method. If the required daily target becomes unrealistic, the page should reveal that early enough to reduce the goal or choose a better activity.',
  },
  performance: {
    label: 'settings and performance testing',
    decision: 'Start with a reproducible test scene and record average performance, meaningful lows, input feel and visual clarity. Change one option at a time, repeat the same route and keep the setting only when the improvement appears more than once. A calculator range is a hypothesis to test, not a benchmark guarantee.',
    pitfall: 'A menu counter, empty training area or single high frame-rate moment can hide the conditions that matter during play. Uncapped frame rate may also feel worse when it creates heat or unstable pacing. Test a representative match, use a sensible cap and check background tasks, temperatures and driver state before blaming one graphics option.',
    success: 'The finished configuration should maintain readable visuals, stable input and acceptable lows in the target mode. Save the baseline so a later patch or driver can be compared with evidence. The best setting is the one that stays consistent on the player’s hardware, not the lowest preset by default.',
  },
  building: {
    label: 'build and blueprint planning',
    decision: 'Define dimensions, orientation, materials and the tolerance for asymmetry before placing the first block or point. Generate the smallest complete unit, verify its center and edges, then repeat it. A blueprint is most useful when each row or allocation can be checked independently rather than copied as one unexplained shape.',
    pitfall: 'Off-by-one errors usually begin with mixing radius and diameter, including a center block inconsistently or mirroring from the wrong edge. Build reference axes first and count completed rows. For character builds, the equivalent mistake is spreading resources before the core threshold is reached.',
    success: 'A successful blueprint can be paused and resumed without guessing. The player knows the total resource requirement, the next verified segment and which assumption controls the final shape or allocation. Small changes can be recalculated without discarding the whole project.',
  },
  value: {
    label: 'value and probability analysis',
    decision: 'Separate known inputs from estimated multipliers or probabilities and display how each contributes to the result. Compare a conservative, expected and optimistic case when the underlying value is community-driven or random. This makes the uncertainty visible without making the calculator less useful.',
    pitfall: 'Expected value is frequently confused with a guaranteed outcome, while stacked multipliers are sometimes added when the game multiplies them or multiplied when the game uses another rule. Preserve the formula, source and date. If the stacking behavior is unknown, show more than one scenario instead of choosing silently.',
    success: 'The result is successful when another player can reproduce the inputs, understand the uncertainty and use the range to make a bounded decision. A correct answer may be to wait, gather more evidence or stop after a planned number of attempts rather than chase the highest theoretical result.',
  },
  survival: {
    label: 'survival resource planning',
    decision: 'Calculate the minimum consumption for the objective, then add a separate emergency reserve. Assign responsibility for gathering, transport and monitoring so the group can see when the plan is drifting. The reserve should have a trigger, such as turning back or dropping a secondary objective, rather than being spent without discussion.',
    pitfall: 'A best-case consumption rate ignores travel delays, mistakes and uneven party participation. Another common error is counting resources that are not yet secured. Keep inventory on hand separate from expected pickups and revise the plan when the observed burn rate exceeds the baseline.',
    success: 'A strong survival plan provides clear checkpoints: supplies remaining, nights or stages left, reserve status and the next safe decision. It reduces argument during pressure because the group agreed in advance which objective is optional and when the run should change course.',
  },
  map: {
    label: 'coordinate and route planning',
    decision: 'Record the source and confidence level of every location before combining points into a route. Group nearby objectives, preserve exact coordinates where known and mark estimates visibly. Route efficiency matters only after the underlying points are trustworthy.',
    pitfall: 'A polished fan map can look authoritative even when a point is estimated from footage or copied without context. Rounding coordinates too early and ignoring vertical access can also create false precision. Keep raw values, region labels and verification status available beside each marker.',
    success: 'The finished route has a clear purpose, few unnecessary crossings and enough context to recover when one point is wrong or inaccessible. Visited state and notes are useful, but they should never turn an unverified marker into a confirmed one.',
  },
  release: {
    label: 'release and launch preparation',
    decision: 'Build the plan from official date, platform and preload information, then use ranges for storage, download time and session expectations. Confirm account region and edition before purchase. Keep launch essentials separate from optional goals so uncertainty about one detail does not block the entire preparation.',
    pitfall: 'Rumored file sizes, retailer copy and edited promotional footage are often repeated as official facts. Another mistake is planning with advertised network speed rather than measured throughput. Cite the authoritative source, record when it was checked and leave headroom for installation files or an update.',
    success: 'A launch plan succeeds when the correct account and platform are ready, storage and network have a buffer and the first session has a realistic goal. It should remain useful if one estimate changes because the confirmed facts and adjustable scenarios are clearly separated.',
  },
  general: {
    label: 'gameplay decision-making',
    decision: 'Write the desired outcome and current state before using a recommendation. Compare at least two realistic options, keep the inputs visible and identify the assumption most likely to change the result. This turns a tip into a repeatable method that can be revised after an update.',
    pitfall: 'The common failure is copying a conclusion without its conditions. A strategy may depend on platform, mode, inventory, level or patch. Recreate the starting conditions, change one variable at a time and avoid treating a single success as proof that the method is always best.',
    success: 'A good result can be explained, tested and updated. The player knows why an option was chosen, what evidence would reverse the choice and which part of the plan should be checked first when the live game behaves differently.',
  },
};

function getFocusKey(title: string, category = '') {
  const text = `${title} ${category}`.toLowerCase();
  if (/trad|value list/.test(text)) return 'trading';
  if (/xp|level|mastery|aging|neon|progress|battle pass/.test(text)) return 'progress';
  if (/fps|sensitivity|setting|performance/.test(text)) return 'performance';
  if (/circle|build|stat|blueprint/.test(text)) return 'building';
  if (/odds|mutation|value|income|hatch/.test(text)) return 'value';
  if (/survival|food|fuel|run|collection/.test(text)) return 'survival';
  if (/map|coordinate|portal|region|travel/.test(text)) return 'map';
  if (/release|launch|preload|extended look|news/.test(text)) return 'release';
  return 'general';
}

export function getGuideDepth(gameSlug: string, title: string, category = '') {
  return {
    game: gameProfiles[gameSlug] ?? gameProfiles.minecraft,
    focus: focusProfiles[getFocusKey(title, category)] ?? focusProfiles.general,
  };
}
