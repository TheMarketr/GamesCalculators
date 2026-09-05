import type { APIRoute } from 'astro';
import { games, publishedTools } from '../data/games';
import { guides } from '../data/guides';
import { legalPages } from '../data/legal';

const siteUrl = 'https://gamescalculators.com';
const latestToolDate = publishedTools.reduce((latest, tool) => tool.lastReviewed > latest ? tool.lastReviewed : latest, '2026-08-20');
const latestGuideDate = guides.reduce((latest, guide) => guide.updated > latest ? guide.updated : latest, '2026-08-27');

const entries = [
  { path: '/', lastmod: latestToolDate, priority: '1.0', frequency: 'weekly' },
  { path: '/games/', lastmod: latestToolDate, priority: '0.9', frequency: 'weekly' },
  { path: '/tools/', lastmod: latestToolDate, priority: '0.9', frequency: 'weekly' },
  { path: '/guides/', lastmod: latestGuideDate, priority: '0.8', frequency: 'weekly' },
  ...games.map((game) => ({ path: `/${game.slug}/`, lastmod: game.tools.reduce((latest, tool) => tool.lastReviewed > latest ? tool.lastReviewed : latest, latestGuideDate), priority: '0.9', frequency: 'weekly' })),
  ...publishedTools.map((tool) => ({ path: `/${tool.game.slug}/${tool.slug}/`, lastmod: tool.lastReviewed, priority: '0.8', frequency: 'weekly' })),
  ...guides.map((guide) => ({ path: `/${guide.slug}/`, lastmod: guide.updated, priority: '0.7', frequency: 'monthly' })),
  ...legalPages.map((page) => ({ path: `/${page.slug}/`, lastmod: '2026-08-27', priority: page.slug === 'data-methodology' ? '0.5' : '0.2', frequency: 'yearly' })),
];

const xmlEscape = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!);

export const GET: APIRoute = () => {
  const urls = entries.map((entry) => `  <url>\n    <loc>${xmlEscape(`${siteUrl}${entry.path}`)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.frequency}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
