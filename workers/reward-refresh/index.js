// Hourly Cloudflare Cron: publisher-only candidate discovery, redirect checks,
// and a KV snapshot consumed by the static Pages reward dashboards.
const SOURCES = {
  'monopoly-go': ['https://www.monopolygo.com/news', 'https://www.monopolygo.com/'],
  'coin-master': ['https://coin-master.co/m/Reward-Center2'],
};

export function candidateLinks(game, html) {
  if (game === 'monopoly-go') {
    return [...new Set((html.match(/https:\/\/mply\.io\/[A-Za-z0-9_-]+/g) ?? []))]
      .map(claimUrl => ({ claimUrl, label: 'Official MONOPOLY GO reward', type: 'other', amount: null }));
  }
  const match = html.match(/window\.launchpadData\s*=\s*(\{[^\n]+\})\s*;/);
  if (!match) return [];
  let data;
  try { data = JSON.parse(match[1]); } catch { return []; }
  return (data.buttons ?? []).filter(button => button.is_active === true && button.scheme === 'https' && /^collect your daily gift!?$/i.test(button.title?.trim() ?? '') && /^coin-master\.co\/[A-Za-z0-9_-]+$/.test(button.bitlink ?? ''))
    .map(button => ({ claimUrl: `https://${button.bitlink}`, label: 'Official Coin Master Daily Gift', type: 'other', amount: null }));
}

export function allowedClaim(game, input) {
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
    return game === 'monopoly-go' ? url.hostname === 'mply.io' : url.hostname === 'coin-master.co' || (url.hostname === 'd10xl.com' && url.pathname.startsWith('/coinmaster/'));
  } catch { return false; }
}

export async function checkClaim(game, input, fetcher = fetch) {
  let url = input;
  const visited = new Set();
  for (let hop = 0; hop < 6; hop++) {
    if (!allowedClaim(game, url) || visited.has(url)) return 'unconfirmed';
    visited.add(url);
    const response = await fetcher(url, { redirect: 'manual', headers: { 'User-Agent': 'GamesCalculators reward link checker (https://gamescalculators.com/contact/)' } });
    await response.body?.cancel();
    if (response.status === 404 || response.status === 410) return 'retired';
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) return 'unconfirmed';
      const next = new URL(location, url);
      if (game === 'coin-master' && next.protocol === 'coinmaster:' && next.hostname === 'shop_login') return 'reachable';
      url = next.href;
      continue;
    }
    return response.ok ? 'reachable' : 'unconfirmed';
  }
  return 'unconfirmed';
}

export async function refreshGame(game, kv, fetcher = fetch, now = new Date().toISOString()) {
  const key = `rewards:${game}`;
  const prior = await kv.get(key, 'json');
  const records = Array.isArray(prior?.rewards) ? prior.rewards.map(record => ({ ...record })) : [];
  let checkedSource = false;
  let changed = false;
  for (const sourceUrl of SOURCES[game]) {
    let html;
    try {
      const response = await fetcher(sourceUrl);
      if (!response.ok) continue;
      html = await response.text();
      checkedSource = true;
    } catch { continue; }
    for (const candidate of candidateLinks(game, html)) {
      if (!allowedClaim(game, candidate.claimUrl)) continue;
      const claimUrl = new URL(candidate.claimUrl).href;
      let state;
      try { state = await checkClaim(game, claimUrl, fetcher); } catch { continue; }
      const existing = records.find(record => record.claimUrl === claimUrl);
      if (!existing && state === 'reachable') {
        records.push({ id: `${game}-${new URL(claimUrl).pathname.slice(1)}`, ...candidate, source: game === 'monopoly-go' ? 'MONOPOLY GO official website' : 'Coin Master official Reward Center', sourceUrl, discoveredAt: now, checkedAt: now, notes: 'Publisher entry URL is reachable. Reward quantity and account eligibility are not independently verified.' });
        changed = true;
      } else if (existing && state !== 'unconfirmed') {
        existing.checkedAt = now;
        if (existing.retired !== (state === 'retired')) changed = true;
        existing.retired = state === 'retired';
      }
    }
  }
  // Recheck manual and older sourced records as well; an unconfirmed response
  // does not retire a reward. Only definitive 404/410 does.
  for (const record of records) {
    if (!allowedClaim(game, record.claimUrl) || record.checkedAt === now) continue;
    try {
      const state = await checkClaim(game, record.claimUrl, fetcher);
      if (state === 'unconfirmed') continue;
      record.checkedAt = now;
      if (record.retired !== (state === 'retired')) changed = true;
      record.retired = state === 'retired';
    } catch {}
  }
  if (!checkedSource && !prior) return null;
  const snapshot = { lastCheckedAt: checkedSource ? now : prior.lastCheckedAt, lastChangedAt: changed ? now : prior?.lastChangedAt ?? now, rewards: records.sort((a,b) => b.discoveredAt.localeCompare(a.discoveredAt)) };
  if (JSON.stringify(snapshot) !== JSON.stringify(prior)) await kv.put(key, JSON.stringify(snapshot));
  return snapshot;
}

export default {
  async fetch() {
    return new Response('Scheduled reward refresh worker', { status: 404 });
  },
  async scheduled(_event, env, ctx) {
    if (!env.REWARDS_KV) throw new Error('REWARDS_KV binding is required');
    ctx.waitUntil(Promise.all(['monopoly-go', 'coin-master'].map(game => refreshGame(game, env.REWARDS_KV))));
  },
};
