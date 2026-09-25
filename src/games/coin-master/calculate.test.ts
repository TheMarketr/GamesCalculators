import { describe, it, expect } from "vitest";
import { calendarProgress, villageBudget } from "./calculate";
describe("Coin Master calendar and entered-price planning", () => {
  it("keeps weekly position and monthly progress separate", () =>
    expect(calendarProgress(7, 12)).toEqual({
      nextDay: 1,
      remaining: 18,
      percent: 40,
    }));
  it("handles the monthly milestone", () =>
    expect(calendarProgress(2, 30)).toEqual({
      nextDay: 3,
      remaining: 0,
      percent: 100,
    }));
  it.each([
    [0, 0],
    [8, 0],
    [1, 31],
    [1, -1],
    [1.5, 2],
  ])("rejects invalid calendar position %s", (...args) =>
    expect(() => calendarProgress(...(args as [number, number]))).toThrow(),
  );
  it("totals only entered prices, applying the discount once", () =>
    expect(villageBudget([100, 200, 300], 20, 250)).toEqual({
      base: 600,
      total: 480,
      saved: 120,
      shortfall: 230,
      affordable: 2,
      remainingCoins: 10,
      percent: (250 / 480) * 100,
    }));
  it("handles zero, full discount and insufficient budget", () => {
    expect(villageBudget([100], 0, 0).shortfall).toBe(100);
    expect(villageBudget([100], 100, 0).affordable).toBe(1);
    expect(villageBudget([100], 100, 0).percent).toBe(100);
  });
  it("does not skip an unaffordable earlier village", () =>
    expect(villageBudget([300, 100], 0, 200).affordable).toBe(0));
  it("rejects negative prices or excessive discounts", () => {
    expect(() => villageBudget([-1], 20)).toThrow();
    expect(() => villageBudget([100], 101)).toThrow();
    expect(() => villageBudget([], 0)).toThrow();
  });
});
