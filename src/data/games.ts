import { secondaryTools } from './secondary-tools';

export type Accent = 'lime' | 'cyan' | 'pink' | 'amber' | 'coral' | 'violet' | 'sky' | 'green' | 'blue' | 'sunset';

export type ToolKind =
  | 'circle'
  | 'minecraft-xp'
  | 'enchant'
  | 'portal'
  | 'garden-value'
  | 'trade'
  | 'item-value'
  | 'brainrot-value'
  | 'pet-value'
  | 'wfl'
  | 'fortnite-xp'
  | 'fps'
  | 'countdown'
  | 'download-time'
  | 'platform'
  | 'gta-map'
  | 'secondary';

export interface ToolConfig {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  kind: ToolKind;
  category: string;
  featured?: boolean;
  updated: string;
  keywords?: string[];
}

export interface GameImage {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
  license: string;
  licenseUrl: string;
}

export interface GameConfig {
  slug: string;
  name: string;
  shortName?: string;
  eyebrow: string;
  description: string;
  accent: Accent;
  glyph: string;
  image?: GameImage;
  tools: ToolConfig[];
}

const updated = '2026-08-26';

export const games: GameConfig[] = [
  {
    slug: 'grow-a-garden', name: 'Grow a Garden', eyebrow: 'Roblox garden utilities', accent: 'lime', glyph: 'GG',
    description: 'Price crops, stack mutations and compare trade offers with editable, transparent values.',
    tools: [
      { slug: 'value-calculator', name: 'Grow a Garden Value Calculator', shortName: 'Value Calculator', description: 'Calculate crop sell value using weight, growth and mutation multipliers.', kind: 'garden-value', category: 'Values', featured: true, updated, keywords: ['fruit value', 'crop price'] },
      { slug: 'trade-calculator', name: 'Grow a Garden Trade Calculator', shortName: 'Trade Calculator', description: 'Compare multi-item garden trades and see the value gap instantly.', kind: 'trade', category: 'Trading', featured: true, updated, keywords: ['trade value'] },
      ...secondaryTools['grow-a-garden'],
    ],
  },
  {
    slug: 'blox-fruits', name: 'Blox Fruits', eyebrow: 'Trading and build tools', accent: 'cyan', glyph: 'BF',
    description: 'Compare fruit values, check offers and plan your next Blox Fruits trade.',
    tools: [
      { slug: 'value-calculator', name: 'Blox Fruits Value Calculator', shortName: 'Value Calculator', description: 'Add fruits and calculate total trade value and average demand.', kind: 'item-value', category: 'Values', featured: true, updated, keywords: ['blox fruit calculator', 'fruit values'] },
      { slug: 'trade-calculator', name: 'Blox Fruits Trade Calculator', shortName: 'Trade Calculator', description: 'Build both sides of a trade and get a fair-value range, demand and verdict.', kind: 'trade', category: 'Trading', featured: true, updated, keywords: ['trade value', 'trading'] },
      ...secondaryTools['blox-fruits'],
    ],
  },
  {
    slug: 'steal-a-brainrot', name: 'Steal a Brainrot', eyebrow: 'Collection value tools', accent: 'pink', glyph: 'SB',
    description: 'Estimate collection value and income with quick, shareable results.',
    tools: [
      { slug: 'value-calculator', name: 'Steal a Brainrot Value Calculator', shortName: 'Value Calculator', description: 'Add Brainrots, quantities and mutations to total your collection value and income.', kind: 'brainrot-value', category: 'Values', featured: true, updated, keywords: ['brainrot values', 'income'] },
      ...secondaryTools['steal-a-brainrot'],
    ],
  },
  {
    slug: '99-nights', name: '99 Nights in the Forest', shortName: '99 Nights', eyebrow: 'Survival run planning', accent: 'amber', glyph: '99',
    description: 'Prepare food, fuel and crafting resources for a stronger forest run.',
    tools: [...secondaryTools['99-nights']],
  },
  {
    slug: 'adopt-me', name: 'Adopt Me', eyebrow: 'Pet and trading tools', accent: 'coral', glyph: 'AM',
    description: 'Compare pet values and check whether a trade looks like a win, fair or lose.',
    tools: [
      { slug: 'value-calculator', name: 'Adopt Me Value Calculator', shortName: 'Value Calculator', description: 'Calculate a total from regular, neon, mega and fly/ride pet variants.', kind: 'pet-value', category: 'Values', featured: true, updated, keywords: ['pet values'] },
      { slug: 'pet-calculator', name: 'Adopt Me Pet Calculator', shortName: 'Pet Calculator', description: 'Compare pet variants and understand each pet’s contribution to an offer.', kind: 'pet-value', category: 'Pets', updated, keywords: ['pet calculator'] },
      { slug: 'wfl-calculator', name: 'Adopt Me WFL Calculator', shortName: 'WFL Calculator', description: 'Compare two offers and get a Win, Fair or Lose range with a visual value bar.', kind: 'wfl', category: 'Trading', featured: true, updated, keywords: ['win fair lose', 'trade calculator'] },
      ...secondaryTools['adopt-me'],
    ],
  },
  {
    slug: 'mm2', name: 'Murder Mystery 2', shortName: 'MM2', eyebrow: 'Weapon value tools', accent: 'violet', glyph: 'M2',
    description: 'A focused home for MM2 value lists, comparisons and collection tools.',
    tools: [...secondaryTools.mm2],
  },
  {
    slug: 'pet-simulator-99', name: 'Pet Simulator 99', shortName: 'PS99', eyebrow: 'Pet economy tools', accent: 'sky', glyph: 'P9',
    description: 'Plan pet trades, inventory totals, hatch odds and power comparisons.',
    tools: [...secondaryTools['pet-simulator-99']],
  },
  {
    slug: 'minecraft', name: 'Minecraft', eyebrow: 'Building and survival tools', accent: 'green', glyph: 'MC',
    description: 'Generate accurate block shapes, convert dimensions and plan XP or portal travel.',
    image: {
      src: '/images/games/minecraft-gameplay.png',
      alt: 'A freely licensed Minecraft landscape gameplay screenshot',
      credit: 'Minecraft gameplay screenshot by Xbox México',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    tools: [
      { slug: 'circle-generator', name: 'Minecraft Circle Generator', shortName: 'Circle Generator', description: 'Generate filled or outlined pixel circles with block counts and row instructions.', kind: 'circle', category: 'Building', featured: true, updated, keywords: ['pixel circle', 'block circle'] },
      { slug: 'xp-calculator', name: 'Minecraft XP Calculator', shortName: 'XP Calculator', description: 'Calculate exact XP between levels and estimate common XP-source requirements.', kind: 'minecraft-xp', category: 'Progress', featured: true, updated, keywords: ['experience levels'] },
      { slug: 'enchant-calculator', name: 'Minecraft Enchant Calculator', shortName: 'Enchant Calculator', description: 'Plan enchanting-table levels, bookshelves and lapis requirements.', kind: 'enchant', category: 'Enchanting', featured: true, updated, keywords: ['enchantment cost'] },
      { slug: 'portal-calculator', name: 'Minecraft Portal Calculator', shortName: 'Portal Calculator', description: 'Convert Overworld and Nether coordinates with safe rounding.', kind: 'portal', category: 'Coordinates', featured: true, updated, keywords: ['nether coordinates'] },
      ...secondaryTools.minecraft,
    ],
  },
  {
    slug: 'fortnite', name: 'Fortnite', eyebrow: 'Performance and progress tools', accent: 'blue', glyph: 'FN',
    description: 'Estimate XP progress and realistic PC performance ranges for your settings.',
    image: {
      src: '/images/games/fortnite-gdc.jpg',
      alt: 'Fortnite Battle Royale being presented at GDC 2018',
      credit: 'Fortnite at GDC 2018 by Official GDC',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Fortnite_Battle_Royale_at_GDC_2018.jpg',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    },
    tools: [
      { slug: 'xp-calculator', name: 'Fortnite XP Calculator', shortName: 'XP Calculator', description: 'Estimate XP, levels and matches needed to reach a Battle Pass target.', kind: 'fortnite-xp', category: 'Progress', featured: true, updated, keywords: ['battle pass xp', 'level calculator'] },
      { slug: 'fps-calculator', name: 'Fortnite FPS Calculator', shortName: 'FPS Calculator', description: 'Estimate a practical FPS range from your hardware, resolution and preset.', kind: 'fps', category: 'Performance', featured: true, updated, keywords: ['pc fps estimate'] },
      ...secondaryTools.fortnite,
    ],
  },
  {
    slug: 'gta-6', name: 'GTA VI', eyebrow: 'Release and planning tools', accent: 'sunset', glyph: 'VI',
    description: 'Track the release countdown and prepare for download, platforms and map exploration.',
    tools: [
      { slug: 'release-date', name: 'GTA VI Release Date Countdown', shortName: 'Release Date Countdown', description: 'Count down live to the confirmed November 19, 2026 release date.', kind: 'countdown', category: 'Release', featured: true, updated, keywords: ['gta 6 release date', 'grand theft auto vi countdown'] },
      { slug: 'download-time-calculator', name: 'GTA VI Download Time Calculator', shortName: 'Download Time Calculator', description: 'Estimate download duration and completion time from file size and connection speed.', kind: 'download-time', category: 'Planning', updated, keywords: ['download speed', 'file size'] },
      { slug: 'platform-checker', name: 'GTA VI Platform Checker', shortName: 'Platform Checker', description: 'Check the currently announced GTA VI platform status for your system.', kind: 'platform', category: 'Release', updated, keywords: ['ps5', 'xbox', 'pc release'] },
      { slug: 'map', name: 'GTA VI Interactive Map', shortName: 'Interactive Map', description: 'Explore a lightweight sample map architecture with search, filters and locally saved visited places.', kind: 'gta-map', category: 'Map', updated, keywords: ['gta 6 map', 'vice city locations'] },
      ...secondaryTools['gta-6'],
    ],
  },
];

export const getGame = (slug: string) => games.find((game) => game.slug === slug);
export const publishedTools = games.flatMap((game) => game.tools.map((tool) => ({ ...tool, game })));
export const featuredTools = publishedTools.filter((tool) => tool.featured);
export const recentTools = [...publishedTools].sort((a, b) => b.updated.localeCompare(a.updated));
