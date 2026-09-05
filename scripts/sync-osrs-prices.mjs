import { mkdir, writeFile } from 'node:fs/promises';

const reviewed = new Date().toISOString().slice(0, 10);
const headers = { 'User-Agent': 'GamesCalculators.com static price sync (https://gamescalculators.com/contact/)' };
const fetchJson = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
};

const [mapping, latest] = await Promise.all([
  fetchJson('https://prices.runescape.wiki/api/v1/osrs/mapping'),
  fetchJson('https://prices.runescape.wiki/api/v1/osrs/latest'),
]);
const records = mapping.filter((item) => item.highalch > 0 && latest.data[String(item.id)]).map((item) => {
  const price = latest.data[String(item.id)];
  return {
    id: item.id,
    name: item.name,
    examine: item.examine,
    members: item.members,
    buyLimit: item.limit ?? null,
    highAlch: item.highalch,
    lowAlch: item.lowalch,
    highPrice: price.high,
    lowPrice: price.low,
    highTime: price.highTime,
    lowTime: price.lowTime,
  };
}).sort((a, b) => a.name.localeCompare(b.name));

if (records.length < 1000) throw new Error(`Expected at least 1,000 priced alch items; received ${records.length}`);
await mkdir(new URL('../src/data/osrs/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/osrs/ge-prices.json', import.meta.url), `${JSON.stringify({
  meta: {
    source: 'OSRS Wiki Real-time Prices API',
    sourceUrl: 'https://oldschool.runescape.wiki/w/RuneScape:Real-time_Prices',
    sourceType: 'Community-maintained live Grand Exchange snapshot',
    reviewed,
    snapshotTimestamp: new Date().toISOString(),
    unit: 'coins',
    notes: 'The production calculator reads this local snapshot and never calls the price API at runtime.',
  },
  records,
}, null, 2)}\n`);
console.log(`wrote ${records.length} OSRS price records`);
