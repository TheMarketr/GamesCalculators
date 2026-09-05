import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const output = path.join(dist, 'og');
const gameNames = new Map([
  ['grow-a-garden', 'Grow a Garden'], ['blox-fruits', 'Blox Fruits'], ['steal-a-brainrot', 'Steal a Brainrot'],
  ['99-nights', '99 Nights in the Forest'], ['adopt-me', 'Adopt Me'], ['mm2', 'Murder Mystery 2'],
  ['pet-simulator-99', 'Pet Simulator 99'], ['minecraft', 'Minecraft'], ['fortnite', 'Fortnite'], ['gta-6', 'GTA VI'],
]);

const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : target.endsWith('.html') ? [target] : [];
}))).flat();
const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const meta = (html, property) => decode(html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, 'i'))?.[1] ?? '');
const wrap = (text, max = 31) => {
  const words = text.split(/\s+/); const lines = []; let line = '';
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines.slice(0, 3);
};
const keyFor = (canonical) => {
  const pathname = new URL(canonical).pathname;
  return pathname === '/' ? 'home' : pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '--');
};
const svgFor = (title, game) => {
  const lines = wrap(title.replace(/\s*\|\s*GamesCalculators.*$/i, ''));
  const titleSvg = lines.map((line, index) => `<text x="88" y="${255 + index * 76}" font-family="Arial, sans-serif" font-size="62" font-weight="800" fill="#f7fbff">${escape(line)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071120"/><stop offset=".55" stop-color="#111936"/><stop offset="1" stop-color="#301474"/></linearGradient><linearGradient id="mark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
    <rect width="1200" height="630" rx="36" fill="url(#bg)"/><circle cx="1065" cy="105" r="210" fill="#22d3ee" opacity=".08"/><circle cx="1060" cy="580" r="280" fill="#8b5cf6" opacity=".12"/>
    <path d="M88 68h64l34 30-34 30H88L54 98z" fill="url(#mark)"/><path d="M88 81h39l16 14h-35v22H88L67 98z" fill="#071120"/>
    <text x="206" y="110" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="#f7fbff">Games<tspan fill="#8b5cf6">Calculators</tspan></text>
    <text x="88" y="194" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="3" fill="#67e8f9">${escape((game || 'FREE GAME TOOLS').toUpperCase())}</text>
    ${titleSvg}<rect x="88" y="544" width="1024" height="2" fill="#7c8aa5" opacity=".35"/><text x="88" y="590" font-family="Arial, sans-serif" font-size="24" fill="#b8c4d9">Free game calculators, references and interactive tools</text>
  </svg>`;
};

await mkdir(output, { recursive: true });
const htmlFiles = await walk(dist);
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const canonical = meta(html, 'og:url');
  if (!canonical) continue;
  const title = meta(html, 'og:title') || 'GamesCalculators';
  const firstPath = new URL(canonical).pathname.split('/').filter(Boolean)[0];
  const svg = svgFor(title, gameNames.get(firstPath));
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  await writeFile(path.join(output, `${keyFor(canonical)}.png`), png);
}
console.log(`Generated ${htmlFiles.length} PNG social cards in ${output}`);
