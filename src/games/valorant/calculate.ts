export function sensitivityResult(
  sens: number,
  dpi: number,
  fromYaw: number,
  toYaw: number,
) {
  if (![sens, dpi, fromYaw, toYaw].every((n) => Number.isFinite(n) && n > 0))
    throw new Error("Sensitivity, DPI and yaw must be positive.");
  return {
    converted: (sens * fromYaw) / toYaw,
    edpi: sens * dpi,
    cm360: (360 * 2.54) / (sens * dpi * fromYaw),
  };
}
export function rankPlan(
  current: number,
  rr: number,
  target: number,
  win: number,
  loss: number,
  rate: number,
) {
  if (
    ![current, rr, target, win, loss, rate].every(Number.isFinite) ||
    !Number.isInteger(current) ||
    !Number.isInteger(target) ||
    current < 0 ||
    target > 20 ||
    target < current ||
    rr < 0 ||
    rr > 99 ||
    win <= 0 ||
    loss < 0 ||
    rate < 0 ||
    rate > 100
  )
    throw new Error(
      "Use a target at or above the current rank, RR 0–99 and valid averages.",
    );
  const remaining = Math.max(0, (target - current) * 100 - rr),
    net = (rate / 100) * win - (1 - rate / 100) * loss;
  return {
    remaining,
    net,
    games: remaining === 0 ? 0 : net > 0 ? Math.ceil(remaining / net) : null,
    allWins: Math.ceil(remaining / win),
    expectedWins:
      remaining === 0
        ? 0
        : net > 0
          ? Math.ceil((Math.ceil(remaining / net) * rate) / 100)
          : null,
  };
}
