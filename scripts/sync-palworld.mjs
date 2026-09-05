import { mkdir, writeFile } from 'node:fs/promises';

const reviewed = new Date().toISOString().slice(0, 10);
const headers = { 'User-Agent': 'GamesCalculators.com static data sync (https://gamescalculators.com/contact/)' };
const fetchText = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
};

const breedingUrl = 'https://raw.githubusercontent.com/Ashwin-z/Tool---Site/main/tool-site/src/lib/palworld-breeding-data.ts';
const api = 'https://palworld.wiki.gg/api.php?action=parse&prop=wikitext&format=json&page=';
const [breedingSource, statsResponse] = await Promise.all([
  fetchText(breedingUrl),
  fetchText(`${api}Pal_Stats`),
]);

const extractArray = (name) => {
  const match = breedingSource.match(new RegExp(`export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`));
  if (!match) throw new Error(`Could not find ${name} in Palworld breeding source`);
  return JSON.parse(match[1]);
};

const breedingPals = extractArray('palworldPals');
const specialCombos = extractArray('palworldSpecialCombos');
const wikiText = JSON.parse(statsResponse).parse?.wikitext?.['*'];
if (!wikiText) throw new Error('Palworld Wiki Pal Stats page did not return wikitext');
const statRows = [...wikiText.matchAll(/^\|\s*([^|\n]+?)\s*\|\|\s*([^|\n]+?)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*$/gm)].map((match) => ({
  number: match[1].trim(),
  name: match[2].trim(),
  baseHp: Number(match[3]),
  baseAttack: Number(match[4]),
  baseDefense: Number(match[5]),
}));

if (breedingPals.length < 150 || specialCombos.length < 20 || statRows.length < 150) {
  throw new Error(`Unexpected Palworld dataset size: ${breedingPals.length} pals, ${specialCombos.length} special combos, ${statRows.length} stats`);
}

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const statByName = new Map(statRows.map((row) => [normalizeName(row.name), row]));
const records = breedingPals.map((pal) => {
  const stat = statByName.get(normalizeName(pal.name));
  return {
    ...pal,
    baseHp: stat?.baseHp ?? null,
    baseAttack: stat?.baseAttack ?? null,
    baseDefense: stat?.baseDefense ?? null,
  };
});

const out = new URL('../src/data/palworld/', import.meta.url);
await mkdir(out, { recursive: true });
const common = {
  reviewed,
  sourceType: 'Community-maintained extraction of current game data',
  unit: 'Palworld breeding rank or species stat points',
};
await writeFile(new URL('pals.json', out), `${JSON.stringify({
  meta: { ...common, source: 'Palworld Wiki and reviewed breeding data export', sourceUrl: 'https://palworld.wiki.gg/wiki/Breeding', notes: 'Stable IDs keep subspecies and boss records distinct. Missing stat fields are excluded from stat-tool selects.' },
  records,
}, null, 2)}\n`);
await writeFile(new URL('special-breeding.json', out), `${JSON.stringify({
  meta: { ...common, source: 'Palworld Wiki breeding rules', sourceUrl: 'https://palworld.wiki.gg/wiki/Breeding', notes: 'Special combinations override the normal rank calculation.' },
  records: specialCombos,
}, null, 2)}\n`);
console.log(`wrote ${records.length} Pals and ${specialCombos.length} special combinations`);
