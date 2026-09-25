import { useEffect, useState } from "preact/hooks";
import {
  type Reward,
  type RewardGame,
  rewardStatus,
  relativeCheckTime,
} from "./reward-links";
import { readLocal, readClaimed, writeLocal } from "./local-progress";
export default function RewardFeed({
  records,
  game,
}: {
  records: Reward[];
  game: RewardGame;
}) {
  const [claimed, setClaimed] = useState<string[]>([]),
    [filter, setFilter] = useState("all"),
    [hidden, setHidden] = useState(false),
    [now, setNow] = useState(0),
    [error, setError] = useState("");
  const key = `gc-${game}-claimed-v1`;
  useEffect(() => {
    setClaimed(readClaimed(readLocal(key, [])));
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [key]);
  function toggle(id: string) {
    const next = claimed.includes(id)
      ? claimed.filter((x) => x !== id)
      : [...claimed, id];
    setClaimed(next);
    if (!writeLocal(key, next))
      setError(
        "Storage is unavailable; your checkmarks will last only for this visit.",
      );
  }
  const shown = records.filter(
    (r) =>
      (!hidden || !claimed.includes(r.id)) &&
      (filter === "all" ||
        (filter === "today" &&
          now > 0 &&
          new Date(r.discoveredAt).toDateString() ===
            new Date(now).toDateString()) ||
        filter === r.type),
  );
  return (
    <div class="calculator universal-tool">
      <h2>Official reward links</h2>
      <p>
        Last URL check:{" "}
        {records.length
          ? now
            ? relativeCheckTime(
                records
                  .map((r) => r.checkedAt)
                  .sort()
                  .at(-1)!,
                now,
              )
            : records
                .map((r) => r.checkedAt)
                .sort()
                .at(-1)!
                .slice(0, 10)
          : "No links checked yet"}
        . In-game availability is not independently confirmed.
      </p>
      <p>
        Open the reward in the game, then mark your own collection status. URL
        reachability does not establish in-game eligibility.
      </p>
      <div class="cluster-actions">
        <label class="cluster-field">
          Reward type
          <select
            value={filter}
            onChange={(e) => setFilter(e.currentTarget.value)}
          >
            <option value="all">All rewards</option>
            {(game === "coin-master"
              ? ["spins", "coins", "other"]
              : ["dice", "sticker", "token", "other"]
            ).map((t) => (
              <option value={t}>{t}</option>
            ))}
            <option value="today">Added today</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.currentTarget.checked)}
          />{" "}
          Hide marked rewards
        </label>
      </div>
      <div class="cluster-cards">
        {shown.map((r) => (
          <article
            class={`cluster-card ${claimed.includes(r.id) ? "cluster-card--claimed" : ""}`}
            key={r.id}
          >
            <span class="eyebrow">
              {now ? rewardStatus(r, now) : "SOURCE CHECKED"}
            </span>
            <h3>{r.label}</h3>
            <p>
              Added{" "}
              <time dateTime={r.discoveredAt}>
                {now
                  ? relativeCheckTime(r.discoveredAt, now)
                  : r.discoveredAt.slice(0, 10)}
              </time>
            </p>
            <p>
              Last URL check:{" "}
              <time dateTime={r.checkedAt}>
                {now
                  ? new Date(r.checkedAt).toLocaleString()
                  : r.checkedAt.slice(0, 10) + " UTC"}
              </time>
            </p>
            <p>
              <a href={r.sourceUrl} rel="noopener noreferrer" target="_blank">
                {r.source}
              </a>
            </p>
            <p>{r.notes}</p>
            <div class="cluster-actions">
              {!r.retired && (
                <a
                  class="button button--primary"
                  href={r.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open official reward ↗
                </a>
              )}
              <button onClick={() => toggle(r.id)}>
                {claimed.includes(r.id)
                  ? "Undo claimed mark"
                  : "Mark as claimed"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {!shown.length && (
        <p>
          No rewards match these filters. Select All rewards or show marked
          rewards.
        </p>
      )}
      {error && <p role="status">{error}</p>}
    </div>
  );
}
