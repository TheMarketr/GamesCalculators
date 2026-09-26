import { describe, expect, it } from 'vitest';
import { allowedClaim, candidateLinks, checkClaim, refreshGame } from './index.js';

describe('scheduled reward refresh', () => {
  it('discovers only publisher-hosted short links', () => {
    expect(candidateLinks('monopoly-go', 'https://mply.io/abc and https://mply.io/abc')).toHaveLength(1);
    expect(candidateLinks('coin-master', 'other text')).toEqual([]);
    expect(allowedClaim('monopoly-go', 'https://mply.io.evil.test/a')).toBe(false);
  });
  it('keeps the recurring Coin Master daily gift and excludes social subscriptions', () => {
    const html = 'window.launchpadData = '+JSON.stringify({ buttons: [
      { title: 'COLLECT YOUR DAILY GIFT!', is_active: true, scheme: 'https', bitlink: 'coin-master.co/abc' },
      { title: 'JOIN OUR WHATSAPP CHANNEL!', is_active: true, scheme: 'https', bitlink: 'coin-master.co/other' },
    ]})+';';
    expect(candidateLinks('coin-master', html)).toEqual([{ claimUrl: 'https://coin-master.co/abc', label: 'Official Coin Master Daily Gift', type: 'other', amount: null }]);
  });
  it('distinguishes retired from temporarily unconfirmed URLs', async () => {
    expect(await checkClaim('monopoly-go', 'https://mply.io/a', async () => new Response(null, { status: 410 }))).toBe('retired');
    expect(await checkClaim('monopoly-go', 'https://mply.io/a', async () => new Response(null, { status: 403 }))).toBe('unconfirmed');
    expect(await checkClaim('coin-master', 'https://coin-master.co/a', async () => new Response(null, { status: 302, headers: { location: 'coinmaster://shop_login?page=deals' } }))).toBe('reachable');
  });
  it('writes a nonblank zero-link snapshot when official source is checked', async () => {
    const writes = [];
    const kv = { get: async () => null, put: async (key, value) => writes.push({ key, value }) };
    const result = await refreshGame('monopoly-go', kv, async () => new Response('<html>no reward links</html>'), '2026-09-25T12:00:00Z');
    expect(result.rewards).toEqual([]);
    expect(result.lastCheckedAt).toBe('2026-09-25T12:00:00Z');
    expect(writes).toHaveLength(1);
  });
  it('preserves the prior snapshot after a source failure', async () => {
    const prior = { lastCheckedAt: '2026-09-24T12:00:00Z', lastChangedAt: '2026-09-24T12:00:00Z', rewards: [] };
    const writes = [];
    const kv = { get: async () => prior, put: async (...args) => writes.push(args) };
    const result = await refreshGame('monopoly-go', kv, async () => { throw Error('offline'); }, '2026-09-25T12:00:00Z');
    expect(result.lastCheckedAt).toBe(prior.lastCheckedAt);
    expect(writes).toHaveLength(0);
  });
});
