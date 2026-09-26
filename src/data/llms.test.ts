import { describe, expect, it } from 'vitest';
import { buildLlmsText } from './llms';
import { games, publishedTools } from './games';
import { guides } from './guides';
import { legalPages } from './legal';

describe('llms.txt discovery document', () => {
  const document = buildLlmsText();
  const urls = [...document.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]);
  it('has a site heading, summary and concise Markdown sections', () => {
    expect(document).toMatch(/^# GamesCalculators\n\n> /);
    expect(document).toContain('## Optional');
    expect(document.length).toBeLessThan(35_000);
    expect(document).not.toMatch(/localhost|pages\.dev|\{\{|TODO|placeholder/i);
  });
  it('links only to published canonical routes without duplicates', () => {
    const paths = new Set(['/games/', '/tools/', '/guides/', '/sitemap.xml',
      ...games.map(game => `/${game.slug}/`),
      ...publishedTools.map(tool => `/${tool.game.slug}/${tool.slug}/`),
      ...guides.map(guide => `/${guide.slug}/`),
      ...legalPages.map(page => `/${page.slug}/`)]);
    expect(new Set(urls).size).toBe(urls.length);
    for (const value of urls) {
      const url = new URL(value);
      expect(url.origin).toBe('https://gamescalculators.com');
      expect(paths.has(url.pathname), value).toBe(true);
    }
  });
  it('covers every game and distinguishes unverified reward claims', () => {
    for (const game of games) expect(document).toContain(`https://gamescalculators.com/${game.slug}/`);
    expect(document).toContain('not proof of successful redemption');
    expect(document).toContain('deployment date is not a data review date');
  });
});
