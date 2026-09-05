import { describe, expect, it } from 'vitest';
import { calculatorContent } from './calculator-content';
import { publishedTools } from './games';
import { routeCatalog } from '../games/secondary/Calculator';

const groups = {
  mm2: ['value-list', 'trading-values', 'knife-values', 'godly-values'],
  'adopt-me': ['value-calculator', 'pet-value-calculator', 'pet-calculator', 'wfl-calculator', 'trade-calculator', 'inventory-calculator'],
  'grow-a-garden': ['prices', 'items', 'best-crops'],
};

const substantiveSentences = (value: unknown) => {
  const strings: string[] = [];
  const visit = (entry: unknown, key = '') => {
    if (['reviewed', 'sources', 'title', 'name'].includes(key)) return;
    if (typeof entry === 'string') strings.push(entry);
    else if (Array.isArray(entry)) entry.forEach((item) => visit(item, key));
    else if (entry && typeof entry === 'object') Object.entries(entry).forEach(([childKey, child]) => visit(child, childKey));
  };
  visit(value);
  return new Set(strings.flatMap((text) => text.split(/(?<=[.!?])\s+/)).map((sentence) => sentence.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).filter((sentence) => sentence.split(/\s+/).length >= 12));
};

describe('similar-intent pages remain distinct in place', () => {
  for (const [gameSlug, slugs] of Object.entries(groups)) {
    it(`${gameSlug} has unique metadata and no shared 12-word supporting sentence`, () => {
      const tools = slugs.map((slug) => publishedTools.find((tool) => tool.game.slug === gameSlug && tool.slug === slug)!);
      expect(tools.every(Boolean)).toBe(true);
      expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
      expect(new Set(tools.map((tool) => tool.description)).size).toBe(tools.length);
      const sentenceSets = slugs.map((slug) => substantiveSentences(calculatorContent[`${gameSlug}/${slug}`]));
      for (let left = 0; left < sentenceSets.length; left += 1) for (let right = left + 1; right < sentenceSets.length; right += 1) {
        expect([...sentenceSets[left]].filter((sentence) => sentenceSets[right].has(sentence)), `${slugs[left]} and ${slugs[right]} share supporting copy`).toEqual([]);
      }
    });
  }

  it('serves purpose-built MM2 and Grow a Garden reference cuts', () => {
    const mm2All = routeCatalog('mm2', 'value-list');
    const knives = routeCatalog('mm2', 'knife-values');
    const godlies = routeCatalog('mm2', 'godly-values');
    const trading = routeCatalog('mm2', 'trading-values');
    expect(mm2All.length).toBeGreaterThanOrEqual(200);
    expect(knives.length).toBeLessThan(mm2All.length);
    expect(knives.every((item) => item.category === 'knife')).toBe(true);
    expect(godlies.length).toBeLessThan(mm2All.length);
    expect(godlies.every((item) => item.rarity === 'godly')).toBe(true);
    expect(trading.every((item) => item.rating > 0 && !item.note.toLowerCase().includes('untradeable'))).toBe(true);
    const prices = routeCatalog('grow-a-garden', 'prices');
    expect(routeCatalog('grow-a-garden', 'items').length).toBeGreaterThan(prices.length);
    expect(routeCatalog('grow-a-garden', 'best-crops')).toHaveLength(20);
  });
});
