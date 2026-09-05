import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = new URL('../src/data/pokemon-go/', import.meta.url);
const reviewed = new Date().toISOString().slice(0, 10);
const source = {
  source: 'PogoAPI normalized Pokémon GO data',
  sourceUrl: 'https://pogoapi.net/',
  sourceType: 'Community-maintained Game Master extraction',
  reviewed,
};

const endpoints = {
  species: 'pokemon_stats.json',
  cpMultipliers: 'cp_multiplier.json',
  evolutions: 'pokemon_evolutions.json',
  powerUpCosts: 'pokemon_powerup_requirements.json',
  fastMoves: 'fast_moves.json',
  chargedMoves: 'charged_moves.json',
  pvpFastMoves: 'pvp_fast_moves.json',
  pvpChargedMoves: 'pvp_charged_moves.json',
  currentMoves: 'current_pokemon_moves.json',
  trainerXp: 'player_xp_requirements.json',
};

const gameMasterUrl = 'https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json';

const slug = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fetchJson = async (file) => {
  const url = `https://pogoapi.net/api/v1/${file}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'GamesCalculators.com static data sync' } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
};

await mkdir(root, { recursive: true });
const raw = Object.fromEntries(await Promise.all(Object.entries(endpoints).map(async ([key, file]) => [key, await fetchJson(file)])));
const gameMasterResponse = await fetch(gameMasterUrl, { headers: { 'User-Agent': 'GamesCalculators.com static data sync' } });
if (!gameMasterResponse.ok) throw new Error(`${gameMasterUrl} returned ${gameMasterResponse.status}`);
const gameMaster = await gameMasterResponse.json();
const playerLevel = gameMaster.find((entry) => entry.templateId === 'PLAYER_LEVEL_SETTINGS')?.data?.playerLevel;
if (!playerLevel?.cpMultiplier?.length || !playerLevel?.requiredExperience?.length) throw new Error('Game Master player-level settings were missing');

const cpmByLevel = new Map(raw.cpMultipliers.map((record) => [record.level, record.multiplier]));
for (let level = 1; level <= 50; level += 1) cpmByLevel.set(level, playerLevel.cpMultiplier[level - 1]);
for (let level = 45.5; level < 50; level += 1) {
  if (!cpmByLevel.has(level)) {
    const lower = cpmByLevel.get(Math.floor(level));
    const upper = cpmByLevel.get(Math.ceil(level));
    cpmByLevel.set(level, Math.sqrt((lower ** 2 + upper ** 2) / 2));
  }
}
const cpMultipliers = [...cpmByLevel.entries()].filter(([level]) => level <= 50).sort((a, b) => a[0] - b[0]).map(([level, multiplier]) => ({ level, multiplier }));
const trainerXp = Object.fromEntries(playerLevel.requiredExperience.slice(0, playerLevel.defaultLevelCap ?? 70).map((xp, index) => [String(index + 1), xp]));

const species = raw.species.map((record) => ({
  id: `${record.pokemon_id}-${slug(record.form || 'normal')}`,
  dex: record.pokemon_id,
  name: record.pokemon_name,
  form: record.form || 'Normal',
  baseAttack: record.base_attack,
  baseDefense: record.base_defense,
  baseStamina: record.base_stamina,
})).filter((record) => record.baseAttack > 0 && record.baseDefense > 0 && record.baseStamina > 0);

const evolutions = raw.evolutions.flatMap((family) => family.evolutions.map((evolution) => ({
  fromId: `${family.pokemon_id}-${slug(family.form || 'normal')}`,
  fromName: family.pokemon_name,
  toId: `${evolution.pokemon_id}-${slug(evolution.form || 'normal')}`,
  toName: evolution.pokemon_name,
  candyRequired: Number.isFinite(evolution.candy_required) ? evolution.candy_required : null,
}))).filter((record) => species.some((item) => item.id === record.fromId) && species.some((item) => item.id === record.toId));

const currentMoveMap = new Map(raw.currentMoves.map((record) => [
  `${record.pokemon_id}-${slug(record.form || 'normal')}`,
  { fast: record.fast_moves ?? [], charged: record.charged_moves ?? [], eliteFast: record.elite_fast_moves ?? [], eliteCharged: record.elite_charged_moves ?? [] },
]));

const payloads = {
  'species.json': { meta: { ...source, unit: 'Pokémon GO base-stat points', notes: 'Alternate forms remain separate records.' }, records: species },
  'cp-multipliers.json': { meta: { ...source, source: 'PokeMiners Game Master and PogoAPI', sourceUrl: gameMasterUrl, unit: 'CP multiplier', notes: 'Integer multipliers come from the current Game Master; half levels use extracted values or the established squared-average interpolation.' }, records: cpMultipliers },
  'evolutions.json': { meta: { ...source, unit: 'Candy', notes: 'Direct evolution edges; special evolution conditions are not inferred.' }, records: evolutions },
  'power-up-costs.json': { meta: { ...source, unit: 'Stardust and Candy per power-up', notes: 'Costs are summed across half-level power-ups.' }, records: raw.powerUpCosts },
  'moves.json': {
    meta: { ...source, unit: 'Damage, energy and milliseconds', notes: 'PvE and PvP records are kept distinct.' },
    records: {
      pveFast: raw.fastMoves,
      pveCharged: raw.chargedMoves,
      pvpFast: raw.pvpFastMoves,
      pvpCharged: raw.pvpChargedMoves,
      bySpecies: Object.fromEntries(currentMoveMap),
    },
  },
  'trainer-xp.json': { meta: { ...source, source: 'PokeMiners Game Master', sourceUrl: gameMasterUrl, unit: 'Trainer XP', notes: `Cumulative XP thresholds through the current Game Master level cap of ${playerLevel.defaultLevelCap ?? Object.keys(trainerXp).length}.` }, records: trainerXp },
};

for (const [file, payload] of Object.entries(payloads)) {
  if (!payload.records || (Array.isArray(payload.records) && payload.records.length === 0)) throw new Error(`${file} normalized to an empty dataset`);
  await writeFile(new URL(file, root), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`wrote ${path.join('src/data/pokemon-go', file)}`);
}
