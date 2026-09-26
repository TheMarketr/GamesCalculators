import { useEffect, useState } from 'preact/hooks';
import { type Reward, type RewardGame, normalizeRewardUrl, rewardFeedView, rewardStatus, relativeCheckTime, uniqueRewards } from './reward-links';
import { readLocal, readClaimed, writeLocal } from './local-progress';

const REFRESH_INTERVAL = 10 * 60_000;
const FOCUS_INTERVAL = 5 * 60_000;

export function validFeed(input: unknown, game: RewardGame): input is { lastCheckedAt: string | null; lastChangedAt: string | null; rewards: Reward[] } {
  if (!input || typeof input !== 'object' || !('rewards' in input) || !Array.isArray(input.rewards)) return false;
  return input.rewards.every((r: unknown) => {
    if (!r || typeof r !== 'object' || !('claimUrl' in r) || !('sourceUrl' in r)) return false;
    const record = r as Record<string, unknown>;
    try {
      normalizeRewardUrl(String(record.claimUrl), game);
      const source = new URL(String(record.sourceUrl));
      return source.protocol === 'https:' && typeof record.id === 'string' && typeof record.label === 'string' &&
        Number.isFinite(Date.parse(String(record.discoveredAt))) && Number.isFinite(Date.parse(String(record.checkedAt)));
    } catch { return false; }
  });
}

