import {
  checkChain,
  fingerprint,
  loadRewards,
  normalize,
  saveRewards,
} from "./rewards-lib.mjs";
const sourceUrl = "https://coin-master.co/m/Reward-Center2";
const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(20000) });
if (!response.ok)
  throw new Error(
    `Reward Center unavailable (${response.status}); existing records preserved.`,
  );
const html = await response.text();
const match = html.match(/window\.launchpadData\s*=\s*(\{[^\n]+\})\s*;/);
if (!match)
  throw new Error(
    "Reward Center format changed; review required, existing records preserved.",
  );
const data = JSON.parse(match[1]);
// Only explicit daily-gift buttons qualify; social subscriptions and invitation links do not.
const candidates = (data.buttons ?? [])
  .filter(
    (button) =>
      button.is_active === true &&
      button.scheme === "https" &&
      /^collect your daily gift!?$/i.test(button.title?.trim() ?? ""),
  )
  .map((button) => `https://${button.bitlink}`);
if (!candidates.length)
  throw new Error(
    "No reviewed daily-gift button found; manual source review required.",
  );
const game = "coin-master",
  rows = await loadRewards(game);
for (const url of new Set(candidates)) {
  const claimUrl = normalize(url, game),
    result = await checkChain(claimUrl, game),
    now = new Date().toISOString();
  let row = rows.find((r) => normalize(r.claimUrl, game) === claimUrl);
  if (!row) {
    if (result.state !== "reachable") continue;
    row = {
      id: fingerprint(claimUrl, game),
      type: "other",
      spins: null,
      coins: null,
      label: "Official Coin Master Daily Gift",
      claimUrl,
      source: "Coin Master official Reward Center",
      sourceUrl,
      discoveredAt: now,
      checkedAt: now,
      notes:
        "Official recurring shop entry. Amount and account eligibility are not verified. A claimed mark tracks this link, not every future daily offer.",
    };
    rows.unshift(row);
  }
  row.checkedAt = now;
  if (result.state === "retired") row.retired = true;
  else delete row.retired;
}
await saveRewards(game, rows);
console.log(
  `Reviewed ${new Set(candidates).size} official daily-gift destination(s). No reward amounts inferred.`,
);
