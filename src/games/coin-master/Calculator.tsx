import { useEffect, useState } from "preact/hooks";
import rewards from "../../data/coin-master/rewards.json";
import RewardFeed from "../shared/RewardFeed";
import { readLocal, writeLocal } from "../shared/local-progress";
import { calendarProgress, villageBudget } from "./calculate";
export default function CoinCalculator({ toolSlug }: { toolSlug: string }) {
  const [day, setDay] = useState(1),
    [progress, setProgress] = useState(0),
    [date, setDate] = useState(""),
    [message, setMessage] = useState("");
  const [cost, setCost] = useState(1000000),
    [discount, setDiscount] = useState(20),
    [itemOnly, setItemOnly] = useState(false),
    [eligible, setEligible] = useState(200000);
  useEffect(() => {
    const saved = readLocal<unknown>("gc-coin-calendar-v1", null);
    if (
      saved &&
      typeof saved === "object" &&
      "day" in saved &&
      "progress" in saved &&
      "date" in saved
    ) {
      try {
        calendarProgress(Number(saved.day), Number(saved.progress));
        setDay(Number(saved.day));
        setProgress(Number(saved.progress));
        if (
          typeof saved.date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(saved.date)
        )
          setDate(saved.date);
      } catch {}
    }
  }, []);
  if (toolSlug === "free-spins")
    return <RewardFeed records={rewards} game="coin-master" />;
  if (toolSlug === "reward-calendar-tracker") {
    let result;
    try {
      result = calendarProgress(day, progress);
    } catch {}
    return (
      <div class="calculator universal-tool">
        <h2>Track both calendar paths</h2>
        <p>
          The seven-reward cycle and 30-point bar are separate. Enter your
          completed daily position and the progress shown in the game.
        </p>
        <div class="secondary-input-grid">
          <label class="cluster-field">
            Daily position last collected (1–7)
            <input
              type="number"
              min="1"
              max="7"
              value={day}
              onInput={(e) => setDay(e.currentTarget.valueAsNumber)}
            />
          </label>
          <label class="cluster-field">
            30-day bar points (0–30)
            <input
              type="number"
              min="0"
              max="30"
              value={progress}
              onInput={(e) => setProgress(e.currentTarget.valueAsNumber)}
            />
          </label>
          <label class="cluster-field">
            Last claimed date
            <input
              type="date"
              value={date}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </label>
        </div>
        {result ? (
          <div class="primary-result">
            <span>Claims to the 30-point milestone</span>
            <strong>{result.remaining}</strong>
            <p>
              {result.percent.toFixed(1)}% complete · Next daily position:{" "}
              {result.nextDay}
            </p>
            <progress value={result.percent} max="100" />
          </div>
        ) : (
          <p role="alert">
            Use whole-number positions within the displayed ranges.
          </p>
        )}
        <div class="cluster-actions">
          <button
            disabled={!result}
            onClick={() =>
              setMessage(
                writeLocal("gc-coin-calendar-v1", { day, progress, date })
                  ? "Calendar saved in this browser."
                  : "Storage unavailable. Keep a separate note of your calendar.",
              )
            }
          >
            Save calendar
          </button>
          <button
            onClick={() => {
              setDay(1);
              setProgress(0);
              setDate("");
              setMessage(
                writeLocal("gc-coin-calendar-v1", {
                  day: 1,
                  progress: 0,
                  date: "",
                })
                  ? "Local calendar reset."
                  : "Reset for this visit only.",
              );
            }}
          >
            Reset
          </button>
        </div>
        <p role="status">{message}</p>
        <p class="assumption-note">
          Missing a day can reset the daily reward position while preserving the
          monthly bar. Reconcile with the game; this tracker does not
          automatically claim or advance rewards.
        </p>
      </div>
    );
  }
  if (toolSlug === "village-mania-guide") {
    let result;
    try {
      result = villageBudget([itemOnly ? eligible : cost], discount);
    } catch {}
    const valid =
      result &&
      (!itemOnly || eligible <= cost) &&
      Number.isFinite(cost) &&
      cost >= 0;
    return (
      <div class="calculator universal-tool">
        <h2>Test your Village Mania offer</h2>
        <p>
          Enter the building prices shown in your game. The offer may cover one
          item or the whole village.
        </p>
        <div class="secondary-input-grid">
          <label class="cluster-field">
            Total remaining build cost (coins)
            <input
              type="number"
              min="0"
              value={cost}
              onInput={(e) => setCost(e.currentTarget.valueAsNumber)}
            />
          </label>
          <label class="cluster-field">
            Discount percentage
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onInput={(e) => setDiscount(e.currentTarget.valueAsNumber)}
            />
          </label>
          <label class="cluster-field">
            Offer scope
            <select
              value={itemOnly ? "item" : "village"}
              onChange={(e) => setItemOnly(e.currentTarget.value === "item")}
            >
              <option value="village">Whole remaining village</option>
              <option value="item">One eligible item only</option>
            </select>
          </label>
          {itemOnly && (
            <label class="cluster-field">
              Eligible item cost (coins)
              <input
                type="number"
                min="0"
                max={cost}
                value={eligible}
                onInput={(e) => setEligible(e.currentTarget.valueAsNumber)}
              />
            </label>
          )}
        </div>
        {valid && result ? (
          <div class="primary-result">
            <span>Coins to finish with this offer</span>
            <strong>{(cost - result.saved).toLocaleString()}</strong>
            <p>
              {result.saved.toLocaleString()} coins saved on the eligible
              portion
            </p>
          </div>
        ) : (
          <p role="alert">
            Enter valid costs and a discount from 0 to 100. The eligible item
            cannot exceed the total.
          </p>
        )}
        <button
          onClick={() => {
            setCost(1000000);
            setDiscount(20);
            setItemOnly(false);
            setEligible(200000);
          }}
        >
          Reset example
        </button>
      </div>
    );
  }
  return (
    <div class="calculator universal-tool">
      <h2>Choose an official spin source</h2>
      <div class="cluster-cards">
        {[
          [
            "Official reward links",
            "Source-tracked outbound gifts with your own claimed checklist.",
            "/coin-master/free-spins/",
          ],
          [
            "Reward Calendar",
            "Track the seven-position daily cycle and separate 30-point progress bar.",
            "/coin-master/reward-calendar-tracker/",
          ],
          [
            "Publisher spin guide",
            "Read the current requirements for friends, events and other spin sources.",
            "https://support.coinmastergame.com/hc/en-us/articles/4404737856274-How-do-I-get-Spins",
          ],
        ].map(([name, detail, url]) => (
          <article class="cluster-card" key={url}>
            <h3>{name}</h3>
            <p>{detail}</p>
            <a href={url}>Open {name.toLowerCase()} →</a>
          </article>
        ))}
      </div>
    </div>
  );
}