export default function RewardFeed({ records, game }: { records: Reward[]; game: RewardGame }) {
  const [items, setItems] = useState<Reward[]>(records);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const [hidden, setHidden] = useState(false);
  const [now, setNow] = useState(0);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(records.map(r => r.checkedAt).sort().at(-1) ?? null);
  const [refreshNote, setRefreshNote] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const key = `gc-${game}-claimed-v1`;

  async function refresh(manual = false) {
    setRefreshing(true);
    try {
      const response = await fetch(`/api/${game}/rewards`, { cache: 'no-store' });
      if (!response.ok) throw new Error('API unavailable');
      const feed: unknown = await response.json();
      if (!validFeed(feed, game)) throw new Error('Invalid feed');
      const next = uniqueRewards(feed.rewards, game).sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt));
      if (next.length || !items.length) setItems(next);
      setLastCheckedAt(feed.lastCheckedAt ?? next.map(r => r.checkedAt).sort().at(-1) ?? lastCheckedAt);
      setRefreshNote(manual ? 'Reward feed refreshed.' : '');
    } catch {
      setRefreshNote('Live refresh is unavailable. Showing the last saved snapshot.');
    } finally {
      setRefreshing(false);
      try { sessionStorage.setItem(`gc-${game}-last-fetch`, String(Date.now())); } catch {}
    }
  }

  useEffect(() => {
    setClaimed(readClaimed(readLocal(key, [])));
    setNow(Date.now());
    void refresh();
    const clock = setInterval(() => setNow(Date.now()), 60_000);
    const timer = setInterval(() => { if (!document.hidden) void refresh(); }, REFRESH_INTERVAL);
    const onFocus = () => {
      let previous = 0;
      try { previous = Number(sessionStorage.getItem(`gc-${game}-last-fetch`)) || 0; } catch {}
      if (Date.now() - previous >= FOCUS_INTERVAL) void refresh();
    };
    document.addEventListener('visibilitychange', onFocus);
    return () => { clearInterval(clock); clearInterval(timer); document.removeEventListener('visibilitychange', onFocus); };
  }, [key]);

  function toggle(id: string) {
    const next = claimed.includes(id) ? claimed.filter(x => x !== id) : [...claimed, id];
    setClaimed(next);
    setStorageError(!writeLocal(key, next));
  }
  const { rows, todayRows, knownAmount, shown, archive, latest } = rewardFeedView(items, game, now, filter, hidden, claimed);
  return <div class="calculator universal-tool reward-feed">
    <h2>{game === 'monopoly-go' ? 'MONOPOLY GO Free Dice Links Today' : 'Coin Master Free Spins & Coins Today'}</h2>
    <div class="reward-summary" aria-label="Reward feed summary">
      <div><span>Last checked</span><strong>{lastCheckedAt ? (now ? relativeCheckTime(lastCheckedAt, now) : lastCheckedAt.slice(0, 10)) : 'Not yet checked'}</strong></div>
      <div><span>Newest listed</span><strong>{latest ? (now ? relativeCheckTime(latest.discoveredAt, now) : latest.discoveredAt.slice(0, 10)) : 'None yet'}</strong></div>
      <div><span>New today</span><strong>{todayRows.length} {todayRows.length === 1 ? 'link' : 'links'}{knownAmount > 0 ? ` · ${knownAmount} known ${game === 'monopoly-go' ? 'dice' : 'spins'}` : ''}</strong></div>
    </div>
    <p class="assumption-note">Listed links are source-tracked, not guaranteed for every account. “Last checked” is a URL check, not an in-game redemption test. Unknown reward amounts are never added to the total.</p>
    <div class="reward-toolbar">
      <div class="reward-filters" role="group" aria-label="Filter rewards">
        {(game === 'coin-master' ? ['all', 'spins', 'coins', 'daily', 'today'] : ['all', 'today', 'dice', 'other']).map(value =>
          <button type="button" class={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'daily' ? 'Daily gifts' : value === 'today' ? 'Today' : value[0].toUpperCase() + value.slice(1)}</button>)}
      </div>
      <label class="reward-hide"><input type="checkbox" checked={hidden} onChange={e => setHidden(e.currentTarget.checked)} /> Hide claimed</label>
      <button type="button" onClick={() => void refresh(true)} disabled={refreshing}>{refreshing ? 'Checking…' : 'Refresh links'}</button>
    </div>
    {refreshNote && <p role="status">{refreshNote}</p>}
    {storageError && <p role="status">Browser storage is unavailable; claimed marks will last only for this visit.</p>}
    <div class="cluster-cards">
      {shown.map(r => <article class={`cluster-card ${claimed.includes(r.id) ? 'cluster-card--claimed' : ''}`} key={r.id}>
        <span class="eyebrow">{now ? rewardStatus(r, now) : 'SOURCE TRACKED'}</span>
        <h3>{r.label}</h3>
        <p>Added <time dateTime={r.discoveredAt}>{now ? relativeCheckTime(r.discoveredAt, now) : r.discoveredAt.slice(0, 10)}</time></p>
        <p>{r.notes}</p>
        <p><a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.source} ↗</a></p>
        <div class="cluster-actions"><a class="button button--primary" href={r.claimUrl} target="_blank" rel="noopener noreferrer">{game === 'monopoly-go' ? 'Claim reward ↗' : 'Collect reward ↗'}</a><button type="button" onClick={() => toggle(r.id)}>{claimed.includes(r.id) ? 'Undo claimed mark' : 'Mark as claimed'}</button></div>
      </article>)}
    </div>
    {!shown.length && <div class="reward-empty"><h3>{filter === 'all' && !rows.some(r => !r.retired) ? (game === 'monopoly-go' ? 'No new source-tracked dice link found yet today.' : 'No new source-tracked reward link found yet today.') : 'No rewards match these filters.'}</h3><p>{lastCheckedAt ? `Last URL check: ${now ? relativeCheckTime(lastCheckedAt, now) : lastCheckedAt.slice(0, 10)}.` : 'No confirmed URL check is available yet.'} Check the recent archive below, or clear your filters.</p>{game === 'monopoly-go' && <p><a href="/monopoly-go/events/">Current events</a> · <a href="/monopoly-go/golden-blitz/">Golden Blitz</a> · <a href="/monopoly-go/tycoon-club/">Tycoon Club</a></p>}</div>}
    <h3>Recently added</h3>
    {archive.length ? <div class="reference-table-wrap"><table><thead><tr><th>Date</th><th>Reward</th><th>Status</th><th>Claim</th></tr></thead><tbody>{archive.map(r => <tr key={r.id}><td><time dateTime={r.discoveredAt}>{r.discoveredAt.slice(0, 10)}</time></td><td>{r.label}</td><td>{now ? rewardStatus(r, now) : r.retired ? 'RETIRED' : 'SOURCE TRACKED'}</td><td>{r.retired ? 'Inactive' : <a href={r.claimUrl} target="_blank" rel="noopener noreferrer">Open ↗</a>}</td></tr>)}</tbody></table></div> : <p>No source-tracked rewards in the recent archive.</p>}
  </div>;
}
