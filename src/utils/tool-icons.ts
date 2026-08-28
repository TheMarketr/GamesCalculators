type ToolLike = {
  name?: string;
  shortName?: string;
  slug?: string;
  category?: string;
};

const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

/** Decorative, familiar symbols used consistently across tool discovery and calculator UI. */
export function getToolIcon(tool: ToolLike | string): string {
  const value = typeof tool === 'string'
    ? tool.toLowerCase()
    : `${tool.slug ?? ''} ${tool.name ?? ''} ${tool.shortName ?? ''} ${tool.category ?? ''}`.toLowerCase();

  if (includesAny(value, ['trade', 'wfl', 'fair', 'comparison', 'compare'])) return '⚖️';
  if (includesAny(value, ['circle', 'dome', 'sphere', 'oval', 'building', 'staircase'])) return '🧱';
  if (includesAny(value, ['coordinate', 'portal', 'distance'])) return '🧭';
  if (includesAny(value, ['enchant', 'mutation'])) return '✨';
  if (includesAny(value, ['xp', 'level', 'mastery', 'progress', 'rebirth', 'age'])) return '⭐';
  if (includesAny(value, ['garden', 'crop', 'seed', 'profit'])) return '🌱';
  if (includesAny(value, ['fruit'])) return '🍍';
  if (includesAny(value, ['brainrot'])) return '🧠';
  if (includesAny(value, ['pet', 'hatch', 'egg'])) return '🐾';
  if (includesAny(value, ['odds', 'crate'])) return '🎲';
  if (includesAny(value, ['damage', 'ttk', 'weapon', 'combat'])) return '⚔️';
  if (includesAny(value, ['fps', 'performance', 'edpi', 'sensitivity', 'settings'])) return '⚡';
  if (includesAny(value, ['release', 'countdown'])) return '⏳';
  if (includesAny(value, ['download'])) return '⬇️';
  if (includesAny(value, ['platform'])) return '🎮';
  if (includesAny(value, ['map', 'location'])) return '🗺️';
  if (includesAny(value, ['fuel', 'survival', 'run planner'])) return '🔥';
  if (includesAny(value, ['food'])) return '🍖';
  if (includesAny(value, ['craft'])) return '🛠️';
  if (includesAny(value, ['income', 'money', 'cost', 'diamond', 'earnings', 'payout'])) return '💰';
  if (includesAny(value, ['inventory', 'collection', 'tracker'])) return '🎒';
  if (includesAny(value, ['reference', 'values', 'prices', 'items', 'characters', 'codes', 'best'])) return '📖';
  if (includesAny(value, ['power', 'stat', 'build'])) return '💪';
  if (includesAny(value, ['garage', 'car', 'vehicle'])) return '🚗';
  if (includesAny(value, ['wanted', 'escape'])) return '🚨';
  if (includesAny(value, ['session', 'planning', 'planner'])) return '📅';
  return '🧮';
}

export function getLabelIcon(label: string): string {
  const value = label.toLowerCase();
  if (includesAny(value, ['search'])) return '🔎';
  if (includesAny(value, ['time', 'duration', 'hour', 'minute', 'second', 'completion'])) return '⏱️';
  if (includesAny(value, ['speed', 'fps', 'performance'])) return '⚡';
  if (includesAny(value, ['distance', 'coordinate', 'dimension', 'direction'])) return '🧭';
  if (includesAny(value, ['value', 'price', 'cost', 'profit', 'income', 'total', 'payout', 'diamond'])) return '💰';
  if (includesAny(value, ['damage', 'armor', 'protection', 'health', 'shots'])) return '⚔️';
  if (includesAny(value, ['level', 'xp', 'mastery', 'progress', 'rating', 'score'])) return '⭐';
  if (includesAny(value, ['quantity', 'items', 'blocks', 'stacks', 'materials', 'bookshelves'])) return '🧱';
  if (includesAny(value, ['crop', 'weight', 'growth', 'mutation'])) return '🌱';
  if (includesAny(value, ['pet', 'variant', 'egg'])) return '🐾';
  if (includesAny(value, ['offer', 'trade', 'gap', 'comparison', 'option'])) return '⚖️';
  if (includesAny(value, ['graphics', 'gpu', 'resolution', 'preset', 'display'])) return '🖥️';
  if (includesAny(value, ['processor', 'cpu'])) return '🖥️';
  if (includesAny(value, ['platform', 'system'])) return '🎮';
  if (includesAny(value, ['chance', 'odds', 'luck'])) return '🎲';
  if (includesAny(value, ['category', 'rarity', 'tier', 'style', 'type', 'mode'])) return '🏷️';
  if (includesAny(value, ['file', 'download'])) return '⬇️';
  if (includesAny(value, ['result', 'estimate', 'recommended', 'target'])) return '🎯';
  return '🔢';
}
