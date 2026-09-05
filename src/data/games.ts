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
  lastReviewed: string;
  toolType: 'calculator' | 'generator' | 'reference' | 'tracker' | 'map';
  keywords?: string[];
}

export interface GameImage {
  src: string;
  alt: string;
  caption?: string;
  credit: string;
  creditUrl: string;
  sourceLabel: string;
  sourceUrl: string;
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
  icon?: GameImage;
  image?: GameImage;
  gallery?: GameImage[];
  tools: ToolConfig[];
}

const toolMeta = (toolType: ToolConfig['toolType'], lastReviewed: string) => ({ toolType, lastReviewed, updated: lastReviewed });

const robloxMedia = (slug: string, gameName: string, placeId: string) => {
  const base = `/images/games/${slug}`;
  const creditUrl = `https://www.roblox.com/games/${placeId}`;
  const shared = {
    credit: `${gameName} official Roblox experience media`,
    creditUrl,
    sourceLabel: `${gameName} on Roblox`,
    sourceUrl: creditUrl,
    license: 'Publisher-provided game thumbnail',
    licenseUrl: 'https://create.roblox.com/docs/production/publishing/thumbnails',
  };
  return {
    icon: { src: `${base}/icon.png`, alt: `${gameName} official Roblox game icon`, ...shared },
    image: { src: `${base}/scene-1.png`, alt: `${gameName} official Roblox experience thumbnail`, ...shared },
    gallery: [
      { src: `${base}/scene-1.png`, alt: `${gameName} official Roblox experience preview`, ...shared },
      { src: `${base}/scene-2.png`, alt: `${gameName} official Roblox gameplay artwork`, ...shared },
    ],
  } satisfies Pick<GameConfig, 'icon' | 'image' | 'gallery'>;
};

const gtaMedia = {
  credit: 'Grand Theft Auto VI official artwork © Rockstar Games',
  creditUrl: 'https://www.rockstargames.com/VI/media',
  sourceLabel: 'Rockstar Games',
  sourceUrl: 'https://www.rockstargames.com/VI/media',
  license: 'Official downloadable media',
  licenseUrl: 'https://www.rockstargames.com/VI/media',
};

const gtaScreenshotMedia = {
  credit: 'Grand Theft Auto VI official screenshot © Rockstar Games',
  creditUrl: 'https://www.rockstargames.com/VI/media/screenshots',
  sourceLabel: 'Rockstar Games',
  sourceUrl: 'https://www.rockstargames.com/VI/media/screenshots',
  license: 'Official downloadable media',
  licenseUrl: 'https://www.rockstargames.com/VI/media/screenshots',
};

