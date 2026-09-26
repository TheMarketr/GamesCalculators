import { games } from './games';
import { guides } from './guides';

const origin = 'https://gamescalculators.com';
const text = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/[\[\]]/g, '').trim();
const link = (name: string, path: string, note: string) => `- [${text(name)}](${origin}${path}): ${text(note)}`;

/** A curated discovery document, generated from published site configuration. */
export function buildLlmsText(): string {
  const sections = [
    '# GamesCalculators',
    '> Independent game calculators, generators, searchable references and local progress trackers, with tool-specific explanations, worked examples and source links.',
    'Canonical website: https://gamescalculators.com/. GamesCalculators is a fan utility website, not an official game publisher or an account service. Calculators generally run in the browser; saved checklists use browser storage. MONOPOLY GO and Coin Master reward trackers additionally read source-tracked snapshots refreshed by a scheduled service.',
    'Interpretation: distinguish exact formulas, user-entered assumptions, community reference values and estimates. Consult each page’s mechanics, limitations, sources and editorial review date before quoting a result. A deployment date is not a data review date. Community values are not guaranteed trade prices. A reachable reward URL is not proof of successful redemption, reward quantity or account eligibility. GTA VI pre-release references separate confirmed announcements from unknown mechanics; planning estimates are not confirmed game specifications.',
    'The links below lead to public HTML pages with readable supporting content. Interactive calculations require inputs and JavaScript; this document is a discovery aid, not a replacement for the tools, source datasets, sitemap or robots.txt.',
    '## Site navigation\n' + [
      link('Games', '/games/', 'Browse all published game hubs.'),
      link('Tools', '/tools/', 'Search the complete published tool directory.'),
      link('Guides', '/guides/', 'Browse gameplay explanations and planning guides.'),
      link('Sitemap', '/sitemap.xml', 'Complete canonical URL inventory; use for pages not highlighted here.'),
    ].join('\n'),
  ];
  for (const game of games) {
    const selected = [...game.tools.filter(tool => tool.featured), ...game.tools.filter(tool => !tool.featured)].slice(0, 3);
    sections.push(`## ${text(game.name)}\n` + [
      link(`${game.name} hub`, `/${game.slug}/`, game.description),
      ...selected.map(tool => link(tool.name, `/${game.slug}/${tool.slug}/`, `${tool.description} Type: ${tool.toolType}.`)),
    ].join('\n'));
  }
  sections.push('## Guides\n' + guides.map(guide => link(guide.title, `/${guide.slug}/`, guide.description)).join('\n'));
  sections.push('## Optional\n' + [
    link('Data methodology', '/data-methodology/', 'How sources, estimates, local datasets and accuracy limitations are handled.'),
    link('Editorial policy', '/editorial-policy/', 'Editorial standards and review practices.'),
    link('Media credits', '/media-credits/', 'Attribution and original illustration information.'),
    link('Contact', '/contact/', 'Report data or calculation errors.'),
    link('Privacy', '/privacy/', 'Privacy information and browser storage practices.'),
    link('Disclaimer', '/disclaimer/', 'Independence and limitations of site information.'),
  ].join('\n'));
  return sections.join('\n\n') + '\n';
}
