import { describe, expect, it } from 'vitest';
import { onRequestGet } from '../../../functions/api/[game]/rewards.js';

describe('Pages reward API fallback', () => {
  it('rejects unknown games', async () => expect((await onRequestGet({ params: { game: 'bad' }, env: {} })).status).toBe(404));
  it('reports unavailable KV so the static page can remain visible', async () => expect((await onRequestGet({ params: { game: 'monopoly-go' }, env: {} })).status).toBe(503));
  it('serves a dated KV snapshot', async () => {
    const state = { lastCheckedAt: '2026-09-25T12:00:00Z', lastChangedAt: '2026-09-25T12:00:00Z', rewards: [] };
    const response = await onRequestGet({ params: { game: 'coin-master' }, env: { REWARDS_KV: { get: async () => state } } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(state);
  });
});