export const games: GameConfig[] = [
  {
    slug: 'grow-a-garden', name: 'Grow a Garden', eyebrow: 'Roblox garden utilities', accent: 'lime', glyph: 'GG',
    description: 'Price crops, stack mutations and compare trade offers with editable, transparent values.',
    ...robloxMedia('grow-a-garden', 'Grow a Garden', '126884695634066'),
    tools: [
      { slug: 'value-calculator', name: 'Grow a Garden Value Calculator', shortName: 'Value Calculator', description: 'Calculate crop sell value using weight, growth and mutation multipliers.', kind: 'garden-value', category: 'Values', featured: true, ...toolMeta('calculator', '2026-08-25'), keywords: ['fruit value', 'crop price'] },
      { slug: 'trade-calculator', name: 'Grow a Garden Trade Calculator', shortName: 'Trade Calculator', description: 'Compare two crop bundles using reviewed base Sheckle values.', kind: 'trade', category: 'Trading', featured: true, ...toolMeta('calculator', '2026-08-25'), keywords: ['trade value'] },
      ...secondaryTools['grow-a-garden'],
    ],
  },
  {
    slug: 'blox-fruits', name: 'Blox Fruits', eyebrow: 'Trading and build tools', accent: 'cyan', glyph: 'BF',
    description: 'Compare fruit values, check offers and plan your next Blox Fruits trade.',
    ...robloxMedia('blox-fruits', 'Blox Fruits', '2753915549'),
    tools: [
      { slug: 'value-calculator', name: 'Blox Fruits Value Calculator', shortName: 'Value Calculator', description: 'Total all 41 priced Dealer fruits by Beli cost and separate permanent Robux price.', kind: 'item-value', category: 'Values', featured: true, ...toolMeta('calculator', '2026-09-04'), keywords: ['blox fruit calculator', 'fruit values'] },
      { slug: 'trade-calculator', name: 'Blox Fruits Trade Calculator', shortName: 'Trade Calculator', description: 'Compare both sides by documented Dealer Beli baseline without inventing demand.', kind: 'trade', category: 'Trading', featured: true, ...toolMeta('calculator', '2026-09-04'), keywords: ['trade value', 'trading'] },
      ...secondaryTools['blox-fruits'],
    ],
  },
  {
    slug: 'steal-a-brainrot', name: 'Steal a Brainrot', eyebrow: 'Collection value tools', accent: 'pink', glyph: 'SB',
    description: 'Estimate collection value and income with quick, shareable results.',
    ...robloxMedia('steal-a-brainrot', 'Steal a Brainrot', '109983668079237'),
    tools: [
      { slug: 'value-calculator', name: 'Steal a Brainrot Value Calculator', shortName: 'Value Calculator', description: 'Total documented acquisition cost and base income for 45 Brainrot records.', kind: 'brainrot-value', category: 'Values', featured: true, ...toolMeta('calculator', '2026-08-25'), keywords: ['brainrot values', 'income'] },
      ...secondaryTools['steal-a-brainrot'],
    ],
  },
  {
    slug: '99-nights', name: '99 Nights in the Forest', shortName: '99 Nights', eyebrow: 'Survival run planning', accent: 'amber', glyph: '99',
    description: 'Prepare food, fuel and crafting resources for a stronger forest run.',
    ...robloxMedia('99-nights', '99 Nights in the Forest', '79546208627805'),
    tools: [...secondaryTools['99-nights']],
  },
  {
    slug: 'adopt-me', name: 'Adopt Me', eyebrow: 'Pet and trading tools', accent: 'coral', glyph: 'AM',
    description: 'Compare pet values and check whether a trade looks like a win, fair or lose.',
    ...robloxMedia('adopt-me', 'Adopt Me', '920587237'),
    tools: [
      { slug: 'value-calculator', name: 'Adopt Me Value Calculator', shortName: 'Value Calculator', description: 'Calculate a total from regular, neon, mega and fly/ride pet variants.', kind: 'pet-value', category: 'Values', featured: true, ...toolMeta('calculator', '2026-08-25'), keywords: ['pet values'] },
      { slug: 'pet-calculator', name: 'Adopt Me Pet Calculator', shortName: 'Pet Calculator', description: 'Compare pet variants and understand each pet’s contribution to an offer.', kind: 'pet-value', category: 'Pets', ...toolMeta('calculator', '2026-08-22'), keywords: ['pet calculator'] },
      { slug: 'wfl-calculator', name: 'Adopt Me WFL Calculator', shortName: 'WFL Calculator', description: 'Compare two offers and get a Win, Fair or Lose range with a visual value bar.', kind: 'wfl', category: 'Trading', featured: true, ...toolMeta('calculator', '2026-08-25'), keywords: ['win fair lose', 'trade calculator'] },
      ...secondaryTools['adopt-me'],
    ],
  },
  {
    slug: 'mm2', name: 'Murder Mystery 2', shortName: 'MM2', eyebrow: 'Weapon value tools', accent: 'violet', glyph: 'M2',
    description: 'A focused home for MM2 value lists, comparisons and collection tools.',
    ...robloxMedia('mm2', 'Murder Mystery 2', '142823291'),
    tools: [...secondaryTools.mm2],
  },
  {
    slug: 'pet-simulator-99', name: 'Pet Simulator 99', shortName: 'PS99', eyebrow: 'Pet economy tools', accent: 'sky', glyph: 'P9',
    description: 'Plan pet trades, inventory totals, hatch odds and power comparisons.',
    ...robloxMedia('pet-simulator-99', 'Pet Simulator 99', '8737899170'),
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
      sourceLabel: 'Wikimedia Commons · CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    icon: {
      src: '/images/games/minecraft-gameplay.png',
      alt: 'Minecraft gameplay landscape used to identify the game',
      credit: 'Minecraft gameplay screenshot by Xbox México',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      sourceLabel: 'Wikimedia Commons · CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    gallery: [{
      src: '/images/games/minecraft-gameplay.png',
      alt: 'Minecraft landscape gameplay screenshot',
      credit: 'Minecraft gameplay screenshot by Xbox México',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      sourceLabel: 'Wikimedia Commons · CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    }],
    tools: [
      { slug: 'circle-generator', name: 'Minecraft Circle Generator', shortName: 'Circle Generator', description: 'Generate filled or outlined pixel circles with block counts and row instructions.', kind: 'circle', category: 'Building', featured: true, ...toolMeta('generator', '2026-09-02'), keywords: ['pixel circle', 'block circle'] },
      { slug: 'xp-calculator', name: 'Minecraft XP Calculator', shortName: 'XP Calculator', description: 'Calculate exact XP between levels and estimate common XP-source requirements.', kind: 'minecraft-xp', category: 'Progress', featured: true, ...toolMeta('calculator', '2026-08-26'), keywords: ['experience levels'] },
      { slug: 'enchant-calculator', name: 'Minecraft Enchant Calculator', shortName: 'Enchant Calculator', description: 'Plan enchanting-table levels, bookshelves and lapis requirements.', kind: 'enchant', category: 'Enchanting', featured: true, ...toolMeta('calculator', '2026-08-26'), keywords: ['enchantment cost'] },
      { slug: 'portal-calculator', name: 'Minecraft Portal Calculator', shortName: 'Portal Calculator', description: 'Convert Overworld and Nether coordinates with safe rounding.', kind: 'portal', category: 'Coordinates', featured: true, ...toolMeta('calculator', '2026-08-26'), keywords: ['nether coordinates'] },
      ...secondaryTools.minecraft,
    ],
  },
  {
    slug: 'fortnite', name: 'Fortnite', eyebrow: 'Performance and progress tools', accent: 'blue', glyph: 'FN',
    description: 'Estimate XP progress and realistic PC performance ranges for your settings.',
    image: {
      src: '/images/games/fortnite-gameplay.jpg',
      alt: 'Official Fortnite gameplay screenshot showing a player hurdling into an active Battle Royale fight',
      credit: 'Official Fortnite gameplay screenshot by Epic Games',
      creditUrl: 'https://cdn2.unrealengine.com/fortnite-overview-hurdling-forward-1200x607-1122166f8d35.jpg',
      sourceLabel: 'Epic Games',
      sourceUrl: 'https://www.fortnite.com/',
      license: 'Epic Games Fan Content Policy',
      licenseUrl: 'https://legal.epicgames.com/en-US/epicgames/fan-art-policy',
    },
    icon: {
      src: '/images/games/fortnite-gameplay.jpg',
      alt: 'Official Fortnite Battle Royale gameplay image used to identify the game',
      credit: 'Official Fortnite gameplay screenshot by Epic Games',
      creditUrl: 'https://cdn2.unrealengine.com/fortnite-overview-hurdling-forward-1200x607-1122166f8d35.jpg',
      sourceLabel: 'Epic Games',
      sourceUrl: 'https://www.fortnite.com/',
      license: 'Epic Games Fan Content Policy',
      licenseUrl: 'https://legal.epicgames.com/en-US/epicgames/fan-art-policy',
    },
    gallery: [{
      src: '/images/games/fortnite-gameplay.jpg',
      alt: 'Official Fortnite gameplay scene with combat, building and a hurdling player',
      credit: 'Official Fortnite gameplay screenshot by Epic Games',
      creditUrl: 'https://cdn2.unrealengine.com/fortnite-overview-hurdling-forward-1200x607-1122166f8d35.jpg',
      sourceLabel: 'Epic Games',
      sourceUrl: 'https://www.fortnite.com/',
      license: 'Epic Games Fan Content Policy',
      licenseUrl: 'https://legal.epicgames.com/en-US/epicgames/fan-art-policy',
    }],
    tools: [
      { slug: 'xp-calculator', name: 'Fortnite XP Calculator', shortName: 'XP Calculator', description: 'Estimate XP, levels and matches needed to reach a Battle Pass target.', kind: 'fortnite-xp', category: 'Progress', featured: true, ...toolMeta('calculator', '2026-08-26'), keywords: ['battle pass xp', 'level calculator'] },
      { slug: 'fps-calculator', name: 'Fortnite FPS Calculator', shortName: 'FPS Calculator', description: 'Estimate a practical FPS range from your hardware, resolution and preset.', kind: 'fps', category: 'Performance', featured: true, ...toolMeta('calculator', '2026-08-26'), keywords: ['pc fps estimate'] },
      ...secondaryTools.fortnite,
    ],
  },
  {
    slug: 'gta-6', name: 'GTA VI', eyebrow: 'Release and planning tools', accent: 'sunset', glyph: 'VI',
    description: 'Explore sourced GTA VI characters, Leonida locations, gameplay systems, editions and launch facts alongside release and planning calculators.',
    icon: { src: '/images/games/gta-6/icon.jpg', alt: 'Official Grand Theft Auto VI cover artwork', ...gtaMedia },
    image: { src: '/images/games/gta-6/jason-lucia-gameplay.jpg', alt: 'Jason and Lucia together in an official Grand Theft Auto VI screenshot', caption: 'Jason and Lucia in Leonida', ...gtaScreenshotMedia },
    gallery: [
      { src: '/images/games/gta-6/jason-lucia-gameplay.jpg', alt: 'Jason and Lucia together with Vice City and police vehicles behind them in Grand Theft Auto VI', caption: 'Jason and Lucia in Leonida', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/vice-city-11.jpg', alt: 'Vice City skyline and waterfront glowing at dusk in Grand Theft Auto VI', caption: 'Vice City at dusk', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/jason-duval-07.jpg', alt: 'Jason Duval behind a chain-link fence during a police encounter in Grand Theft Auto VI', caption: 'Jason Duval', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/lucia-caminos-09.jpg', alt: 'Lucia Caminos training with a heavy bag in a Grand Theft Auto VI gym', caption: 'Lucia Caminos training', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/leonida-keys-06.jpg', alt: 'An iguana on a seawall beside the tropical Leonida Keys coast in Grand Theft Auto VI', caption: 'Leonida Keys wildlife', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/port-gellhorn-06.jpg', alt: 'A Port Gellhorn neighborhood and palm-lined street at sunset in Grand Theft Auto VI', caption: 'Port Gellhorn at sunset', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/grassrivers-06.jpg', alt: 'A hunter holding an alligator in the wetlands of Grassrivers in Grand Theft Auto VI', caption: 'Grassrivers wetlands', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/mount-kalaga-01.jpg', alt: 'Dirt-bike racers passing industrial silos in Mount Kalaga National Park in Grand Theft Auto VI', caption: 'Mount Kalaga dirt-bike country', ...gtaScreenshotMedia },
      { src: '/images/games/gta-6/jason-lucia-robbery.jpg', alt: 'Jason and Lucia in official Grand Theft Auto VI robbery artwork', caption: 'Jason and Lucia artwork', ...gtaMedia },
      { src: '/images/games/gta-6/vice-city-postcard.jpg', alt: 'Official Grand Theft Auto VI Vice City postcard artwork', caption: 'Vice City postcard artwork', ...gtaMedia },
      { src: '/images/games/gta-6/jason-lucia.jpg', alt: 'Official Grand Theft Auto VI artwork featuring Jason and Lucia', caption: 'Jason and Lucia key artwork', ...gtaMedia },
    ],
    tools: [
      { slug: 'release-date', name: 'GTA VI Release Date Countdown', shortName: 'Release Date Countdown', description: 'Count down live to the confirmed November 19, 2026 release date.', kind: 'countdown', category: 'Release', featured: true, ...toolMeta('calculator', '2026-08-31'), keywords: ['gta 6 release date', 'grand theft auto vi countdown'] },
      { slug: 'download-time-calculator', name: 'GTA VI Download Time Calculator', shortName: 'Download Time Calculator', description: 'Estimate download duration and completion time from file size and connection speed.', kind: 'download-time', category: 'Planning', ...toolMeta('calculator', '2026-08-31'), keywords: ['download speed', 'file size'] },
      { slug: 'platform-checker', name: 'GTA VI Platform Checker', shortName: 'Platform Checker', description: 'Check the currently announced GTA VI platform status for your system.', kind: 'platform', category: 'Release', ...toolMeta('reference', '2026-08-31'), keywords: ['ps5', 'xbox', 'pc release'] },
      { slug: 'map', name: 'GTA VI Interactive Map', shortName: 'Interactive Map', description: 'Explore a clearly labeled pre-release map interface with local filters and visited-state tracking.', kind: 'gta-map', category: 'Map', ...toolMeta('map', '2026-08-31'), keywords: ['gta 6 map', 'vice city locations'] },
      ...secondaryTools['gta-6'],
    ],
  },
];

export const getGame = (slug: string) => games.find((game) => game.slug === slug);
export const publishedTools = games.flatMap((game) => game.tools.map((tool) => ({ ...tool, game })));
export const featuredTools = publishedTools.filter((tool) => tool.featured);
export const recentTools = [...publishedTools].sort((a, b) => b.updated.localeCompare(a.updated));
