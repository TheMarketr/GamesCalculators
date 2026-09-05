import type { TrainingMethod } from '../types';

const wiki = (page: string) => `https://oldschool.runescape.wiki/w/${page}`;
const method = (id: string, skill: string, name: string, xpPerAction: number, levelRequired: number, actionsPerHour: number | null, page: string, note: string): TrainingMethod => ({ id, skill, name, xpPerAction, levelRequired, actionsPerHour, source: 'OSRS Wiki', sourceUrl: wiki(page), reviewed: '2026-09-05', note });

export const osrsTrainingMethods: TrainingMethod[] = [
  method('attack-controlled-hit', 'Attack', 'Controlled damage dealt', 1.33, 1, null, 'Attack', 'XP per damage in controlled mode; enter a measured actions/hour rate.'),
  method('hitpoints-combat-damage', 'Hitpoints', 'Combat damage contribution', 1.33, 1, null, 'Hitpoints', 'Hitpoints XP per damage depends on the combat activity; use the override for a measured session.'),
  method('strength-aggressive-hit', 'Strength', 'Aggressive damage dealt', 4, 1, null, 'Strength', 'Standard melee Strength XP per damage dealt.'),
  method('defence-defensive-hit', 'Defence', 'Defensive damage dealt', 4, 1, null, 'Defence', 'Standard defensive melee XP per damage dealt.'),
  method('ranged-rapid-hit', 'Ranged', 'Ranged damage dealt', 4, 1, null, 'Ranged', 'Standard Ranged XP per damage before Hitpoints XP.'),
  method('magic-high-alch', 'Magic', 'High Level Alchemy', 65, 55, 1_200, 'High_Level_Alchemy', '65 Magic XP per cast; click rate varies.'),
  method('prayer-dragon-altar', 'Prayer', 'Dragon bones on gilded altar', 252, 1, 1_000, 'Dragon_bones', 'Uses the 3.5× gilded altar experience multiplier.'),
  method('runecraft-zmi', 'Runecraft', 'Ourania Altar average essence', 20, 1, 1_500, 'Ourania_Altar', 'Illustrative per-essence average; replace it with the current level-specific observed value.'),
  method('woodcutting-oak', 'Woodcutting', 'Oak logs', 37.5, 15, 1_100, 'Oak', 'XP per successful oak log.'),
  method('woodcutting-willow', 'Woodcutting', 'Willow logs', 67.5, 30, 1_000, 'Willow', 'XP per successful willow log.'),
  method('woodcutting-teak', 'Woodcutting', 'Teak logs', 85, 35, 1_400, 'Teak', 'XP per teak log before method-specific tick manipulation.'),
  method('woodcutting-yew', 'Woodcutting', 'Yew logs', 175, 60, 250, 'Yew', 'XP per successful yew log.'),
  method('mining-iron', 'Mining', 'Iron ore', 35, 15, 1_000, 'Iron_rocks', 'XP per iron ore mined.'),
  method('mining-coal', 'Mining', 'Coal', 50, 30, 500, 'Coal_rocks', 'XP per coal mined.'),
  method('mining-mithril', 'Mining', 'Mithril ore', 80, 55, 250, 'Mithril_rocks', 'XP per mithril ore mined.'),
  method('mining-amethyst', 'Mining', 'Amethyst', 240, 92, 100, 'Amethyst_crystals', 'XP per amethyst mined.'),
  method('construction-oak-larder', 'Construction', 'Oak larder', 480, 33, 260, 'Oak_larder', 'Eight oak planks at 60 XP each.'),
  method('construction-teak-bench', 'Construction', 'Teak garden bench', 540, 66, 250, 'Teak_garden_bench', 'Six teak planks at 90 XP each.'),
  method('construction-mahogany-table', 'Construction', 'Mahogany table', 840, 52, 220, 'Mahogany_table', 'Six mahogany planks at 140 XP each.'),
  method('slayer-monster-xp', 'Slayer', 'Target monster hitpoints', 100, 1, null, 'Slayer', 'Slayer XP normally tracks the assigned monster’s hitpoints; replace 100 with the target value.'),
  method('smithing-bronze-bar', 'Smithing', 'Bronze bar', 6.2, 1, 900, 'Bronze_bar', 'Displayed 6.2 XP per bar.'),
  method('smithing-iron-bar', 'Smithing', 'Iron bar', 12.5, 15, 850, 'Iron_bar', 'XP per successfully smelted iron bar.'),
  method('smithing-gold-gauntlets', 'Smithing', 'Gold bar with goldsmith gauntlets', 56.2, 40, 1_500, 'Goldsmith_gauntlets', 'Goldsmith gauntlets increase the normal gold-bar XP.'),
  method('smithing-adamant-plate', 'Smithing', 'Adamant platebody', 312.5, 88, 1_000, 'Adamant_platebody', 'Five adamant bars at 62.5 XP each.'),
  method('agility-gnome-course', 'Agility', 'Gnome Stronghold lap', 86.5, 1, 120, 'Gnome_Stronghold_Agility_Course', 'Full-lap experience including obstacles.'),
  method('agility-canifis', 'Agility', 'Canifis rooftop lap', 240, 40, 100, 'Canifis_Rooftop_Course', 'Full rooftop lap XP.'),
  method('agility-seers', 'Agility', 'Seers’ Village rooftop lap', 570, 60, 90, 'Seers%27_Village_Rooftop_Course', 'Full rooftop lap without diary shortcut assumptions.'),
  method('agility-ardougne', 'Agility', 'Ardougne rooftop lap', 793, 90, 60, 'Ardougne_Rooftop_Course', 'Full rooftop lap XP.'),
  method('fishing-lobster', 'Fishing', 'Lobster catch', 90, 40, 250, 'Lobster', 'XP per lobster caught.'),
  method('cooking-shark', 'Cooking', 'Cook shark', 210, 80, 1_200, 'Shark', 'XP for a successful cook; burns do not award the same result.'),
  method('firemaking-maple', 'Firemaking', 'Burn maple logs', 135, 45, 1_200, 'Maple_logs', 'XP per successfully lit maple log.'),
  method('fletching-maple-longbow', 'Fletching', 'Maple longbow (u)', 58.3, 55, 1_500, 'Maple_longbow_(u)', 'XP for cutting one unstrung maple longbow.'),
  method('crafting-green-body', 'Crafting', 'Green d’hide body', 186, 63, 1_500, 'Green_d%27hide_body', 'XP per crafted body.'),
  method('herblore-prayer-potion', 'Herblore', 'Prayer potion', 87.5, 38, 1_800, 'Prayer_potion', 'XP per completed potion.'),
  method('thieving-ardy-knight', 'Thieving', 'Ardougne knight pickpocket', 84.3, 55, 1_500, 'Knight_of_Ardougne', 'XP per successful pickpocket.'),
  method('farming-magic-tree', 'Farming', 'Check-health magic tree', 13_768.3, 75, null, 'Magic_tree', 'Check-health XP, excluding planting and harvest side actions.'),
  method('hunter-red-chin', 'Hunter', 'Red chinchompa catch', 265, 63, 300, 'Carnivorous_chinchompa', 'XP per successful catch.'),
  method('sailing-course', 'Sailing', 'Sailing training action', 100, 1, null, 'Sailing', 'Use the override for the current activity’s exact XP because Sailing methods award different amounts.'),
];

export const methodsForSkill = (skill: string) => osrsTrainingMethods.filter((method) => method.skill === skill);
