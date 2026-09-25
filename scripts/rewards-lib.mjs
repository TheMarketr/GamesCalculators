import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const hosts = {
  "monopoly-go": ["mply.io"],
  "coin-master": ["coin-master.co", "d10xl.com"],
};
export function normalize(input, game) {
  const u = new URL(input);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.port ||
    !hosts[game]?.includes(u.hostname)
  )
    throw new Error("Unapproved reward host");
  if (u.hostname === "d10xl.com" && !u.pathname.startsWith("/coinmaster/"))
    throw new Error("Unapproved redirect path");
  u.hash = "";
  for (const key of [...u.searchParams.keys()])
    if (key.startsWith("utm_")) u.searchParams.delete(key);
  u.searchParams.sort();
  return u.href;
}
export function fingerprint(url, game) {
  return `${game}-${createHash("sha256").update(normalize(url, game)).digest("hex").slice(0, 16)}`;
}
export function validSource(input, game) {
  const u = new URL(input),
    allowed =
      game === "monopoly-go"
        ? ["www.monopolygo.com", "monopolygo.com", "support.monopolygo.com"]
        : ["support.coinmastergame.com", "coin-master.co"];
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.port ||
    !allowed.includes(u.hostname)
  )
    throw new Error("Source must be a reviewed official publisher website");
  if (u.hostname === "coin-master.co" && !u.pathname.startsWith("/m/"))
    throw new Error(
      "Source must be an official landing page, not a reward short link",
    );
  return u.href;
}
export async function checkChain(input, game, fetcher = fetch) {
  let current = normalize(input, game);
  const visited = new Set();
  for (let hop = 0; hop < 6; hop++) {
    if (visited.has(current)) throw new Error("Redirect loop");
    visited.add(current);
    const r = await fetcher(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent":
          "GamesCalculators reward link checker (https://gamescalculators.com/contact/)",
      },
    });
    await r.body?.cancel();
    if ([404, 410].includes(r.status))
      return { state: "retired", terminal: current };
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      const location = r.headers.get("location");
      if (!location) throw new Error("Redirect without destination");
      const next = new URL(location, current);
      // A documented native-app destination is validated, never opened by this script.
      if (
        game === "coin-master" &&
        next.protocol === "coinmaster:" &&
        next.hostname === "shop_login"
      )
        return { state: "reachable", terminal: next.href };
      current = normalize(next.href, game);
      continue;
    }
    if (!r.ok) throw new Error(`Unconfirmed HTTP ${r.status}`);
    return { state: "reachable", terminal: current };
  }
  throw new Error("Too many redirects");
}
export async function loadRewards(game) {
  return JSON.parse(
    await readFile(resolve(`src/data/${game}/rewards.json`), "utf8"),
  );
}
export async function saveRewards(game, rows) {
  const seen = new Set(),
    ids = new Set();
  for (const r of rows) {
    const key = normalize(r.claimUrl, game);
    validSource(r.sourceUrl, game);
    if (seen.has(key) || ids.has(r.id)) throw new Error("Duplicate reward");
    seen.add(key);
    ids.add(r.id);
  }
  const file = resolve(`src/data/${game}/rewards.json`),
    next = JSON.stringify(rows, null, 2) + "\n";
  if ((await readFile(file, "utf8")) !== next) {
    await writeFile(file, next);
    return true;
  }
  return false;
}
export async function addReward(game) {
  const [claimUrl, sourceUrl, label, ...rest] = process.argv.slice(2);
  if (!claimUrl || !sourceUrl || !label || rest.length)
    throw new Error(
      "Usage: <claim-url> <official-source-url> <label>. Quantities must be reviewed separately; do not infer them from links.",
    );
  const url = normalize(claimUrl, game),
    source = validSource(sourceUrl, game);
  const response = await fetch(source, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Official source could not be read");
  const body = await response.text();
  if (!body.includes(url))
    throw new Error(
      "Exact claim link was not found in the official source; manual source review required",
    );
  const result = await checkChain(url, game);
  if (result.state !== "reachable") throw new Error("Reward is retired");
  const rows = await loadRewards(game);
  if (rows.some((r) => normalize(r.claimUrl, game) === url)) {
    console.log("Reward already exists.");
    return;
  }
  const now = new Date().toISOString();
  rows.unshift({
    id: fingerprint(url, game),
    type: "other",
    label,
    claimUrl: url,
    source: "Official publisher page",
    sourceUrl: source,
    discoveredAt: now,
    checkedAt: now,
    notes:
      "Reward quantity and account eligibility are not independently verified.",
  });
  await saveRewards(game, rows);
  console.log(
    "Added source-traceable reward; review the diff before publication.",
  );
}
