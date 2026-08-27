import { describe, expect, it } from 'vitest';
import { secondaryTools } from '../../data/secondary-tools';
import { getToolCatalog } from '../../data/tool-catalogs';
import { getCalculatorProfile, getSecondaryMode } from './profiles';

describe('secondary tool registry', () => {
  const entries = Object.entries(secondaryTools).flatMap(([gameSlug, tools]) => tools.map((tool) => ({ gameSlug, tool })));

  it('contains every one of the 82 phase 4 and phase 5 routes', () => {
    expect(entries).toHaveLength(82);
    expect(new Set(entries.map(({ gameSlug, tool }) => `${gameSlug}/${tool.slug}`)).size).toBe(82);
  });

  it.each(entries)('$gameSlug/$tool.slug has a working profile or local catalog', ({ gameSlug, tool }) => {
    const mode = getSecondaryMode(gameSlug, tool.slug);
    if (mode === 'formula') expect(getCalculatorProfile(gameSlug, tool.slug)).toBeDefined();
    else if (mode !== 'codes') expect(getToolCatalog(gameSlug, tool.slug).length).toBeGreaterThan(0);
  });
});
