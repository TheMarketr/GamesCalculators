export function calendarProgress(day: number, progress: number) {
  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day > 7 ||
    !Number.isInteger(progress) ||
    progress < 0 ||
    progress > 30
  )
    throw new Error(
      "Daily position must be 1–7; monthly progress must be 0–30.",
    );
  return {
    nextDay: day === 7 ? 1 : day + 1,
    remaining: 30 - progress,
    percent: (progress / 30) * 100,
  };
}
export function villageBudget(costs: number[], discount: number, coins = 0) {
  if (
    !costs.length ||
    costs.some((n) => !Number.isFinite(n) || n < 0) ||
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount > 100 ||
    !Number.isFinite(coins) ||
    coins < 0
  )
    throw new Error("Invalid village budget inputs.");
  const base = costs.reduce((a, b) => a + b, 0),
    total = base * (1 - discount / 100);
  let remainingCoins = coins,
    affordable = 0;
  for (const cost of costs) {
    const discounted = cost * (1 - discount / 100);
    if (discounted > remainingCoins) break;
    remainingCoins -= discounted;
    affordable++;
  }
  return {
    base,
    total,
    saved: base - total,
    shortfall: Math.max(0, total - coins),
    affordable,
    remainingCoins,
    percent: total === 0 ? 100 : Math.min(100, (coins / total) * 100),
  };
}
