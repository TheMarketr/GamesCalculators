import { useEffect, useState } from "preact/hooks";
import { sensitivityGames } from "../../data/valorant/sensitivity-games";
import { rankPlan, sensitivityResult } from "./calculate";
import {
  crosshairProfiles,
  parseCrosshair,
  serializeCrosshair,
  colors,
  type Crosshair,
} from "./crosshair";
import CrosshairPreview from "./CrosshairPreview";

function Crosshairs({ mode }: { mode: string }) {
  const [s, setS] = useState<Crosshair>({ ...crosshairProfiles[0].settings }),
    [code, setCode] = useState(""),
    [copyFallback, setCopyFallback] = useState(""),
    [message, setMessage] = useState(""),
    [background, setBackground] = useState("dark"),
    [style, setStyle] = useState("All"),
    [priority, setPriority] = useState("All"),
    [color, setColor] = useState("All"),
    [outline, setOutline] = useState("All"),
    [dot, setDot] = useState("All");
  useEffect(() => {
    const value = new URLSearchParams(location.search).get("code");
    if (value) {
      try {
        setS(parseCrosshair(value));
        setCode(value);
      } catch (error) {
        setMessage((error as Error).message);
      }
    }
  }, []);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFallback("");
      setMessage("Copied to clipboard.");
    } catch {
      setCopyFallback(value);
      setMessage("Clipboard unavailable. Select and copy the text field.");
    }
  }
  const gallery = mode === "crosshair-codes" || mode === "best-crosshairs";
  const update = (key: keyof Crosshair, value: number | string) => {
    setCode("");
    setS((previous) => ({ ...previous, [key]: value }));
  };
  const slider = (key: keyof Crosshair, label: string, max = 20, step = 1) => (
    <label class="cluster-field">
      {label}
      <input
        type="range"
        min="0"
        max={max}
        step={step}
        value={s[key]}
        onInput={(e) => update(key, e.currentTarget.valueAsNumber)}
      />
      <output>{s[key]}</output>
    </label>
  );
  const check = (key: keyof Crosshair, label: string) => (
    <label class="cluster-toggle">
      <input
        type="checkbox"
        checked={!!s[key]}
        onChange={(e) => update(key, Number(e.currentTarget.checked))}
      />
      {label}
    </label>
  );
  return (
    <div class="calculator universal-tool">
      <h2>
        {mode === "best-crosshairs"
          ? "Find a profile for your preferences"
          : gallery
            ? "Browse original crosshair profiles"
            : "Build your primary crosshair"}
      </h2>
      <p>
        Original practice profiles, with a static enlarged preview. Import
        supports primary 0;P profiles; advanced ADS and sniper sections are
        rejected with an explanation.
      </p>
      {gallery ? (
        <>
          <div class="secondary-input-grid">
            <label class="cluster-field">
              Style
              <select
                value={style}
                onChange={(e) => setStyle(e.currentTarget.value)}
              >
                {[
                  "All",
                  "Dot",
                  "Circle",
                  "Classic",
                  "Small",
                  "Medium",
                  "Large",
                ].map((v) => (
                  <option>{v}</option>
                ))}
              </select>
            </label>
            <label class="cluster-field">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.currentTarget.value)}
              >
                {["All", "Precision", "Visibility", "Minimal obstruction"].map(
                  (v) => (
                    <option>{v}</option>
                  ),
                )}
              </select>
            </label>
            <label class="cluster-field">
              Color
              <select
                value={color}
                onChange={(e) => setColor(e.currentTarget.value)}
              >
                <option>All</option>
                {colors.map((v, i) => (
                  <option value={String(i)}>{v}</option>
                ))}
              </select>
            </label>
            <label class="cluster-field">
              Outline
              <select
                value={outline}
                onChange={(e) => setOutline(e.currentTarget.value)}
              >
                {["All", "Yes", "No"].map((v) => (
                  <option>{v}</option>
                ))}
              </select>
            </label>
            <label class="cluster-field">
              Center dot
              <select
                value={dot}
                onChange={(e) => setDot(e.currentTarget.value)}
              >
                {["All", "Yes", "No"].map((v) => (
                  <option>{v}</option>
                ))}
              </select>
            </label>
          </div>
          <div class="cluster-cards">
            {crosshairProfiles
              .filter(
                (p) =>
                  (style === "All" || p.style === style) &&
                  (priority === "All" || p.priority === priority) &&
                  (color === "All" || String(p.settings.c) === color) &&
                  (outline === "All" ||
                    !!p.settings.h === (outline === "Yes")) &&
                  (dot === "All" || !!p.settings.d === (dot === "Yes")),
              )
              .map((p) => (
                <article class="cluster-card" key={p.id}>
                  <CrosshairPreview settings={p.settings} />
                  <h3>{p.name}</h3>
                  <p>
                    {p.priority} · {p.note}
                  </p>
                  <code class="cluster-code">
                    {serializeCrosshair(p.settings)}
                  </code>
                  <div class="cluster-actions">
                    <button
                      onClick={() => copy(serializeCrosshair(p.settings))}
                    >
                      Copy code
                    </button>
                    <a
                      href={`/valorant/crosshair/?code=${encodeURIComponent(serializeCrosshair(p.settings))}`}
                    >
                      Edit profile →
                    </a>
                  </div>
                </article>
              ))}
          </div>
          <p>
            Matching profiles appear above. If none match, broaden a filter; the
            finder does not invent a new recommendation.
          </p>
          <button
            onClick={() => {
              setStyle("All");
              setPriority("All");
              setColor("All");
              setOutline("All");
              setDot("All");
            }}
          >
            Reset filters
          </button>
        </>
      ) : (
        <>
          <div class="crosshair-editor">
            <div>
              <CrosshairPreview settings={s} background={background} />
              <label class="cluster-field">
                Preview background
                <select
                  value={background}
                  onChange={(e) => setBackground(e.currentTarget.value)}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="practice">Practice grid</option>
                </select>
              </label>
              <p>
                Preview enlarged up to 3× to fit. Movement and firing flags are
                saved in the code; weapon spread is not simulated.
              </p>
              <div class="cluster-actions">
                <button onClick={() => copy(serializeCrosshair(s))}>
                  Copy crosshair code
                </button>
                <button onClick={() => copy(JSON.stringify(s, null, 2))}>
                  Copy settings
                </button>
                <button
                  onClick={() => {
                    setS({ ...crosshairProfiles[0].settings });
                    setCode("");
                    setMessage("Profile reset.");
                  }}
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setCode("");
                    setS({
                      ...crosshairProfiles[
                        Math.floor(Math.random() * crosshairProfiles.length)
                      ].settings,
                      c: Math.floor(Math.random() * 8),
                    });
                  }}
                >
                  Randomize
                </button>
                <button
                  onClick={() =>
                    copy(
                      `${location.origin}/valorant/crosshair/?code=${encodeURIComponent(serializeCrosshair(s))}`,
                    )
                  }
                >
                  Share profile
                </button>
              </div>
            </div>
            <div>
              <label class="cluster-field">
                Color
                <select
                  value={s.c}
                  onChange={(e) => update("c", Number(e.currentTarget.value))}
                >
                  {[
                    "White",
                    "Green",
                    "Yellow green",
                    "Green yellow",
                    "Yellow",
                    "Cyan",
                    "Pink",
                    "Red",
                    "Custom",
                  ].map((v, i) => (
                    <option value={i}>{v}</option>
                  ))}
                </select>
              </label>
              {s.c === 8 && (
                <label class="cluster-field">
                  Custom RGB
                  <input
                    type="color"
                    value={"#" + s.u.slice(0, 6)}
                    onInput={(e) =>
                      update("u", e.currentTarget.value.slice(1).toUpperCase())
                    }
                  />
                </label>
              )}
              <details open>
                <summary>Outlines and center dot</summary>
                {check("h", "Show outlines")}
                {slider("o", "Outline opacity", 1, 0.05)}
                {slider("t", "Outline thickness", 6)}
                {check("d", "Show center dot")}
                {slider("z", "Dot thickness", 6)}
                {slider("a", "Dot opacity", 1, 0.05)}
              </details>
              {(["0", "1"] as const).map((p) => (
                <details>
                  <summary>{p === "0" ? "Inner" : "Outer"} lines</summary>
                  {check(`${p}b`, "Show lines")}
                  {slider(`${p}a`, "Line opacity", 1, 0.05)}
                  {slider(`${p}l`, "Horizontal length")}
                  {check(`${p}g`, "Separate vertical length")}
                  {!!s[`${p}g`] && slider(`${p}v`, "Vertical length")}
                  {slider(`${p}t`, "Thickness", 10)}
                  {slider(`${p}o`, "Offset")}
                  {check(`${p}m`, "Movement error")}
                  {slider(`${p}s`, "Movement multiplier", 3, 0.1)}
                  {check(`${p}f`, "Firing error")}
                  {slider(`${p}e`, "Firing multiplier", 3, 0.1)}
                </details>
              ))}
            </div>
          </div>
          <label class="cluster-field">
            Import or copy code
            <textarea
              value={code || serializeCrosshair(s)}
              onInput={(e) => setCode(e.currentTarget.value)}
              rows={4}
            />
          </label>
          <button
            onClick={() => {
              try {
                setS(parseCrosshair(code || serializeCrosshair(s)));
                setMessage("Primary profile imported.");
              } catch (error) {
                setMessage((error as Error).message);
              }
            }}
          >
            Import code
          </button>
        </>
      )}
      {copyFallback && (
        <label class="cluster-field">
          Copy manually
          <textarea readOnly value={copyFallback} rows={4} />
        </label>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
function Sensitivity({ mode }: { mode: string }) {
  const [from, setFrom] = useState("valorant"),
    [to, setTo] = useState("cs2"),
    [sens, setSens] = useState(0.35),
    [dpi, setDpi] = useState(800),
    [target, setTarget] = useState(280),
    [multiplier, setMultiplier] = useState(1),
    [message, setMessage] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    for (const [key, set] of [
      ["sens", setSens],
      ["dpi", setDpi],
      ["target", setTarget],
      ["multiplier", setMultiplier],
    ] as const) {
      const n = Number(p.get(key));
      if (p.has(key) && Number.isFinite(n) && n > 0) set(n);
    }
    if (sensitivityGames.some((g) => g.id === p.get("from")))
      setFrom(p.get("from")!);
    if (sensitivityGames.some((g) => g.id === p.get("to"))) setTo(p.get("to")!);
  }, []);
  const source = sensitivityGames.find((g) => g.id === from)!,
    destination = sensitivityGames.find((g) => g.id === to)!;
  let result: ReturnType<typeof sensitivityResult> | undefined;
  try {
    result = sensitivityResult(
      sens,
      dpi,
      mode === "sens-converter" ? source.yaw : 0.07,
      destination.yaw,
    );
  } catch {}
  const field = (label: string, value: number, set: (n: number) => void) => (
    <label class="cluster-field">
      {label}
      <input
        type="number"
        min="0.001"
        step="any"
        value={value}
        onInput={(e) => set(e.currentTarget.valueAsNumber)}
      />
    </label>
  );
  const select = (label: string, value: string, set: (v: string) => void) => (
    <label class="cluster-field">
      {label}
      <select value={value} onChange={(e) => set(e.currentTarget.value)}>
        {sensitivityGames.map((g) => (
          <option value={g.id}>{g.game}</option>
        ))}
      </select>
    </label>
  );
  async function copy(share = false) {
    if (!result) return;
    const p = new URLSearchParams({
      from,
      to,
      sens: String(sens),
      dpi: String(dpi),
      target: String(target),
      multiplier: String(multiplier),
    });
    const text = share
      ? `${location.origin}${location.pathname}?${p}`
      : mode === "sens-converter"
        ? `${destination.game}: ${result.converted.toFixed(6)} at ${dpi} DPI (${result.cm360.toFixed(2)} cm/360)`
        : mode === "scoped-sensitivity-calculator"
          ? `Hipfire eDPI: ${result.edpi}; scoped setting product: ${sens * multiplier}`
          : `VALORANT eDPI: ${result.edpi}; target sensitivity: ${target / dpi}`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage(share ? "Share link copied." : "Result copied.");
    } catch {
      setMessage(text);
    }
  }
  return (
    <div class="calculator universal-tool">
      <h2>
        {mode === "sens-converter"
          ? "Match your mouse travel"
          : mode === "edpi-calculator"
            ? "Calculate effective DPI"
            : "Compare base and scope settings"}
      </h2>
      <div class="secondary-input-grid">
        {mode === "sens-converter" && select("From game", from, setFrom)}
        {field("Mouse DPI", dpi, setDpi)}
        {field(
          mode === "sens-converter" && from === "fortnite"
            ? "Sensitivity percentage (5 = 5%)"
            : "Sensitivity",
          sens,
          setSens,
        )}
        {mode === "sens-converter" && select("To game", to, setTo)}
        {mode === "edpi-calculator" && field("Target eDPI", target, setTarget)}
        {mode === "scoped-sensitivity-calculator" &&
          field("Scope / ADS multiplier", multiplier, setMultiplier)}
      </div>
      <div class="cluster-actions">
        {[400, 800, 1600, 3200].map((n) => (
          <button onClick={() => setDpi(n)}>{n} DPI</button>
        ))}
      </div>
      {result && target > 0 && multiplier > 0 ? (
        <>
          <div class="primary-result">
            <span>
              {mode === "sens-converter"
                ? `${destination.game} sensitivity`
                : mode === "edpi-calculator"
                  ? "VALORANT eDPI"
                  : "Scoped setting product"}
            </span>
            <strong>
              {(mode === "sens-converter"
                ? result.converted
                : mode === "edpi-calculator"
                  ? result.edpi
                  : sens * multiplier
              ).toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </strong>
            <p>
              {result.edpi.toFixed(2)} hipfire eDPI · {result.cm360.toFixed(2)}{" "}
              cm/360{" "}
              {mode === "scoped-sensitivity-calculator" ? "(hipfire only)" : ""}
            </p>
          </div>
          {mode === "edpi-calculator" && (
            <>
              <p>
                At {dpi} DPI, target {target} eDPI requires{" "}
                {(target / dpi).toFixed(6)} sensitivity.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>DPI</th>
                    <th>Sensitivity for {target} eDPI</th>
                  </tr>
                </thead>
                <tbody>
                  {[400, 800, 1600, 3200].map((n) => (
                    <tr>
                      <td>{n}</td>
                      <td>{(target / n).toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {mode === "sens-converter" && (
            <p class="assumption-note">
              {sens} × {source.yaw} ÷ {destination.yaw} ={" "}
              {result.converted.toFixed(6)}. {source.note} {destination.note}
            </p>
          )}
          {mode === "scoped-sensitivity-calculator" && (
            <p class="assumption-note">
              {sens} × {multiplier} = {(sens * multiplier).toFixed(6)}. This is
              a settings multiplier product, not scoped cm/360 or a
              field-of-view match.
            </p>
          )}
        </>
      ) : (
        <p role="alert">Enter positive finite numbers to calculate a result.</p>
      )}
      <div class="cluster-actions">
        {mode === "sens-converter" && (
          <button
            disabled={!result}
            onClick={() => {
              if (result) {
                setFrom(to);
                setTo(from);
                setSens(result.converted);
              }
            }}
          >
            Swap games
          </button>
        )}
        <button disabled={!result} onClick={() => copy()}>
          Copy result
        </button>
        <button disabled={!result} onClick={() => copy(true)}>
          Share
        </button>
        <button
          onClick={() => {
            setFrom("valorant");
            setTo("cs2");
            setSens(0.35);
            setDpi(800);
            setTarget(280);
            setMultiplier(1);
            setMessage("Settings reset.");
          }}
        >
          Reset
        </button>
      </div>
      <p role="status">{message}</p>
    </div>
  );
}
function Rank() {
  const [current, setCurrent] = useState(9),
    [rr, setRr] = useState(40),
    [target, setTarget] = useState(10),
    [win, setWin] = useState(20),
    [loss, setLoss] = useState(18),
    [rate, setRate] = useState(55);
  const ranks = [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Ascendant",
  ].flatMap((t) => [1, 2, 3].map((n) => `${t} ${n}`));
  let result;
  try {
    result = rankPlan(current, rr, target, win, loss, rate);
  } catch {}
  return (
    <div class="calculator universal-tool">
      <h2>Estimate an RR climb</h2>
      <div class="secondary-input-grid">
        <label class="cluster-field">
          Current rank
          <select
            value={current}
            onChange={(e) => setCurrent(Number(e.currentTarget.value))}
          >
            {ranks.map((r, i) => (
              <option value={i}>{r}</option>
            ))}
          </select>
        </label>
        <label class="cluster-field">
          Target rank
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.currentTarget.value))}
          >
            {ranks.map((r, i) => (
              <option value={i}>{r}</option>
            ))}
          </select>
        </label>
        {(
          [
            ["Current RR", rr, setRr, 99],
            ["Average RR won", win, setWin, 100],
            ["Average RR lost", loss, setLoss, 100],
            ["Expected win rate (%)", rate, setRate, 100],
          ] as const
        ).map(([label, value, set, max]) => (
          <label class="cluster-field">
            {label}
            <input
              type="number"
              min="0"
              max={max}
              value={value}
              onInput={(e) => set(e.currentTarget.valueAsNumber)}
            />
          </label>
        ))}
      </div>
      {result ? (
        <div class="primary-result">
          <span>Estimated games</span>
          <strong>
            {result.games === null ? "No positive climb" : result.games}
          </strong>
          <p>
            {result.remaining} RR gap · {result.net.toFixed(2)} net RR per game
            · {result.allWins} consecutive wins as a best-case estimate
          </p>
          <p>
            Expected wins within the estimate:{" "}
            {result.expectedWins ?? "not available"}
          </p>
        </div>
      ) : (
        <p role="alert">
          Choose a target at or above your current tier and enter valid RR
          values.
        </p>
      )}
      <p class="assumption-note">
        Linear estimate for Iron–Ascendant only. Promotion bonuses, demotion
        protection, MMR and changing RR awards are excluded. A losing streak has
        no finite guaranteed completion time.
      </p>
      <button
        onClick={() => {
          setCurrent(9);
          setRr(40);
          setTarget(10);
          setWin(20);
          setLoss(18);
          setRate(55);
        }}
      >
        Reset example
      </button>
    </div>
  );
}
export default function ValorantCalculator({ toolSlug }: { toolSlug: string }) {
  if (toolSlug.includes("crosshair")) return <Crosshairs mode={toolSlug} />;
  if (toolSlug === "rank-progress-calculator") return <Rank />;
  return <Sensitivity mode={toolSlug} />;
}
