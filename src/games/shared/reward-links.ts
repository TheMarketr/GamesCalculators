export type RewardGame = "monopoly-go" | "coin-master";
export interface Reward {
  id: string;
  type: string;
  label: string;
  claimUrl: string;
  source: string;
  sourceUrl: string;
  discoveredAt: string;
  checkedAt: string;
  publishedAt?: string;
  retired?: boolean;
  amount?: number;
  spins?: number | null;
  coins?: number | null;
  notes?: string;
}
export const claimHosts = {
  "monopoly-go": ["mply.io"],
  "coin-master": ["coin-master.co", "d10xl.com"],
} as const;
export function normalizeRewardUrl(input: string, game: RewardGame) {
  const url = new URL(input);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    !(claimHosts[game] as readonly string[]).includes(url.hostname)
  )
    throw new Error(
      "Reward destination is not on the reviewed HTTPS allowlist.",
    );
  if (
    game === "coin-master" &&
    url.hostname === "d10xl.com" &&
    !url.pathname.startsWith("/coinmaster/")
  )
    throw new Error("Unrecognized Coin Master path.");
  url.hash = "";
  for (const key of [...url.searchParams.keys()])
    if (key.startsWith("utm_")) url.searchParams.delete(key);
  url.searchParams.sort();
  return url.toString();
}
export function rewardStatus(
  reward: Pick<Reward, "retired" | "publishedAt" | "discoveredAt">,
  now: number,
) {
  if (reward.retired) return "RETIRED";
  const age = now - Date.parse(reward.publishedAt ?? reward.discoveredAt);
  if (!Number.isFinite(age) || age < 0) return "DATE UNCONFIRMED";
  return age < 86400000 ? "NEW" : age < 3 * 86400000 ? "RECENT" : "OLDER";
}
export function uniqueRewards(records: Reward[], game: RewardGame) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = normalizeRewardUrl(record.claimUrl, game);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function relativeCheckTime(value: string, now: number) {
  const minutes = Math.floor((now - Date.parse(value)) / 60000);
  if (!Number.isFinite(minutes) || minutes < 0) return "time unconfirmed";
  if (minutes < 1) return "less than a minute ago";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
