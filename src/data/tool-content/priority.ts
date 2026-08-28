import { defineToolContent } from './types';

export const priorityToolContent = defineToolContent({
  'minecraft/circle-generator': {
    reviewed: '2026-08-28',
    methodSummary: 'Plots block centers against an outer radius and, for outlines, removes the inner radius.',
    intro: [
      'The Minecraft Circle Generator turns a diameter into a square block grid that approximates a circle. It can draw a filled disk or an outline with adjustable thickness, count the selected blocks, and convert every row into contiguous runs that are practical to place in a survival build.',
      'Minecraft has no curved blocks, so a circle is a symmetry problem: the edge has to advance in deliberate horizontal and vertical steps. The preview removes guesswork by showing the complete footprint before you gather materials or mark a build site.',
    ],
    useCases: [
      'Lay out tower foundations, arenas, wells, domes, or circular farms without improvising each quadrant.',
      'Compare an outline against a filled floor before committing blocks in survival mode.',
      'Build from row instructions when copying a large pattern from a phone beside the game.',
    ],
    steps: [
      'Enter an integer diameter from 3 to 101 blocks. The diameter is the full width and height of the generated footprint.',
      'Choose Outline for a ring or Filled for a complete disk. If you choose Outline, set the wall thickness in blocks.',
      'Inspect the grid and total block count, then use the row runs to place each uninterrupted stretch from one side to the other.',
      'Mark the two center axes in game first; mirror completed rows across those axes to catch placement mistakes early.',
    ],
    howItWorks: {
      title: 'How This Minecraft Circle Generator Works',
      body: [
        'Each cell represents the center of one Minecraft block. The generator places the mathematical center at (diameter − 1) ÷ 2 on both axes and gives the outside of the circle a radius of diameter ÷ 2. A cell is selected when the distance from its center to the circle center is no greater than that outside radius.',
        'Filled mode keeps every selected cell. Outline mode also calculates an inner radius equal to the outside radius minus the chosen thickness, then removes cells that fall completely inside that boundary. The result is a discrete pixel circle rather than a smooth vector curve, which is exactly the geometry a block build needs.',
      ],
      points: [
        'Odd diameters have one center row, one center column, and a single center block.',
        'Even diameters center the shape between four blocks, so the middle spans two rows and two columns.',
        'Every row is generated from the same distance test, keeping opposite sides symmetrical.',
      ],
    },
    workedExample: {
      title: 'Worked Example: a 15-block outline',
      body: [
        'Set Diameter to 15, select Outline, and leave Thickness at 1. The mathematical center is block coordinate 7 on the zero-based preview grid, while the outside radius is 7.5 blocks. The generator tests all 225 possible cells, keeps the cells intersecting the outside disk, and removes the cells inside the 6.5-block inner radius.',
        'In game, mark a 15 × 15 bounding square and place a temporary block at the center. Copy the widest middle row first, then work outward one row at a time. Because row 1 matches row 15, row 2 matches row 14, and so on, you only need to verify half of the plan before mirroring it.',
      ],
      points: ['The displayed block count is the exact count of highlighted grid cells.', 'A 2-block outline uses the same outside edge but keeps an additional inner band.', 'Switching to Filled changes the material total because the interior cells are retained.'],
    },
    howToUseResult: {
      title: 'How to Use the Circle Pattern in Minecraft',
      body: [
        'Treat the generated grid as a top-down layer. For a tower, it is the footprint you repeat vertically; for a dome, it is usually the widest base layer, not the complete dome. Start at a cardinal point or on the center row, finish one quadrant, and mirror it. That workflow makes an accidental run of three blocks where the pattern needs two much easier to spot.',
      ],
      points: ['Bring the exact block total plus a small construction buffer.', 'Use contrasting temporary blocks for the center axes and remove them after the outline closes.', 'For very large circles, follow the row-run list rather than judging curvature from ground level.'],
    },
    limitations: {
      title: 'Circle Accuracy and Building Limits',
      body: [
        'There is no single uniquely correct pixel circle for every diameter. This generator uses block-center distance, producing consistent symmetry and a defensible geometric boundary; another guide may use a different rasterization rule and place a few edge blocks differently. The preview is exact for this algorithm, but decorative depth, terrain clearing, doors, buttresses, and vertical shaping are outside its material count.',
      ],
      points: ['Diameters are rounded to whole blocks because partial Minecraft blocks cannot be placed.', 'The maximum 101-block diameter keeps the interactive grid readable and responsive.', 'Outline thickness is constrained by the radius so the inner boundary cannot invert.'],
    },
    referenceData: {
      title: 'Diameter and center reference',
      note: 'Use the center rule to align the pattern with an existing build before placing the edge.',
      headers: ['Diameter', 'Center type', 'Practical center marker'],
      rows: [['15', 'Odd: one central block', 'Row 8 / column 8'], ['16', 'Even: between four blocks', 'Between rows 8–9 and columns 8–9'], ['31', 'Odd: one central block', 'Row 16 / column 16']],
    },
    faqs: [
      { question: 'Why do even and odd Minecraft circles have different centers?', answer: 'An odd diameter has a literal middle block. An even diameter has no single middle cell, so the geometric center sits at the intersection between four blocks. The generator accounts for that half-block offset automatically.' },
      { question: 'Does the circle block count include the inside?', answer: 'Only in Filled mode. Outline mode counts the cells between the outer and inner radii; changing outline thickness changes how many interior bands remain.' },
      { question: 'How should I build a large circle from the row list?', answer: 'Mark the bounding box and center axes, place the widest row, then copy each run outward. Mirror every completed row across the center to preserve symmetry and verify the endpoints before moving on.' },
      { question: 'Can the pattern be used for a Minecraft dome or sphere?', answer: 'It is useful as a horizontal layer, especially the widest layer, but a dome or sphere needs several circles with changing diameters. Use the dedicated dome or sphere planner for the vertical layer estimate.' },
      { question: 'Why might another pixel-circle chart look slightly different?', answer: 'Pixel circles approximate a smooth curve on a square grid. Charts can use block centers, edge intersections, or hand-tuned symmetry rules; those rasterization choices can move a small number of boundary blocks.' },
    ],
  },

  'minecraft/xp-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Converts each level and progress value to total experience, then subtracts the current total from the target total.',
    intro: [
      'The Minecraft XP Calculator finds the experience points required to move from a current level to a higher target level. Unlike a simple levels-times-average estimate, it follows Minecraft’s piecewise XP curve, where later levels cost progressively more points.',
      'The result also converts the remaining XP into rough counts for bottles o’ enchanting, Nether quartz ore, and typical hostile-mob kills. Those conversions are planning estimates; the exact XP requirement between the selected levels is the deterministic part of the tool.',
    ],
    useCases: ['Budget levels before enchanting or anvil work.', 'Estimate how long an XP farm must run to reach a target level.', 'Compare common XP sources without pretending their random yields are fixed.'],
    steps: ['Enter your current level and any XP already earned inside that level.', 'Enter the target level; it must be above the current level.', 'Use the exact XP remainder for progress planning.', 'Treat source counts as rounded-up estimates and choose a buffer for random drops or missed orbs.'],
    howItWorks: {
      title: 'How This Minecraft XP Calculator Works',
      body: [
        'The calculator first converts levels to cumulative XP. Through level 16 it uses L² + 6L. From levels 17 through 31 it uses floor(2.5L² − 40.5L + 360). At level 32 and above it uses floor(4.5L² − 162.5L + 2220). The XP needed is target cumulative XP minus current cumulative XP and minus the progress already earned inside the current level.',
        'Because the cost of a level is not constant, gaining ten levels from 0 to 10 is much cheaper than gaining ten levels from 40 to 50. Converting both endpoints to total XP avoids that common planning error.',
      ],
      points: ['Level 0 starts at 0 cumulative XP.', 'The tool uses integer XP totals at the piecewise boundaries.', 'Source estimates always round up because a partial bottle, ore, or kill cannot finish the target.'],
    },
    workedExample: {
      title: 'Worked Example: level 27 to level 30',
      body: [
        'For level 27, the middle formula gives floor(2.5 × 27² − 40.5 × 27 + 360) = 1,087 cumulative XP. Level 30 requires 1,395 cumulative XP. With no progress inside level 27, the difference is 308 XP. If you already have 40 XP in the level bar, the remaining requirement is 268 XP.',
        'At the tool’s displayed planning averages, 268 XP becomes about 39 bottles at 7 XP each, 77 Nether quartz ore at 3.5 XP each, or 54 typical 5-XP mob kills. Those are comparisons, not guaranteed yields.',
      ],
    },
    howToUseResult: {
      title: 'How to Use the XP Requirement',
      body: ['Use the exact XP figure when deciding whether your current reserve covers an enchantment or repair plan. If you are estimating farm time, divide that requirement by an XP-per-minute rate measured at your own farm rather than assuming every farm or game version performs the same.'],
      points: ['Plan several anvil operations separately because spending levels changes the next cost.', 'Collect slightly beyond the target if XP orbs can be lost, withheld, or absorbed by Mending equipment.', 'Recalculate after spending levels; level numbers are not a bank of equal-size units.'],
    },
    limitations: {
      title: 'XP Formula Accuracy and Source Variance',
      body: ['The cumulative level formulas are deterministic for the level system represented by the calculator. The bottle, quartz, and mob figures are deliberately labeled estimates because XP drops can be random, mob types differ, spawner behavior varies, and Mending items may consume collected orbs. Edition or version changes should be checked against current in-game behavior.'],
      points: ['Current-level progress must be entered as XP points, not as the visual bar percentage.', 'Deaths, Mending repairs, and uncollected orbs are not included.', 'The calculator does not model furnace-bank history or farm spawn rates.'],
    },
    referenceData: {
      title: 'Cumulative Minecraft XP formula',
      note: 'L is the whole level at the start of the level bar.',
      headers: ['Level range', 'Cumulative XP at level L'],
      rows: [['0–16', 'L² + 6L'], ['17–31', 'floor(2.5L² − 40.5L + 360)'], ['32+', 'floor(4.5L² − 162.5L + 2220)']],
    },
    faqs: [
      { question: 'Why does each Minecraft level require more XP than the previous one?', answer: 'Minecraft’s cumulative XP curve becomes steeper at levels 17 and 32. The visible level count is therefore not a linear currency; later level bars contain more experience points.' },
      { question: 'What should I enter for progress inside my current level?', answer: 'Enter the number of XP points already earned since reaching that whole level. Do not enter a percentage unless you have first converted the bar position to points for that level.' },
      { question: 'Are bottle o’ enchanting counts exact?', answer: 'No. The tool divides by a planning average of 7 XP and rounds up, but individual bottles have variable yields and some orbs may not reach the player.' },
      { question: 'Does Mending change the XP needed to reach a level?', answer: 'The level formula does not change, but equipped damaged Mending items can divert collected orbs into repairs. That means you may need to generate more XP than the level-only difference.' },
      { question: 'Why is level 30 to 40 much more expensive than level 0 to 10?', answer: 'The formula is piecewise and quadratic. Above level 32, cumulative XP grows much faster, so equal changes in the displayed level number do not represent equal XP.' },
    ],
  },

  'minecraft/enchant-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Maps the chosen table slot to level and lapis cost, then checks the bookshelf threshold for the target offer.',
    intro: [
      'The Minecraft Enchant Calculator plans the requirements for an enchanting-table attempt: the target displayed level, the bookshelf setup needed to unlock that range, the slot selected, and the lapis and levels consumed when the enchantment is applied.',
      'It is a resource and setup planner, not an enchantment predictor. The table’s offered enchantments remain random and depend on the item, enchantability, seed, edition, and game version.',
    ],
    useCases: ['Check whether an enchanting room has enough effective bookshelves for a level-30 offer.', 'Budget lapis and consumed levels for repeated table attempts.', 'Separate the displayed requirement from the number of levels actually removed.'],
    steps: ['Enter the target offer level shown or desired at the table.', 'Select slot 1, 2, or 3 to match the line you intend to buy.', 'Compare the required bookshelf count with bookshelves that have a clear one-block air gap to the table.', 'Carry the displayed lapis cost and confirm the offered enchantment in game before selecting it.'],
    howItWorks: {
      title: 'How This Minecraft Enchant Calculator Works',
      body: [
        'For a level-30 target, the planner requires the standard maximum of 15 effective bookshelves. For lower target planning, it estimates the shelf requirement as ceil((target level − 8) ÷ 2), clamped between 0 and 15. The selected slot sets both lapis consumed and levels removed: slot 1 costs one, slot 2 costs two, and slot 3 costs three.',
        'A level-30 third-slot offer requires the player to have at least 30 levels available, but accepting it consumes three levels and three lapis—not 30 levels. The larger number is the eligibility threshold used to generate the offer.',
      ],
      points: ['A maximum table setup uses 15 effective bookshelves.', 'The air space between table and shelves must remain unobstructed for shelves to count.', 'The tool does not claim which enchantment will appear in a slot.'],
    },
    workedExample: {
      title: 'Worked Example: buying a level-30 third-slot enchantment',
      body: ['Set Target Level to 30 and Slot to 3. The result calls for 15 effective bookshelves, at least 30 player levels before the click, three lapis lazuli, and a three-level consumption. A player beginning at level 30 normally leaves the table at level 27 after purchasing the offer.'],
      points: ['If only 12 shelves are active, rearrange the room before relying on a level-30 plan.', 'Torches, carpet, or blocks in the gap can prevent a shelf from contributing.', 'The item shown in the table must be the item you actually intend to enchant.'],
    },
    howToUseResult: {
      title: 'How to Use the Enchanting Plan',
      body: ['Build or inspect the bookshelf ring first, then collect the eligibility levels and lapis. When the table shows its three offers, use the calculator result to confirm the resource cost; decide based on the actual previewed enchantment and the value of rerolling, not the target level alone.'],
      points: ['Use a grindstone or a low-cost enchantment only when you understand how rerolling affects the table seed.', 'Keep extra XP if the enchanted item will later be combined on an anvil.', 'Use the anvil calculator for prior-work penalties and book-combination costs.'],
    },
    limitations: {
      title: 'Enchanting Randomness and Edition Limits',
      body: ['The tool documents room and purchase requirements but cannot reveal the hidden enchantment seed or guarantee secondary enchantments. Bookshelf behavior, available enchantments, treasure restrictions, item enchantability, and edition-specific rules remain game mechanics outside this simple planner.'],
      points: ['A qualifying offer may still be undesirable for the selected item.', 'Bookshelves above the effective maximum do not raise the normal table cap.', 'Combining books and repairing items are anvil operations with different cost rules.'],
    },
    referenceData: { title: 'Enchanting-table slot cost', note: 'The required level is eligibility; the consumed level count equals the chosen slot.', headers: ['Slot', 'Lapis consumed', 'Levels consumed'], rows: [['1', '1', '1'], ['2', '2', '2'], ['3', '3', '3']] },
    faqs: [
      { question: 'Does a level-30 enchantment consume 30 Minecraft levels?', answer: 'No. You must have the displayed requirement, but the third slot consumes three levels and three lapis. The calculator keeps eligibility and consumption separate.' },
      { question: 'Why are my 15 bookshelves not producing the expected offer?', answer: 'Every shelf must be in a valid position with the required gap to the table, and the space cannot be obstructed. The offered levels also vary with the item and table roll.' },
      { question: 'Can this tool predict Sharpness, Fortune, or Mending?', answer: 'No. It plans table requirements. Specific offers are affected by the enchantment seed and item rules; Mending is a treasure enchantment and is not a normal table offer.' },
      { question: 'What is the difference between target level and slot number?', answer: 'Target level is the displayed eligibility requirement. Slot number is which of the three offers you select and therefore how many lapis and player levels are consumed.' },
    ],
  },

  'minecraft/anvil-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Adds base work, enchantment cost, rename cost, and the exponential prior-work penalty.',
    intro: [
      'The Minecraft Anvil Calculator estimates the level cost of a proposed repair, rename, or enchantment combination and makes the item’s prior-work penalty visible. Its main purpose is to catch expensive combining orders before levels and books are committed.',
      'Every previous anvil operation can increase the next penalty. The planner uses the Java-style penalty sequence and warns when a survival operation reaches the familiar “Too Expensive” threshold.',
    ],
    useCases: ['Compare book-combination orders before touching the final item.', 'See how repeated repairs make a favorite tool progressively more expensive.', 'Check whether a rename pushes a proposed Java survival operation to 40 levels.'],
    steps: ['Enter the base item work cost shown by the planned operation.', 'Add the enchantment contribution for the compatible books or items being combined.', 'Enter the number of prior anvil operations associated with the item history.', 'Enable rename only when the same operation changes the item name, then review the total and threshold warning.'],
    howItWorks: {
      title: 'How This Minecraft Anvil Calculator Works',
      body: ['The model calculates prior-work penalty as 2^n − 1, where n is the number of earlier anvil operations represented by the input. It then adds base item cost, enchantment cost, the prior-work penalty, and one level when Rename is enabled. A modeled total of 40 or more is flagged as too expensive for a normal Java Edition survival operation.', 'The calculator exposes the penalty rather than trying to infer it from an item name. An accurate result therefore depends on entering the item’s real work history and costs that match the exact pair placed into the anvil.'],
      points: ['Prior works 0, 1, 2, 3, and 4 produce penalties 0, 1, 3, 7, and 15.', 'Combining intermediate books also gives those books their own work history.', 'Enchantment compatibility and maximum levels must be checked separately.'],
    },
    workedExample: {
      title: 'Worked Example: combining onto a twice-worked item',
      body: ['Enter Base Item Cost 8, Enchantment Cost 12, Prior Works 2, and Rename 1. The prior-work penalty is 2² − 1 = 3. The modeled total is 8 + 12 + 3 + 1 = 24 levels, so this scenario remains below the 40-level Java survival threshold.'],
      points: ['At four prior works, the penalty alone becomes 15.', 'At five prior works, the penalty is 31 before adding item and enchantment costs.', 'A cheaper combine order can preserve room for a later repair or enchantment.'],
    },
    howToUseResult: {
      title: 'How to Use the Anvil Cost',
      body: ['Treat the total as a comparison between combining orders. Calculate expensive book merges on paper first, favor balanced book trees that avoid repeatedly working the final item, and reserve the final item operation for the combined book when possible. Confirm the exact in-game preview before clicking because item state and edition rules control the real cost.'],
    },
    limitations: {
      title: 'Anvil Rules the Estimate Does Not Infer',
      body: ['The planner does not inspect an NBT item, enchantment list, durability, material repair amount, or which input occupies the left slot. Those details influence real anvil cost. The 40-level warning describes normal Java survival behavior; Creative mode and Bedrock-specific behavior should not be assumed to match every Java rule.'],
      points: ['Incompatible enchantments are not made compatible by the calculator.', 'Swapping the left and right input can change the actual operation.', 'The user-entered base and enchantment costs must come from the intended combination.'],
    },
    referenceData: { title: 'Prior-work penalty sequence', note: 'Penalty = 2^prior works − 1.', headers: ['Prior works', 'Added penalty'], rows: [['0', '0 levels'], ['1', '1 level'], ['2', '3 levels'], ['3', '7 levels'], ['4', '15 levels'], ['5', '31 levels']] },
    faqs: [
      { question: 'What counts as prior work on a Minecraft item?', answer: 'Anvil repairs and combinations can add to an item’s repair-cost history. The calculator needs the history represented by the item being worked, not merely the number of enchantments visible on it.' },
      { question: 'Why does the anvil penalty double so quickly?', answer: 'The modeled sequence uses 2^n − 1. Each additional prior operation moves the sequence from 1 to 3 to 7 to 15 to 31, which is why combining order matters.' },
      { question: 'What does the 40-level “Too Expensive” warning mean?', answer: 'In normal Java Edition survival, operations at or above that threshold are generally blocked. Creative mode and other edition-specific rules may behave differently.' },
      { question: 'Can this calculator choose the cheapest enchanted-book order?', answer: 'It compares one proposed operation at a time. Use it repeatedly for candidate book trees, and prefer the sequence that keeps prior work low on the final item.' },
    ],
  },

  'minecraft/portal-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Divides Overworld X/Z by eight for Nether targets and multiplies Nether X/Z by eight for Overworld targets.',
    intro: [
      'The Minecraft Portal Calculator converts horizontal coordinates between the Overworld and Nether using the 8:1 travel scale. It returns the precise mathematical target and a whole-block target that is easier to build at.',
      'The conversion solves the coordinate arithmetic; it does not guarantee that a new portal will link to the intended frame. Portal search radius, nearby active portals, border conditions, and safe terrain still matter.',
    ],
    useCases: ['Choose a Nether hub position for an Overworld base.', 'Estimate the Overworld exit corresponding to a Nether tunnel endpoint.', 'Check whether two proposed portals are likely to compete because their converted targets are close.'],
    steps: ['Choose whether the entered X and Z come from the Overworld or Nether.', 'Enter horizontal coordinates; Y is not scaled by eight and is intentionally omitted from the conversion.', 'Copy the precise result for comparison and the rounded result for a practical build coordinate.', 'Scout the destination safely and check existing portals before lighting a new frame.'],
    howItWorks: {
      title: 'How This Minecraft Portal Calculator Works',
      body: ['When traveling from the Overworld to the Nether, the tool calculates Nether X = Overworld X ÷ 8 and Nether Z = Overworld Z ÷ 8. In the opposite direction it calculates Overworld X = Nether X × 8 and Overworld Z = Nether Z × 8. The Y coordinate is not part of the horizontal scale conversion.', 'The precise result preserves fractions so portal alignment can be compared accurately. The rounded result maps that point to an integer block coordinate; negative coordinates are rounded numerically, so verify the sign before building.'],
      points: ['Only X and Z use the 8:1 dimension scale.', 'One Nether block corresponds to eight Overworld blocks horizontally.', 'The conversion target is an ideal location, not a portal-link guarantee.'],
    },
    workedExample: {
      title: 'Worked Example: Overworld base at X 800, Z −400',
      body: ['Choose Overworld to Nether and enter X 800, Z −400. Dividing both horizontal coordinates by eight gives a precise Nether target of X 100, Z −50. Building near that target provides the correct scaled alignment for the Overworld base, subject to safe placement and existing portal links.'],
      points: ['The negative Z remains negative after division.', 'Returning from X 100, Z −50 multiplies back to X 800, Z −400.', 'Choose a suitable Y level for terrain and tunnel design; the calculator does not scale it.'],
    },
    howToUseResult: {
      title: 'How to Use the Converted Portal Coordinates',
      body: ['Travel to the converted X/Z in the destination dimension, choose a safe Y level, and search for nearby portals before constructing. If several bases use the same hub, compare their precise converted targets and give each frame enough separation to avoid unintended linking. Record both endpoints after testing the round trip.'],
    },
    limitations: {
      title: 'Portal Linking and Rounding Limits',
      body: ['Coordinate scaling is exact, but actual portal creation and linking depend on Minecraft’s destination search and valid-frame placement. Terrain can force a generated exit away from the ideal coordinate. Existing portals may capture the connection, and edition or version details can affect practical linking behavior.'],
      points: ['The calculator does not search the world for nearby frames.', 'It cannot assess lava, bedrock, caves, borders, or build permissions.', 'Rounding a fractional target can shift the Overworld equivalent by several blocks.'],
    },
    referenceData: { title: 'Dimension conversion rules', note: 'Apply the scale to X and Z only.', headers: ['Direction', 'X/Z operation', 'Example'], rows: [['Overworld → Nether', 'Divide by 8', '800 → 100'], ['Nether → Overworld', 'Multiply by 8', '100 → 800'], ['Either direction', 'Do not scale Y', 'Y 64 remains a placement choice']] },
    faqs: [
      { question: 'Do I divide the Minecraft Y coordinate by eight?', answer: 'No. The 8:1 scale applies to horizontal X and Z coordinates. Choose Y based on safe terrain, tunnel height, and the portal location you can actually build.' },
      { question: 'Why did my portal appear away from the calculated target?', answer: 'The game must find or create a valid destination. Terrain, borders, and nearby portals can move or capture the link even when the coordinate conversion is correct.' },
      { question: 'How are negative Nether coordinates converted?', answer: 'The sign is preserved: a negative Overworld coordinate divided by eight remains negative, and a negative Nether coordinate multiplied by eight remains negative.' },
      { question: 'Should I use the precise or rounded coordinate?', answer: 'Use the precise value when comparing alignments and the rounded whole-block coordinate as a practical construction target. Then test both directions in game.' },
    ],
  },

  'blox-fruits/trade-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Compares both offers using the complete 41-fruit dealer Beli table, with permanent Robux prices kept as separate context.',
    intro: [
      'The Blox Fruits Trade Calculator compares every fruit on your side with every fruit offered by the other player using the game’s 41 developer-set Dealer prices in Beli. It measures the numerical gap so a multi-fruit offer is easier to inspect.',
      'Dealer price is an official shop baseline used by game trade restrictions, but it is not a community fair-value quote. The tool therefore does not invent demand scores or claim that equal Beli totals have equal player demand.',
    ],
    useCases: ['Check whether adds close the value gap in a multi-fruit offer.', 'Compare a high-value low-demand bundle with a smaller but easier-to-trade fruit.', 'Write down both sides before accepting so quantity or fruit variants are not overlooked.'],
    steps: ['Add each physical fruit on your side and set the correct quantity.', 'Add every fruit offered by the other trader.', 'Review both Dealer-price totals and the percentage gap.', 'Then evaluate community demand and retradeability separately before accepting.'],
    howItWorks: {
      title: 'How This Blox Fruits Trade Calculator Works',
      body: ['For each side, the calculator multiplies each fruit’s developer-set Dealer Beli price by quantity and sums the rows. Difference equals their total minus your total. Percentage difference uses your total as the comparison base.', 'The displayed band compares shop-price baselines only. It cannot decide community fair value, because player demand, reworks, availability, storage limits, and permanent-versus-physical context are not fixed Beli multipliers.'],
      points: ['A positive gap means their Dealer-price total is higher.', 'A negative gap means your Dealer-price total is higher.', 'Neither direction guarantees a player-market win or loss.'],
    },
    workedExample: {
      title: 'Worked Example: comparing a main fruit and adds',
      body: ['Using the reviewed Dealer table, Dragon is 15,000,000 Beli. A side containing Kitsune at 8,000,000, Tiger at 5,000,000, and Quake at 1,000,000 totals 14,000,000 Beli. Relative to Dragon, the gap is −1,000,000 or −6.67%, which falls inside the calculator’s visible ±7% baseline band.', 'That does not make the player trade fair: community demand, reworks, storage space, and upgrade preference can outweigh a one-million-Beli shop-price difference.'],
    },
    howToUseResult: {
      title: 'How to Use the Blox Fruits Trade Verdict',
      body: ['Use the gap to decide whether an add is needed and use demand to judge how liquid each side is. For upgrades, players may accept a value premium for a more desirable fruit; for downgrades into several fruits, inventory space and retrading effort can justify asking for overpay. Always confirm the final trade-window contents before accepting.'],
      points: ['Edit or verify a reference before relying on it after a game update.', 'Compare the result again if a fruit is added, removed, or swapped.', 'Do not treat the Fair label as protection from scams or last-second trade changes.'],
    },
    limitations: {
      title: 'Dealer Price and Player-Market Limits',
      body: ['The table uses developer-set Dealer prices, which are stable shop and trade-cap baselines—not player-to-player exchange rates. Permanent products, physical fruits, stored fruits, reworks, availability, and community demand can make actual offers differ sharply from the Beli comparison.'],
      points: ['Dealer Beli prices are documented game prices.', 'No demand rating is invented.', 'The tool does not verify ownership, legitimacy, or final confirmation.'],
    },
    referenceData: { title: 'Trade result reading guide', note: 'The verdict describes only the values currently entered.', headers: ['Signal', 'Meaning', 'What to check next'], rows: [['Positive gap', 'Their total is higher', 'Demand and retrade effort'], ['Within ±7%', 'Numerically close', 'Fruit preference and liquidity'], ['Negative gap', 'Your total is higher', 'Ask for adds or reconsider']] },
    faqs: [
      { question: 'What does W, Fair, or L mean in a Blox Fruits trade?', answer: 'It summarizes the numerical gap under the references entered: a win favors your side, fair is within the visible tolerance, and a loss means your offered total is higher. Demand can still change the practical decision.' },
      { question: 'Why does Blox Fruits demand matter if the values are equal?', answer: 'Demand reflects how actively players seek a fruit and how easily it may be retraded. An equal-value low-demand bundle can be less useful than one liquid fruit.' },
      { question: 'Are these Blox Fruits values official?', answer: 'The Beli and permanent Robux fields are developer-set Dealer prices. They are official shop baselines, but they are not an official player-to-player fair-value table.' },
      { question: 'How should I handle several small adds?', answer: 'Enter every add with its quantity, then inspect both the combined value and demand. Small items can close an arithmetic gap without matching the retradeability of the main fruit.' },
      { question: 'Why is percentage difference based on my offer?', answer: 'Using your total as the base answers how large the gap is relative to what you are giving. That makes the same absolute gap appropriately more important in a smaller trade.' },
    ],
  },

  'blox-fruits/value-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Totals quantities from the complete 41-fruit Dealer table in Beli and separately totals permanent Robux prices.',
    intro: ['The Blox Fruits Value Calculator builds a one-sided fruit list and totals the selected developer-set Dealer prices. It can check a Beli shop-price baseline, show which fruit dominates that baseline, and total the separate permanent Robux prices.', 'The tool deliberately does not label Dealer price as community trade value. Beli price is useful for game trade-cap context, while player demand and retradeability require a current community-market source.'],
    useCases: ['Total several stored fruits before opening a trade discussion.', 'See how quantity changes the weight of one fruit in a bundle.', 'Compare the bundle’s value with its average demand before using the trade calculator.'],
    steps: ['Select a fruit from the local reference list.', 'Set the quantity actually included in the bundle.', 'Add the remaining fruits and inspect each row’s contribution.', 'Verify references after reworks or market shifts, then move to the two-sided trade tool when another offer exists.'],
    howItWorks: { title: 'How This Blox Fruits Value Calculator Works', body: ['Each row contributes Dealer Beli price × quantity and permanent Robux price × quantity. The calculator adds those metrics independently; Robux is never converted into Beli and neither total receives a hidden demand premium.', 'The 41-row table was reviewed against a Blox Fruits reference synced from the game wiki on August 27, 2026. It covers Common through Mythical fruits and Natural, Elemental, and Beast types.'], points: ['Quantity multiplies both documented shop metrics.', 'Beli and Robux remain separate units.', 'Use the trade comparison only as a shop-baseline check, not a market verdict.'] },
    workedExample: { title: 'Worked Example: totaling documented Dealer prices', body: ['Dragon at 15,000,000 Beli, Kitsune at 8,000,000, and Buddha at 1,200,000 produce a 24,200,000-Beli dealer-price total. Their permanent versions separately total 5,000 + 4,000 + 1,650 = 10,650 Robux.'], points: ['The calculator never converts Robux into Beli.', 'Removing Buddha lowers only the documented totals for that row.', 'Neither total predicts a player-market offer.'] },
    howToUseResult: { title: 'How to Use a Fruit Bundle Total', body: ['Use the total as a baseline for offer construction. Identify the largest contributor, check whether the bundle is an upgrade or downgrade, and decide whether several lower-demand fruits create extra retrading work. When negotiating, rebuild both sides in the trade calculator instead of comparing a remembered headline number.'], points: ['Save high-demand fruits for offers where liquidity matters.', 'Recheck quantities before sending a screenshot or trade proposal.', 'Treat value and demand as complementary, not interchangeable, signals.'] },
    limitations: { title: 'Blox Fruits Dealer-Price Limitations', body: ['Developer-set Dealer prices can change after a rework, and permanent versus physical fruits have different ownership and trading context. The calculator does not estimate player demand, overpay for upgrades, current stock, or a live community exchange rate.'], points: ['The table covers all 41 fruits in the reviewed source.', 'Player-market value is intentionally not inferred.', 'A total cannot detect scams, trade-window swaps, or account risk.'] },
    referenceData: { title: 'Bundle arithmetic', note: 'All values in this example are illustrative, not live named-fruit quotes.', headers: ['Row', 'Calculation', 'Contribution'], rows: [['Fruit A ×2', '1,200,000 × 2', '2,400,000'], ['Fruit B ×1', '3,500,000 × 1', '3,500,000'], ['Bundle', '2,400,000 + 3,500,000', '5,900,000']] },
    faqs: [
      { question: 'Is bundle value the same as Blox Fruits demand?', answer: 'No. Value is a numerical community reference; demand describes trading interest and potential liquidity. The calculator shows both so one does not silently stand in for the other.' },
      { question: 'Does adding duplicate fruits multiply the value?', answer: 'Yes. Each row contribution is the selected reference multiplied by quantity, provided the items can actually be held and traded under current game rules.' },
      { question: 'When should I use the trade calculator instead?', answer: 'Use it as soon as you have a specific counter-offer. The value calculator totals one bundle, while the trade calculator compares both sides and measures the gap.' },
      { question: 'Can I treat the total as an official Blox Fruits trade value?', answer: 'No. It is a total of official Dealer shop prices. Player-market trade value can differ because demand and availability are not derived from the Dealer table.' },
    ],
  },

  'grow-a-garden/value-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Scales base value by squared weight ratio, then applies growth, mutation, and quantity multipliers.',
    intro: ['The Grow a Garden Value Calculator estimates a crop’s total sell value from its base reference, normal weight, actual weight, growth state, mutations, and quantity. It is built for the mechanic where weight has a nonlinear effect, so doubling a crop’s weight does not merely double the estimate.', 'The result separates the weight ratio from the growth and mutation multipliers. That breakdown helps players see whether an unusually large crop or a rare multiplier is driving the value instead of treating the final number as unexplained.'],
    useCases: ['Estimate a mutated crop before selling or comparing it with another harvest.', 'Test how much extra weight changes value when all multipliers stay fixed.', 'Check whether several identical crops should be entered as quantity or calculated separately.'],
    steps: ['Choose or enter the crop’s base value and its normal reference weight.', 'Enter the actual displayed weight for the crop being evaluated.', 'Select the applicable growth and mutation multipliers once each.', 'Set quantity only for crops with the same base, weight, and multiplier state; calculate different specimens separately.'],
    howItWorks: { title: 'How This Grow a Garden Value Calculator Works', body: ['The unit estimate is base value × (actual weight ÷ base weight)² × growth multiplier × mutation multiplier. The total then multiplies that unit estimate by whole-number quantity. Squaring the weight ratio means a crop at 1.5 times its base weight contributes 2.25 times the weight-based value before mutations.', 'The formula treats the selected multipliers as independent factors. A mutation or growth effect should be entered only if it applies to the exact crop; stacking the same effect twice will overstate the estimate.'], points: ['Weight ratio is squared, not added.', 'Growth and mutation choices multiply the weight-adjusted base.', 'Quantity should group only genuinely matching crop states.'] },
    workedExample: { title: 'Worked Example: an oversized mutated crop', body: ['Take an illustrative crop with base value 5,000 and base weight 2 kg. If the actual crop weighs 3 kg, the weight ratio is 3 ÷ 2 = 1.5 and the squared factor is 2.25. With a 2× growth multiplier and a 5× mutation multiplier, the estimated unit value is 5,000 × 2.25 × 2 × 5 = 112,500. A quantity of two matching crops totals 225,000.', 'The example uses round planning inputs to show the implemented formula; it is not a claim about a named crop’s current base value or mutation table.'] },
    howToUseResult: { title: 'How to Use the Crop Value Estimate', body: ['Use the unit result to compare individual crops and the total to plan a batch sale. If two crops have different displayed weights, calculate them separately—even if they share the same name and mutation—because the squared weight ratio can create a large difference. Record the inputs with the result so another player can reproduce the estimate.'], points: ['Compare unit value when deciding which specimen is exceptional.', 'Use total value only after grouping identical weight and multiplier inputs.', 'Check current in-game sell behavior after an update changes crop or mutation mechanics.'] },
    limitations: { title: 'Crop Formula and Data Limits', body: ['The calculator follows the displayed weight-scaling model and the multipliers entered by the user. Base references and mutation effects can change after game updates; event modifiers or special cases may not behave as independent multipliers. Rounding in the game can also make the final displayed sale value differ slightly from a browser-side estimate.'], points: ['The local crop reference is a planning dataset and should not be treated as an official price sheet.', 'Unknown caps, special variants, or server-side rounding are not inferred.', 'Trade demand is separate from the crop’s modeled sell value.'] },
    referenceData: { title: 'Weight scaling examples', note: 'These rows isolate the squared weight factor before growth or mutation effects.', headers: ['Actual ÷ base weight', 'Squared factor', 'Effect on base'], rows: [['0.5×', '0.25', '25% of base'], ['1.0×', '1.00', '100% of base'], ['1.5×', '2.25', '225% of base'], ['2.0×', '4.00', '400% of base']] },
    faqs: [
      { question: 'Why does Grow a Garden weight use a squared multiplier?', answer: 'The implemented value model uses (actual weight ÷ base weight)². That makes large specimens scale faster than a simple linear weight calculation.' },
      { question: 'Can I total crops with different weights using quantity?', answer: 'Not accurately. Quantity repeats one identical unit calculation. Enter crops with different displayed weights or mutations as separate calculations.' },
      { question: 'Do growth and mutation multipliers add together?', answer: 'No. The tool multiplies them after applying the squared weight ratio. Enter each applicable effect once and avoid double-counting a combined state.' },
      { question: 'Is the result a guaranteed player trade value?', answer: 'No. It estimates crop sell value under the entered formula. Player demand, rarity, event timing, and negotiation can produce a different trade outcome.' },
      { question: 'Why can the in-game sale differ by a small amount?', answer: 'The game may round at a different step or apply a special-case modifier. Confirm base data and active effects when a discrepancy appears.' },
    ],
  },

  'grow-a-garden/trade-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Compares two crop bundles using reviewed base Sheckle values while keeping mutations and player demand outside the baseline.',
    intro: ['The Grow a Garden Trade Calculator organizes two crop bundles and compares the selected base Sheckle values from a 54-row crop table. It is useful when the number of entries makes mental addition unreliable.', 'Base Sheckles are not a complete trade valuation: actual weight, growth mutations, environmental mutations, scarcity, and player demand can dominate a real offer. Use the crop calculator first when those mechanics matter.'],
    useCases: ['Check the base-value composition of two crop bundles.', 'Measure how much one crop changes the baseline gap.', 'Identify which named crop contributes most before calculating weight and mutations separately.'],
    steps: ['Add every crop and quantity on your side.', 'Build the other crop bundle without omitting adds.', 'Read the base-value gap and percentage.', 'Recalculate individual weighted or mutated crops in the crop value calculator before treating the comparison as a decision.'],
    howItWorks: { title: 'How This Grow a Garden Trade Calculator Works', body: ['Each side totals crop base value × quantity. The calculator subtracts your total from their total and divides the gap by your total for the percentage comparison. Its visible band covers differences within ±7% of the entered baseline.', 'The dataset also stores each crop’s base weight, but this bundle view does not apply squared weight scaling or mutation multipliers. That separation prevents the tool from pretending two same-name crops always have the same final sell value.'], points: ['Positive gap: their base-value total is higher.', 'Negative gap: your base-value total is higher.', 'The visible label is a baseline comparison, not an official WFL ruling.'] },
    workedExample: { title: 'Worked Example: equal base values, different crops', body: ['One Bone Blossom has a reviewed base value of 180,500 Sheckles. Two Candy Blossoms at 90,250 each also total 180,500, so the baseline gap is zero.', 'The real specimens can still differ sharply: each crop’s displayed weight is squared relative to its base weight, and active mutations multiply the result. Equal base rows therefore do not prove equal sell value or trade demand.'] },
    howToUseResult: { title: 'How to Use the Garden Trade Comparison', body: ['Use the difference to negotiate an add, remove an overpay, or compare two counteroffers. Then inspect which item contributes most of each total and whether its demand is stable. Rebuild the calculator if a mutation, quantity, or last-second item changes in the trade window.'], points: ['Screenshot or note the final row list, not only the verdict.', 'Avoid combining unlike mutated crops under one quantity.', 'Confirm event availability and current player interest for scarce items.'] },
    limitations: { title: 'Grow a Garden Base-Value Limits', body: ['The 54-row crop table is a reviewed community reference and may change after updates. Mutations, actual crop weight, pets, limited supply, and player demand are not converted into invented premiums.'], points: ['Base values and base weights require periodic review.', 'No demand score is asserted.', 'Use the crop value calculator when actual weight or mutations matter.'] },
    referenceData: { title: 'Interpreting the numerical verdict', note: 'Always pair the gap with item-specific demand and availability.', headers: ['Calculated gap', 'Label meaning', 'Trade question'], rows: [['Above +7%', 'Their entered side is higher', 'Is the value liquid and correctly entered?'], ['−7% to +7%', 'Numerically close', 'Which side has better demand?'], ['Below −7%', 'Your entered side is higher', 'What add would close the gap?']] },
    faqs: [
      { question: 'Does a Fair result guarantee a fair Grow a Garden trade?', answer: 'No. It means the entered reference totals fall within the calculator’s ±7% band. Demand, mutations, scarcity, trust, and personal goals still affect the trade.' },
      { question: 'How should a mutated crop be entered in a trade?', answer: 'Use a reference or multiplier that represents that exact mutation and weight context. Do not group different crop states under one quantity unless their inputs genuinely match.' },
      { question: 'Why can a lower-value garden item be more desirable?', answer: 'Trade value and demand are different. A sought-after event item may move quickly or complete a collection even when its numerical reference is lower.' },
      { question: 'Are Grow a Garden trade references official?', answer: 'No. They are editable community planning values. Check active trading behavior and update context before a high-stakes exchange.' },
    ],
  },

  'steal-a-brainrot/value-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Totals each Brainrot’s selected value and income after quantity and mutation effects.',
    intro: ['The Steal a Brainrot Value Calculator totals acquisition cost and base cash generation by Brainrot, quantity, and mutation scenario. It separates money spent from income rate so an expensive unit does not automatically look like the best cash-per-second option.', 'The 45 built-in rows record game-displayed acquisition cost and base income reviewed on August 28, 2026. They do not claim to be player-to-player trade values, and the interface labels mutation choices as scenario multipliers.'],
    useCases: ['Find which Brainrot contributes most to total collection value.', 'Compare total value with income per second before replacing a unit.', 'Estimate the effect of applying the same verified mutation to matching units.'],
    steps: ['Select the exact Brainrot row.', 'Set the number of matching units and the mutation scenario that applies.', 'Add different units or mutation states on separate rows.', 'Compare total acquisition cost with base income instead of treating either one as a trade quote.'],
    howItWorks: { title: 'How This Steal a Brainrot Value Calculator Works', body: ['For every row, the tool applies the selected scenario multiplier to the Brainrot’s documented acquisition cost and base income, multiplies by quantity, and adds the contributions. The cost total answers how much the selected base units cost; the income total answers their modeled per-second production.', 'Because cost and income answer different questions, the tool does not collapse them into one opaque score. Divide cost by income separately when evaluating payback time, and confirm whether the chosen mutation truly affects both fields in the live game.'], points: ['Quantity repeats only the same unit and scenario.', 'Mutation is a user-selected scenario multiplier.', 'Acquisition cost and income remain separate outputs.'] },
    workedExample: { title: 'Worked Example: two matching Brainrot units', body: ['Tralalero Tralala has a reviewed acquisition cost of 10,000,000 and base income of 50,000 per second. Quantity two at the base 1× state contributes 20,000,000 total cost and 100,000 base cash per second. If one unit has a different mutation, put it on a separate row and choose only a multiplier verified for that state.'], points: ['At 100,000 per second, one uninterrupted minute is 6,000,000.', 'Cost is not player trade value.', 'Use separate rows whenever multiplier states differ.'] },
    howToUseResult: { title: 'How to Use Collection Value and Income', body: ['Use income per second when judging production upgrades and payback time. Use the collection reference when comparing holdings or preparing a trade. If selling one unit reduces income, calculate how long a replacement would take to recover the lost production before deciding from trade value alone.'], points: ['Sort decisions by the metric tied to your goal.', 'Keep event and mutation labels with any recorded result.', 'Re-enter values after balance changes instead of relying on an old screenshot.'] },
    limitations: { title: 'Brainrot Dataset and Mutation Limits', body: ['The cost and income fields are game-displayed reference data, while availability and mutation behavior may change in updates. The calculator assumes the chosen scenario multiplier applies directly and continuously; collection slots, offline behavior, temporary events, server boosts, and special rules can produce different earnings.'], points: ['The 45-row catalog is representative, not all 534 upstream entries.', 'No player-to-player trade value is asserted.', 'The income estimate excludes downtime and collection caps unless already reflected in the base rate.'] },
    referenceData: { title: 'Keep Brainrot metrics separate', note: 'Choose the output that matches the decision being made.', headers: ['Metric', 'Best used for', 'Does not prove'], rows: [['Acquisition cost', 'Money spent on base units', 'Player trade offer'], ['Income per second', 'Production and payback planning', 'Continuous unattended earnings'], ['Mutation scenario', 'Testing a verified multiplier', 'Universal mutation behavior']] },
    faqs: [
      { question: 'What is the difference between Brainrot cost and income?', answer: 'Cost is the game-displayed amount to acquire the base unit. Income is its base currency production rate. A unit can rank highly in one metric and less strongly in the other.' },
      { question: 'How do mutations affect a collection row?', answer: 'The selected mutation multiplier is applied to the row’s reference value and income before quantity is totaled. Use separate rows for units with different mutations.' },
      { question: 'Are these Brainrot trade values?', answer: 'No. The rows record game-displayed acquisition cost and base income from a dated reference. They do not estimate player-to-player trade value.' },
      { question: 'Why might real session income be lower than the calculator?', answer: 'The arithmetic assumes the entered per-second rate continues. Downtime, caps, missed collection, server changes, or temporary boosts can make an observed session different.' },
    ],
  },

  'adopt-me/wfl-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Compares both pet offers, calculates the relative gap, and assigns W/F/L inside a visible ±8% band.',
    intro: ['The Adopt Me WFL Calculator compares your complete pet offer with the other player’s offer and turns the entered community references into a Win, Fair, or Lose range. It includes regular, neon, mega neon, fly, and ride context so variants are not silently treated as identical.', 'WFL is a shorthand for the numerical comparison, not a promise about future value. Adopt Me trading also depends on demand, age, availability, exotic status, personal preference, and whether an item is easy to retrade.'],
    useCases: ['Check a multi-pet offer before pressing Accept.', 'See whether fly, ride, neon, or mega status is represented consistently.', 'Measure the exact add needed to move an apparent lose into the fair band.'],
    steps: ['Add every pet on your side with its correct form and potion traits.', 'Enter the other side exactly as it appears in the final trade window.', 'Review both total difference and percentage; the page uses an ±8% numerical fair range.', 'Consider demand and age, then recheck for last-second changes before confirming.'],
    howItWorks: { title: 'How This Adopt Me WFL Calculator Works', body: ['The tool totals the selected community reference for each pet and variant on both sides. Difference equals their total minus your total, and percentage difference is measured relative to your offer. Results within ±8% are labeled Fair; a larger positive gap is a Win under the entered values, while a larger negative gap is a Lose.', 'Variant context matters because a neon or mega neon represents both multiple matching pets and aging work. Fly and ride traits can add utility, but their community premium is not fixed across every pet.'], points: ['Win means their entered reference total is higher by more than the fair tolerance.', 'Fair means the arithmetic is close, not that demand is equal.', 'Lose means your entered reference total is higher by more than the tolerance.'] },
    workedExample: { title: 'Worked Example: an 80-to-84 pet offer', body: ['If your entered pets total 80 reference units and the other side totals 84, the difference is +4. Relative to your offer, 4 ÷ 80 = 5%, which lies inside the calculator’s ±8% Fair band. If the 84-point side is made of low-demand adds while your 80-point pet is highly sought after, the practical trade may still favor keeping your pet.', 'If the other side removes a 10-point add, its total becomes 74. The new gap is −6, or −7.5% of your offer, still just inside the numeric fair band; any further removal would cross the modeled boundary.'] },
    howToUseResult: { title: 'How to Use an Adopt Me WFL Result', body: ['Use the percentage to size the gap, then inspect the actual pets responsible. Upgrading several pets into one desirable pet may justify controlled overpay; downgrading a popular pet into many adds may require compensation for retrading work. A value bar is most useful when paired with current demand and the final trade-window contents.'], points: ['Check form, fly/ride traits, and age on every pet.', 'Treat recent event pets cautiously while supply is changing.', 'Decline any trade that relies on trust, cross-trading, or a last-second switch.'] },
    limitations: { title: 'Adopt Me WFL Accuracy Limits', body: ['Adopt Me does not publish official player-trade prices. The calculator uses community references and normalized variant handling that can differ from what a specific pet commands. Demand, exotic collecting, age, potion preferences, event timing, and market momentum are not fully captured by one WFL label.'], points: ['The ±8% range is an editorial planning rule, not a game mechanic.', 'Fly and ride premiums vary by pet and trader.', 'The tool cannot authenticate a pet or protect against trade scams.'] },
    referenceData: { title: 'WFL band used by this tool', note: 'Percentage is calculated against your entered offer.', headers: ['Relative gap', 'Displayed result', 'Interpretation'], rows: [['Above +8%', 'Win', 'Their reference total is higher'], ['−8% through +8%', 'Fair', 'Totals are numerically close'], ['Below −8%', 'Lose', 'Your reference total is higher']] },
    faqs: [
      { question: 'What does Fair mean in this Adopt Me calculator?', answer: 'It means the entered totals are within ±8% of your offer. It does not guarantee equal demand, future value, or personal usefulness.' },
      { question: 'Should neon and mega neon pets use the same multiplier?', answer: 'No. They represent different numbers of base pets and aging work. Select the actual form on each row; do not enter a mega as if it were one regular pet.' },
      { question: 'Do fly and ride potions add the same value to every pet?', answer: 'Not necessarily. Their practical premium varies with the pet, form, demand, and trader preference. The calculator provides normalized planning context rather than an official universal premium.' },
      { question: 'Can a numerical Lose still be a trade I want?', answer: 'Yes, if you knowingly value the target pet’s demand, rarity, or collection role more than the reference gap. The WFL result should make that trade-off visible, not make the decision for you.' },
      { question: 'How can I avoid a last-second Adopt Me trade switch?', answer: 'Re-read every pet, form, trait, and quantity in the final confirmation stage. Recalculate if anything changes, and never rely on promised items outside the protected trade window.' },
    ],
  },

  'adopt-me/value-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Applies normalized form and fly/ride multipliers to each community pet reference, then totals the collection.',
    intro: ['The Adopt Me Value Calculator totals a pet list while keeping regular, neon, mega neon, fly, and ride attributes attached to each row. It is useful for understanding a collection segment or preparing one side of a trade without reducing all versions of a pet to the same entry.', 'The calculation uses transparent normalized planning multipliers. Those factors organize comparisons; they are not official Adopt Me exchange rates and should not override current pet-specific community demand.'],
    useCases: ['Estimate which pet contributes most to an entered collection.', 'Compare regular, neon, and mega variants under one consistent model.', 'Prepare a one-sided total before entering the same pets in a trade comparison.'],
    steps: ['Choose the exact pet from the local community reference.', 'Select Regular, Neon, or Mega Neon to match the pet in game.', 'Enable Fly and Ride only when those traits are present.', 'Add different pets or forms on separate rows and inspect the item-by-item contribution.'],
    howItWorks: { title: 'How This Adopt Me Value Calculator Works', body: ['Each pet begins with an editable community reference. The current normalized form multipliers are 1× for regular, 3.6× for neon, and 12.5× for mega neon. Fly applies 1.08× and Ride applies 1.06× when selected, after which row quantities are totaled.', 'These multipliers are intentionally visible planning assumptions. A real neon represents four aged pets, and a mega represents sixteen, but the trading premium does not have to equal the raw pet count because aging effort, demand, and collector preference vary.'], points: ['Regular, neon, and mega are mutually exclusive forms.', 'Fly and Ride can be applied together when the pet has both traits.', 'The final total is a normalized reference, not a guaranteed offer.'] },
    workedExample: { title: 'Worked Example: a fly-ride neon reference', body: ['Start with an illustrative pet reference of 10 units. Neon makes it 10 × 3.6 = 36. Fly and Ride then produce 36 × 1.08 × 1.06 = 41.2128, which the interface can round for display. Two identical fly-ride neons would contribute about 82.43 normalized units.', 'This example explains the active model. It does not claim that every fly-ride neon pet receives the same market premium.'] },
    howToUseResult: { title: 'How to Use an Adopt Me Pet Total', body: ['Use the row breakdown to locate concentrated value and to check that forms were not entered as regular by mistake. For trading, copy the exact pets into a two-sided calculator and consider demand. For neon projects, compare the completed form with the opportunity cost and aging work of the four base pets.'], points: ['Do not combine different ages or traits under one row if those details matter to the trade.', 'Check limited availability and recent event supply.', 'Use WFL only after the counter-offer is known.'] },
    limitations: { title: 'Pet Reference and Variant Limits', body: ['Adopt Me values are community estimates that can move rapidly. The normalized multipliers simplify form and potion handling but do not model every pet-specific premium, exotic market, age preference, or collector trend. The dataset is not an official publisher valuation and needs continued expansion.'], points: ['A pet can trade above or below its normalized calculated contribution.', 'Age and task progress are not priced by this tool.', 'No account or pet ownership is verified.'] },
    referenceData: { title: 'Normalized variant factors', note: 'These are transparent site planning assumptions, not official Adopt Me rates.', headers: ['Attribute', 'Factor', 'Applied to'], rows: [['Regular', '1.00×', 'Base community reference'], ['Neon', '3.60×', 'Selected pet row'], ['Mega Neon', '12.50×', 'Selected pet row'], ['Fly', '1.08×', 'Current form value'], ['Ride', '1.06×', 'Current form value']] },
    faqs: [
      { question: 'Why is the neon multiplier less than four in the model?', answer: 'The calculator uses a normalized community planning factor rather than equating a neon automatically with four times every base pet. Real premiums vary with pet demand and aging effort.' },
      { question: 'Can Fly and Ride both be selected for one pet?', answer: 'Yes, when the actual pet is fly-ride. The factors are applied to the selected regular, neon, or mega form.' },
      { question: 'Does pet age change the calculated value?', answer: 'Not in this normalized total. Age can matter to neon makers and individual traders, so account for it separately when the offer depends on growth progress.' },
      { question: 'Are these Adopt Me pet values official?', answer: 'No. They are community reference data with visible site assumptions. The game publisher does not set an official player-trade value list.' },
    ],
  },

  'mm2/value-list': {
    reviewed: '2026-08-28',
    methodSummary: 'Provides a searchable local MM2 catalog with category, rarity, value, and demand fields kept visible.',
    intro: ['The MM2 Value List searches 59 reviewed Murder Mystery 2 weapon rows. It is intended for finding an entry, checking knife or gun category and rarity, sorting the community value index, and seeing Supreme Values demand beside value before building a trade.', 'MM2 has a player-driven economy rather than an official weapon price table. The August 28, 2026 snapshot names Supreme Values as its source and remains a curated list rather than claiming every weapon and variant.'],
    useCases: ['Search the complete local MM2 dataset from one page.', 'Sort reference values without losing category and demand context.', 'Identify entries to carry into the trade, comparison, or inventory tools.'],
    steps: ['Search by weapon name or filter the visible category and rarity fields.', 'Sort by the metric relevant to the question—value for scale, demand for liquidity.', 'Open the row details and note the reference context.', 'Use the trade calculator for a two-sided offer; the list itself does not issue a WFL verdict.'],
    howItWorks: { title: 'How This MM2 Value List Works', body: ['The page filters a local array of weapon reference records. Each record has an item name, category, rarity tier, editable planning value, demand rating, and contextual note. Search matches the item metadata, while sorting reorders the same records; it does not calculate a new market price.', 'Unlike the knife-values and godly-values URLs, this page’s intent is breadth across the current catalog. The focused pages narrow the dataset and add category-specific interpretation rather than serving as alternate copies of this list.'], points: ['Value is the current local planning index.', 'Demand is a separate liquidity signal.', 'Category and rarity describe the item but do not determine value by themselves.'] },
    workedExample: { title: 'Worked Example: finding a weapon before a trade', body: ['Search for the weapon name, confirm whether the result is a knife or gun, read its rarity, then compare the visible value and demand fields. If a second weapon has the same value but stronger demand, the list has shown an important difference—but it still has not declared which complete offer wins. Add both final bundles to the MM2 Trade Calculator for that step.'] },
    howToUseResult: { title: 'How to Use MM2 Value-List Data', body: ['Use the list as a lookup layer. Verify spelling and variant first, then judge value together with demand, item category, and current market discussion. A collector completing a set may value an entry differently from a trader seeking liquid upgrades. Keep the review date with any exported or remembered number.'], points: ['Do not infer a guarantee from rarity color alone.', 'Check whether the item is a knife, gun, or other category.', 'Revisit values after item releases, events, or major market disruptions.'] },
    limitations: { title: 'MM2 Dataset Coverage and Freshness', body: ['The 59-row dataset is a dated Supreme Values community snapshot, not a complete authoritative list of every MM2 weapon and variant. Community lists can disagree, and values may move with demand, duplication concerns, availability, and trading trends.'], points: ['The page links the source and editorial review date.', 'Demand labels require periodic review.', 'The page does not verify trades, ownership, or item authenticity.'] },
    referenceData: { title: 'Fields in the MM2 reference', note: 'Each field answers a different lookup question.', headers: ['Field', 'Purpose', 'Do not assume'], rows: [['Category', 'Knife, gun, or catalog grouping', 'Category alone sets price'], ['Rarity', 'In-game or catalog tier context', 'Every item in a tier is equal'], ['Value', 'Editable community planning index', 'Official MM2 price'], ['Demand', 'Relative community trading interest', 'Guaranteed instant trade']] },
    faqs: [
      { question: 'Is this MM2 value list complete?', answer: 'It contains 59 reviewed community-reference rows, including more than 40 Godlies and more than 30 knives, but it does not claim every MM2 weapon, chroma, or variant.' },
      { question: 'What is the difference between MM2 rarity and value?', answer: 'Rarity is an item classification. Value is a community market reference influenced by supply, demand, age, and trading behavior; items in the same rarity can have different values.' },
      { question: 'Why is demand shown separately from MM2 value?', answer: 'Demand helps describe liquidity. Two weapons with similar reference value may attract very different interest or take different effort to retrade.' },
      { question: 'When should I use the knife or Godly value page?', answer: 'Use those pages for category-specific filtering and interpretation. Use this value list for the broadest search across the current local MM2 catalog.' },
      { question: 'Are the listed MM2 values official?', answer: 'No. They are editable community-market planning references. MM2 does not publish an official player-to-player price table.' },
    ],
  },

  'mm2/trade-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Totals selected MM2 weapons on both sides and compares value gap and demand under editable community references.',
    intro: ['The MM2 Trade Calculator evaluates two multi-weapon Murder Mystery 2 offers. It adds item values and quantities, measures the gap relative to your side, and keeps demand visible so a bundle of weak-demand weapons is not treated as automatically equivalent to one liquid collectible.', 'The calculator relies on a local community planning index, not an official MM2 economy. It is most useful as transparent arithmetic that a player can audit row by row before using current market knowledge.'],
    useCases: ['Compare a knife-and-gun bundle with a single higher-tier item.', 'Measure the add needed after a counteroffer changes.', 'Check whether numerical overpay is concentrated in low-demand weapons.'],
    steps: ['Add each exact weapon and quantity on your side.', 'Enter every weapon shown by the other trader.', 'Compare total value, percentage gap, and average demand.', 'Verify the final trade window and reconsider any item whose value or demand has changed.'],
    howItWorks: { title: 'How This MM2 Trade Calculator Works', body: ['Each offer total is the sum of selected weapon reference value × quantity. Difference is their total minus your total; percentage difference uses your offer as the base. The shared trade model marks totals within ±7% as numerically Fair.', 'Demand is not converted into extra hidden points. It remains a separate average because community interest, not a fixed formula, determines whether a weapon is easy to trade. Category and rarity are descriptive context and are not automatically interchangeable with market value.'], points: ['Positive gap favors your entered side of the exchange.', 'Negative gap indicates your entered items total more.', 'A fair-band verdict does not evaluate scams, duplication concerns, or collector preference.'] },
    workedExample: { title: 'Worked Example: a two-weapon downgrade', body: ['Your single weapon has an illustrative reference of 120. The other player offers two weapons at 62 and 64, totaling 126. Their side is 6 higher, or 5% of your 120, so the arithmetic falls within the ±7% Fair band.', 'If both offered weapons have weak demand, accepting the small numerical overpay means taking on two items that may be slower to retrade. A downgrade often needs enough overpay to compensate for that effort; the calculator shows the gap but leaves that market judgment visible.'] },
    howToUseResult: { title: 'How to Use the MM2 Trade Gap', body: ['Use the difference to price an add and the demand comparison to evaluate liquidity. For an upgrade into one popular weapon, decide how much overpay you are comfortable offering. For a downgrade, inspect every add rather than accepting a large count of low-value entries. Recalculate after any last-second substitution.'], points: ['Confirm weapon name, variant, and category.', 'Check a current community source for major market changes.', 'Keep knife and gun contributions visible when completing sets.'] },
    limitations: { title: 'MM2 Market and Dataset Limits', body: ['Community values change with supply, demand, events, duplication concerns, and list methodology. The calculator uses 59 reviewed Supreme Values rows; a missing weapon must not be replaced with an unrelated item, and the calculator cannot identify dupes, fraud, or changes outside the trade window.'], points: ['The ±7% band is a planning convention, not an MM2 rule.', 'Demand ratings do not predict an exact time to trade.', 'Only the rows entered are included in the result.'] },
    referenceData: { title: 'Offer comparison signals', note: 'Use all three signals before deciding.', headers: ['Signal', 'Question answered', 'Known blind spot'], rows: [['Total value', 'How large is each entered bundle?', 'Current liquidity'], ['Percentage gap', 'How large is the difference relative to mine?', 'Collector preference'], ['Demand', 'How actively are these items sought?', 'Guaranteed buyer or timing']] },
    faqs: [
      { question: 'How does the MM2 calculator decide Win, Fair, or Lose?', answer: 'It compares the entered community-reference totals. A gap within ±7% of your offer is labeled Fair; larger positive or negative differences produce the directional verdict.' },
      { question: 'Should I accept several MM2 weapons for one weapon of equal value?', answer: 'Check demand and retrading effort. A numerical downgrade into several low-demand items can be less useful than one liquid weapon even when the total is equal or slightly higher.' },
      { question: 'Does the tool detect duplicated MM2 items?', answer: 'No. It only calculates from selected reference rows. It cannot authenticate an item or evaluate duplication risk.' },
      { question: 'What if a weapon is missing from the calculator?', answer: 'Do not substitute an unrelated row. Check the linked current community source and treat that exact item as unsupported here until it receives an editorially reviewed row.' },
    ],
  },

  'fortnite/xp-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Subtracts current-level progress from the level gap, then converts remaining XP into matches at the player’s observed rate.',
    intro: ['The Fortnite XP Calculator estimates the XP and matches needed to move from a current level to a target level. It uses the XP-per-level and XP-per-match values entered on the page so seasonal changes are not hidden behind a hard-coded promise.', 'The result is a pacing estimate. Fortnite XP varies by quests, accolades, Creative experiences, playtime systems, party bonuses, caps, and seasonal rules, so the most useful match rate is one measured from the mode and routine you actually play.'],
    useCases: ['Estimate matches remaining to a Battle Pass level target.', 'Compare quest-heavy and ordinary-match XP rates.', 'Check whether current progress inside the level meaningfully changes today’s plan.'],
    steps: ['Enter current and target levels.', 'Set the current season’s average XP required per level.', 'Enter XP already earned inside the current level and a realistic XP-per-match observation.', 'Use the rounded-up match count, then recalculate after large quest rewards or season changes.'],
    howItWorks: { title: 'How This Fortnite XP Calculator Works', body: ['Remaining XP equals (target level − current level) × XP per level − XP already earned in the current level, with negative results clamped to zero. Estimated matches equals remaining XP ÷ observed XP per match, rounded up because a fraction of a final match still requires another play session.', 'The calculator intentionally exposes XP per level and XP per match. That avoids presenting one season’s pacing as permanent and lets the same level goal be modeled for Battle Royale, Zero Build, Creative, or a quest-focused session.'], points: ['Current-level XP reduces only the first remaining level segment.', 'Match count rounds upward to reach or exceed the target.', 'Quest rewards should be included through a representative observed XP rate or subtracted separately.'] },
    workedExample: { title: 'Worked Example: level 42 to level 50', body: ['Using 80,000 XP per level, the eight-level gap is 640,000 XP. If 20,000 XP has already been earned inside level 42, 620,000 remains. At an observed 18,000 XP per match, 620,000 ÷ 18,000 = 34.44, so the planner rounds up to 35 matches.', 'If a quest grants 100,000 XP, subtract it from the remainder or update current progress after claiming it. The match estimate would then use 520,000 ÷ 18,000 and round up to 29 matches.'] },
    howToUseResult: { title: 'How to Use the Fortnite XP Plan', body: ['Turn the remaining match count into a daily target only after checking the season deadline and your available days. Re-measure XP per match across several representative games—one unusually strong match or a quest dump is a poor average. For deadline pacing, use the Battle Pass Calculator, which includes days remaining.'], points: ['Separate one-time quests from repeatable match pace.', 'Leave a buffer for missed days and variable match length.', 'Re-enter season requirements when Epic changes progression.'] },
    limitations: { title: 'Seasonal XP and Match Variance', body: ['This planner does not fetch live Epic account progress or current quest tables. XP-per-level requirements and earning systems can change by season, mode, cap, or event. Match XP is player-entered and can vary with placement, eliminations, accolades, quests, playtime, and temporary boosts.'], points: ['No account connection means current progress must be entered manually.', 'The average-per-level model may not capture every special level band.', 'A match estimate is a ceiling-based plan, not a guarantee of exact games.'] },
    referenceData: { title: 'Example XP pacing', note: 'These are worked inputs, not a claim about the current live season.', headers: ['Input', 'Example', 'Role in formula'], rows: [['Level gap', '50 − 42 = 8', 'Number of level segments'], ['XP per level', '80,000', 'User-entered season assumption'], ['Current progress', '20,000', 'Subtracted once'], ['XP per match', '18,000', 'Observed earning-rate assumption']] },
    faqs: [
      { question: 'Why can Fortnite XP per level be edited?', answer: 'Seasonal progression can change. An editable input lets the calculator match the requirement you see in the current season instead of silently reusing an old constant.' },
      { question: 'What should I use for XP per match?', answer: 'Average several matches from the mode and routine you plan to play. Keep one-time quest rewards separate unless they are genuinely part of the repeated sample.' },
      { question: 'Does the calculator include Supercharged XP or Creative caps?', answer: 'Only if their effect is reflected in the XP-per-match rate you enter. The tool does not fetch live boost status or mode-specific caps.' },
      { question: 'Why does the match result round up?', answer: 'A fractional final match cannot be completed as a fraction in the plan. Rounding up gives the smallest whole match count that reaches the modeled XP target.' },
      { question: 'Should I use this or the Battle Pass Calculator?', answer: 'Use this page for a direct level-to-level XP estimate. Use the Battle Pass planner when a season deadline and daily pace are central to the question.' },
    ],
  },

  'fortnite/fps-calculator': {
    reviewed: '2026-08-28',
    methodSummary: 'Combines a GPU baseline with CPU, resolution, and quality-preset factors, then reports a broad 85–115% range.',
    intro: ['The Fortnite FPS Calculator estimates a practical frame-rate range from the selected GPU baseline, CPU class, resolution, and graphics preset. It returns a range instead of one benchmark number because Fortnite performance changes across maps, fights, builds, driver versions, and background load.', 'This is a relative hardware model, not a live benchmark database. It is useful for comparing settings scenarios—such as 1080p Performance Mode versus 1440p High—before changing hardware or display targets.'],
    useCases: ['Compare resolution and preset changes on the same hardware profile.', 'Check whether a monitor-refresh target looks plausible as a broad planning range.', 'Identify whether the model is primarily constrained by GPU baseline or CPU factor.'],
    steps: ['Choose the closest listed GPU and CPU performance classes.', 'Select the resolution you will actually render, not only the monitor’s maximum.', 'Choose Performance, Low, Medium, High, or Epic to match the planned preset.', 'Read the center estimate and 85–115% range, then validate with an in-game replay or repeatable match scene.'],
    howItWorks: { title: 'How This Fortnite FPS Calculator Works', body: ['The center estimate multiplies a GPU baseline by a CPU factor, a resolution factor, and a preset factor. The current resolution factors are 1.00 for 1080p, 0.74 for 1440p, and 0.43 for 4K. Preset factors range from 1.40 for Performance Mode through 1.18 Low, 1.00 Medium, 0.78 High, and 0.57 Epic.', 'The displayed low and high values are 85% and 115% of that center. The band communicates model uncertainty; it is not a percentile guarantee and does not replace a benchmark from the exact CPU, GPU, memory, cooling, and patch.'], points: ['GPU baseline anchors the estimate.', 'CPU factor represents broad processor-side scaling.', 'Resolution and preset factors show the expected direction and size of scenario changes.'] },
    workedExample: { title: 'Worked Example: changing only resolution', body: ['Assume the selected GPU baseline and CPU factor produce a 200 FPS center at 1080p Medium. Keeping everything else fixed, 1440p Medium applies the 0.74 resolution factor and estimates 148 FPS. The displayed planning range is about 126 to 170 FPS because 148 × 0.85 = 125.8 and 148 × 1.15 = 170.2.', 'This comparison is stronger than treating 148 as a promised benchmark: it shows the model’s expected 26% center reduction while acknowledging that a live match can move outside the band.'] },
    howToUseResult: { title: 'How to Use the FPS Range', body: ['Compare the low end with the frame rate you need during demanding fights, not just the high end with your monitor refresh rate. If the target is competitive consistency, test Performance Mode and reduce background load before assuming a GPU upgrade is necessary. Confirm with the same replay, map area, and cap settings so each change is measured against a stable scene.'], points: ['Use 1% low and frame-time observations when benchmarking locally.', 'Check render resolution, Nanite/Lumen options, and frame cap alongside the named preset.', 'Monitor temperatures and clock behavior during a sustained test.'] },
    limitations: { title: 'Hardware-Estimate Limitations', body: ['The calculator groups hardware into broad baselines and does not model every CPU generation, GPU variant, laptop power limit, memory configuration, driver, operating-system task, or Fortnite patch. Battle Royale endgames, Creative maps, shader compilation, and thermal throttling can produce results outside the estimated band.'], points: ['A laptop GPU can perform differently from a desktop card with the same family name.', 'CPU bottlenecks become more important at high frame rates and low settings.', 'The range is not an endorsement or purchase recommendation for specific hardware.'] },
    referenceData: { title: 'Model factors used by the estimator', note: 'Factors are transparent scenario assumptions, not official Epic benchmark data.', headers: ['Setting', 'Factor'], rows: [['1080p / 1440p / 4K', '1.00 / 0.74 / 0.43'], ['Performance / Low', '1.40 / 1.18'], ['Medium / High / Epic', '1.00 / 0.78 / 0.57'], ['Displayed range', 'Center × 0.85 to center × 1.15']] },
    faqs: [
      { question: 'Why does the Fortnite FPS tool show a range?', answer: 'Live performance varies with the match, map, drivers, cooling, background tasks, and exact hardware. A band is more honest than presenting the model’s center as a guaranteed benchmark.' },
      { question: 'Is Performance Mode always 40% faster?', answer: 'No. The 1.40 factor is a broad model assumption. CPU limits, GPU limits, scene complexity, and current Fortnite rendering behavior determine the real gain.' },
      { question: 'Why can 1080p Low still be CPU-limited?', answer: 'Lower GPU load can expose the processor’s ability to prepare frames. At high target FPS, CPU generation, memory, and background load may matter more than another preset reduction.' },
      { question: 'Can this estimate tell me whether to buy a GPU?', answer: 'It can compare scenarios, but it is not enough for a purchase. Check recent benchmarks for the exact CPU/GPU combination, laptop power limit if relevant, and the current Fortnite version.' },
      { question: 'How should I verify the result in game?', answer: 'Use a repeatable replay or scene, keep the frame cap and render resolution fixed, record average FPS plus low-frame behavior, and test long enough for temperatures and clocks to stabilize.' },
    ],
  },
});
