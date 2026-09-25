export function safeProgress(stars: number, target: number, daily: number) {
  if (
    ![stars, target, daily].every(Number.isFinite) ||
    stars < 0 ||
    target <= 0 ||
    daily < 0
  )
    throw new Error("Enter nonnegative stars and a positive safe cost.");
  const remaining = Math.max(0, target - stars);
  return {
    remaining,
    percent: Math.min(100, (stars / target) * 100),
    days: remaining === 0 ? 0 : daily > 0 ? Math.ceil(remaining / daily) : null,
  };
}
export function eventStatus(start: string, end: string, now: number) {
  const a = Date.parse(start),
    b = Date.parse(end);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a)
    throw new Error("Invalid event interval.");
  return now >= b
    ? "ENDED"
    : now >= a
      ? "LIVE"
      : a - now <= 86400000
        ? "STARTING SOON"
        : "UPCOMING";
}
export function partnerProgress(
  target: number,
  yours: number,
  partner: number,
) {
  if (
    ![target, yours, partner].every(Number.isFinite) ||
    target <= 0 ||
    yours < 0 ||
    partner < 0
  )
    throw new Error(
      "Enter positive target points and nonnegative contributions.",
    );
  return {
    remaining: Math.max(0, target - yours - partner),
    yourHalfRemaining: Math.max(0, target / 2 - yours),
    percent: Math.min(100, ((yours + partner) / target) * 100),
  };
}
