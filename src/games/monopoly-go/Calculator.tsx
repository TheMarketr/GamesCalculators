import { useEffect, useState } from "preact/hooks";
import events from "../../data/monopoly-go/events.json";
import { monopolyTopics } from "../../data/monopoly-go/topics";
import { safeProgress, partnerProgress, eventStatus } from "./calculate";
import { readLocal, writeLocal } from "../shared/local-progress";

export default function MonopolyCalculator({ toolSlug }: { toolSlug: string }) {
  const [stars, setStars] = useState(350),
    [target, setTarget] = useState(toolSlug === "partner-event" ? 80000 : 700),
    [rate, setRate] = useState(50);
  const [yours, setYours] = useState(25000),
    [partner, setPartner] = useState(30000),
    [query, setQuery] = useState("");
  const [claims, setClaims] = useState<Record<string, number>>({}),
    [now, setNow] = useState(0),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    setNow(Date.now());
    const saved = readLocal<unknown>("gc-mgo-club-v1", {});
    if (saved && typeof saved === "object" && !Array.isArray(saved))
      setClaims(
        Object.fromEntries(
          Object.entries(saved).filter(
            ([, v]) => typeof v === "number" && Number.isFinite(v),
          ),
        ),
      );
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const numberField = (
    label: string,
    value: number,
    set: (n: number) => void,
    min = 0,
  ) => (
    <label class="cluster-field">
      {label}
      <input
        type="number"
        min={min}
        value={value}
        onInput={(e) => set(e.currentTarget.valueAsNumber)}
      />
    </label>
  );
  const mark = (id: string) => {
    const next = { ...claims };
    if (next[id]) delete next[id];
    else next[id] = Date.now();
    setClaims(next);
    setStorageError(!writeLocal("gc-mgo-club-v1", next));
  };
  if (toolSlug === "sticker-safe-calculator") {
    let result;
    try {
      result = safeProgress(stars, target, rate);
    } catch {}
    return (
      <div class="calculator universal-tool">
        <h2>Plan your next sticker safe</h2>
        <div class="secondary-input-grid">
          {numberField("Current sticker stars", stars, setStars)}
          {numberField("Target safe cost in stars", target, setTarget, 1)}
          {numberField("Estimated stars earned per day", rate, setRate)}
        </div>
        {result ? (
          <div class="primary-result">
            <span>Stars still needed</span>
            <strong>{result.remaining.toLocaleString()}</strong>
            <p>
              {result.percent.toFixed(1)}% complete ·{" "}
              {result.days === null
                ? "Enter a daily rate to estimate time"
                : `${result.days} estimated days`}
            </p>
            <progress value={result.percent} max="100" />
          </div>
        ) : (
          <p role="alert">
            Enter valid nonnegative values and a safe cost above zero.
          </p>
        )}
        <p class="assumption-note">
          700 stars is an editable example target. Use the cost displayed in
          your current album; no safe reward or seasonal threshold is assumed.
        </p>
        <button
          onClick={() => {
            setStars(350);
            setTarget(700);
            setRate(50);
          }}
        >
          Reset example
        </button>
      </div>
    );
  }
  if (toolSlug === "tycoon-club")
    return (
      <div class="calculator universal-tool">
        <h2>Your Tycoon Club reward checklist</h2>
        <p>
          Open the official website to collect. Mark a reward here only after
          receiving it there.
        </p>
        <a
          class="button button--primary"
          href="https://www.monopolygo.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open official Tycoon Club ↗
        </a>
        <div class="cluster-cards">
          {[
            ["wheel", "Daily Wheel"],
            ["gift", "Shop gift"],
          ].map(([id, title]) => (
            <article class="cluster-card" key={id}>
              <h3>{title}</h3>
              <p>
                {claims[id]
                  ? `Marked ${new Date(claims[id]).toLocaleString()}`
                  : "Not marked as collected"}
              </p>
              {claims[id] && now > 0 && (
                <p>
                  {Math.max(
                    0,
                    Math.ceil((claims[id] + 86400000 - now) / 3600000),
                  )}{" "}
                  hours until your 24-hour reminder
                </p>
              )}
              <button onClick={() => mark(id)}>
                {claims[id] ? "Clear checkmark" : "Mark collected"}
              </button>
            </article>
          ))}
        </div>
        <p class="assumption-note">
          The reminder starts from your checkmark. The official reward timer
          determines actual availability.
        </p>
        {storageError && (
          <p role="alert">
            Browser storage is unavailable. This checklist will not survive a
            reload.
          </p>
        )}
      </div>
    );
  if (toolSlug === "wiki")
    return (
      <div class="calculator universal-tool">
        <h2>Find a board, sticker or reward topic</h2>
        <label class="cluster-field">
          Search MONOPOLY GO topics
          <input
            type="search"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
        </label>
        <div class="cluster-cards">
          {monopolyTopics
            .filter((t) =>
              `${t.name} ${t.detail}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((t) => (
              <article class="cluster-card" key={t.name}>
                <h3>{t.name}</h3>
                <p>{t.detail}</p>
                <a href={t.href}>Explore this topic →</a>
              </article>
            ))}
        </div>
        {!monopolyTopics.some((t) =>
          `${t.name} ${t.detail}`.toLowerCase().includes(query.toLowerCase()),
        ) && <p>No matching topic. Try “stickers” or “partners”.</p>}
      </div>
    );
  if (toolSlug === "partner-event") {
    let result;
    try {
      result = partnerProgress(target, yours, partner);
    } catch {}
    return (
      <div class="calculator universal-tool">
        <h2>Plan one Partner attraction</h2>
        <p class="assumption-note">
          No current Partner event is confirmed in this snapshot. This points
          planner uses the target you read in your game.
        </p>
        <div class="secondary-input-grid">
          {numberField("Attraction target points", target, setTarget, 1)}
          {numberField("Your contribution in points", yours, setYours)}
          {numberField("Partner contribution in points", partner, setPartner)}
        </div>
        {result ? (
          <div class="primary-result">
            <span>Attraction points remaining</span>
            <strong>{result.remaining.toLocaleString()}</strong>
            <p>
              {result.percent.toFixed(1)}% complete ·{" "}
              {result.yourHalfRemaining.toLocaleString()} points to your 50%
              share
            </p>
          </div>
        ) : (
          <p role="alert">Enter valid point totals.</p>
        )}
        <p>
          Example target only. Points are not Partner Currency; wheel outcomes
          do not have a fixed currency-to-points conversion.
        </p>
        <button
          onClick={() => {
            setTarget(80000);
            setYours(25000);
            setPartner(30000);
          }}
        >
          Reset example
        </button>
      </div>
    );
  }
  const blitz = toolSlug === "golden-blitz";
  return (
    <div class="calculator universal-tool">
      <h2>{blitz ? "Golden Blitz status" : "Confirmed event schedule"}</h2>
      <p class="assumption-note">
        {blitz
          ? "No confirmed upcoming Golden Blitz found."
          : "No active or upcoming event is confirmed in this local schedule. Check the official game announcements for newly released events."}
      </p>
      <a
        href="https://www.monopolygo.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Official MONOPOLY GO announcements ↗
      </a>
      {blitz ? (
        <div class="cluster-cards">
          <article class="cluster-card">
            <h3>Check the selected Gold Stickers</h3>
            <p>
              Only the stickers named in a Blitz become tradable. A Gold Sticker
              outside that selection remains locked.
            </p>
          </article>
          <article class="cluster-card">
            <h3>Prepare the exchange</h3>
            <p>
              Compare the sticker names with your album and agree a trade before
              the event closes. Approve the actual in-game offer.
            </p>
          </article>
        </div>
      ) : (
        <>
          <h3>Confirmed event archive</h3>
          <p>
            These are ended events, retained for context. Times switch to your
            device timezone after loading.
          </p>
          {events.map((event) => (
            <article class="cluster-card" key={event.id}>
              <strong>{event.name}</strong>
              <p>
                {now ? eventStatus(event.startUtc, event.endUtc, now) : "ENDED"}
              </p>
              <p>
                <time dateTime={event.startUtc}>
                  {now
                    ? new Date(event.startUtc).toLocaleString()
                    : event.startUtc}
                </time>{" "}
                –{" "}
                <time dateTime={event.endUtc}>
                  {now ? new Date(event.endUtc).toLocaleString() : event.endUtc}
                </time>
              </p>
              <p>{event.rewards}</p>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.source}
              </a>
            </article>
          ))}
        </>
      )}
    </div>
  );
}
