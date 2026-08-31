import { describe, expect, it } from 'vitest';
import { secondaryTools } from '../../data/secondary-tools';
import { getToolCatalog } from '../../data/tool-catalogs';
import { getCalculatorProfile, getSecondaryMode } from './profiles';

describe('secondary tool registry', () => {
  const entries = Object.entries(secondaryTools).flatMap(([gameSlug, tools]) => tools.map((tool) => ({ gameSlug, tool })));

  it('contains every secondary tool route', () => {
    expect(entries).toHaveLength(90);
    expect(new Set(entries.map(({ gameSlug, tool }) => `${gameSlug}/${tool.slug}`)).size).toBe(90);
  });

  it.each(entries)('$gameSlug/$tool.slug has a working profile or local catalog', ({ gameSlug, tool }) => {
    const mode = getSecondaryMode(gameSlug, tool.slug);
    if (mode === 'formula') expect(getCalculatorProfile(gameSlug, tool.slug)).toBeDefined();
    else if (mode !== 'codes') expect(getToolCatalog(gameSlug, tool.slug).length).toBeGreaterThan(0);
  });
});
