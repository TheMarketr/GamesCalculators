const GAMES = new Set(['monopoly-go', 'coin-master']);

export async function onRequestGet({ params, env }) {
  const game = params.game;
  if (!GAMES.has(game)) return new Response('Not found', { status: 404 });
  if (!env.REWARDS_KV) return Response.json({ error: 'Live feed unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  try {
    const state = await env.REWARDS_KV.get(`rewards:${game}`, 'json');
    if (!state || !Array.isArray(state.rewards)) return Response.json({ error: 'No feed snapshot' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ lastCheckedAt: state.lastCheckedAt ?? null, lastChangedAt: state.lastChangedAt ?? null, rewards: state.rewards }, { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return Response.json({ error: 'Live feed unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
