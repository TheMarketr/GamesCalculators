import { mkdir, readFile, writeFile } from 'node:fs/promises';

const reviewed = new Date().toISOString().slice(0, 10);
const headers = { 'User-Agent': 'GamesCalculators.com static data sync (https://gamescalculators.com/contact/)' };
const fetchText = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
};

const palsUrl = 'https://raw.githubusercontent.com/helios57/palworld/main/data/pals.json';
const combosUrl = 'https://raw.githubusercontent.com/helios57/palworld/main/data/special_combos.json';
const api = 'https://palworld.wiki.gg/api.php?action=parse&prop=wikitext&format=json&page=';
const [palsResponse, combosResponse, statsResponse, existingText] = await Promise.all([
  fetchText(palsUrl),
  fetchText(combosUrl),
  fetchText(`${api}Pal_Stats`),
  readFile(new URL('../src/data/palworld/pals.json', import.meta.url), 'utf8'),
]);
const breedingPals = JSON.parse(palsResponse);
const specialCombos = JSON.parse(combosResponse);
const existingPals = JSON.parse(existingText).records;
const wikiText = JSON.parse(statsResponse).parse?.wikitext?.['*'];
if (!wikiText) throw new Error('Palworld Wiki Pal Stats page did not return wikitext');
const statRows = [...wikiText.matchAll(/^\|\s*([^|\n]+?)\s*\|\|\s*([^|\n]+?)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|\s*(\d+)\s*$/gm)].map((match) => ({
  number: match[1].trim(),
  name: match[2].trim(),
  baseHp: Number(match[3]),
  baseAttack: Number(match[4]),
  baseDefense: Number(match[5]),
}));

if (Object.keys(breedingPals).length < 250 || specialCombos.length < 100 || statRows.length < 150) {
  throw new Error(`Unexpected Palworld dataset size: ${Object.keys(breedingPals).length} pals, ${specialCombos.length} special combos, ${statRows.length} stats`);
}

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const statByName = new Map(statRows.map((row) => [normalizeName(row.name), row]));
const existingByName = new Map(existingPals.map((pal) => [normalizeName(pal.name), pal]));
const slug = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const records = Object.entries(breedingPals).map(([name, pal], order) => {
  const existing = existingByName.get(normalizeName(name));
  const stat = statByName.get(normalizeName(name));
  return {
    id: existing?.id ?? slug(name),
    bpClass: existing?.bpClass ?? slug(name),
    name,
    number: String(pal.paldeck),
    breedingPower: Number(pal.combi_rank),
    rarity: existing?.rarity ?? 0,
    maleProbability: existing?.maleProbability ?? 50,
    elements: pal.elements ?? existing?.elements ?? [],
    order,
    isBoss: existing?.isBoss ?? false,
    regularEligible: Boolean(pal.in_generic_pool),
    baseHp: stat?.baseHp ?? existing?.baseHp ?? null,
    baseAttack: stat?.baseAttack ?? existing?.baseAttack ?? null,
    baseDefense: stat?.baseDefense ?? existing?.baseDefense ?? null,
  };
});
const idByName = new Map(records.map((pal) => [normalizeName(pal.name), pal.id]));
const normalizedCombos = specialCombos.map((combo) => ({
  parentAId: idByName.get(normalizeName(combo.parent_a)),
  parentBId: idByName.get(normalizeName(combo.parent_b)),
  childId: idByName.get(normalizeName(combo.child)),
  parentAGender: null,
  parentBGender: null,
}));
if (normalizedCombos.some((combo) => !combo.parentAId || !combo.parentBId || !combo.childId)) throw new Error('A Palworld special combination referenced an unknown Pal');

const out = new URL('../src/data/palworld/', import.meta.url);
await mkdir(out, { recursive: true });
const common = {
  reviewed,
  sourceType: 'Community-maintained extraction of current game data',
  unit: 'Palworld breeding rank or species stat points',
};
await writeFile(new URL('pals.json', out), `${JSON.stringify({
  meta: { ...common, source: 'Palworld 1.0 breeding-data export and Palworld Wiki', sourceUrl: 'https://github.com/helios57/palworld', notes: 'Palworld 1.0 CombiRank records are normalized locally. Stable IDs keep existing species links intact; missing stat fields are excluded from stat-tool selects.' },
  records,
}, null, 2)}\n`);
await writeFile(new URL('special-breeding.json', out), `${JSON.stringify({
  meta: { ...common, source: 'Palworld 1.0 special-combination export', sourceUrl: 'https://github.com/helios57/palworld', notes: 'Special combinations override the normal rank calculation; same-species breeding is handled directly by the calculator.' },
  records: normalizedCombos,
}, null, 2)}\n`);
console.log(`wrote ${records.length} Pals and ${normalizedCombos.length} special combinations`);
