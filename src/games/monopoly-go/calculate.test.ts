import { describe, it, expect } from "vitest";
import { safeProgress, partnerProgress, eventStatus } from "./calculate";
describe("MONOPOLY GO planning arithmetic", () => {
  it("calculates the displayed safe example", () =>
    expect(safeProgress(350, 700, 50)).toEqual({
      remaining: 350,
      percent: 50,
      days: 7,
    }));
  it("rounds collection days up and handles unknown rate", () => {
    expect(safeProgress(699, 700, 0).days).toBeNull();
    expect(safeProgress(601, 700, 50).days).toBe(2);
  });
  it("caps completed safe progress", () =>
    expect(safeProgress(900, 700, 0)).toEqual({
      remaining: 0,
      percent: 100,
      days: 0,
    }));
  it.each([
    [NaN, 700, 50],
    [350, 0, 50],
    [-1, 700, 50],
    [350, 700, -1],
  ])("rejects invalid safe inputs %s", (...args) =>
    expect(() => safeProgress(...(args as [number, number, number]))).toThrow(),
  );
  it("separates total attraction progress from half-share", () =>
    expect(partnerProgress(80000, 25000, 30000)).toEqual({
      remaining: 25000,
      yourHalfRemaining: 15000,
      percent: 68.75,
    }));
  it("handles excess partner contributions", () =>
    expect(partnerProgress(100, 120, 0)).toEqual({
      remaining: 0,
      yourHalfRemaining: 0,
      percent: 100,
    }));
  it("rejects invalid attraction targets", () =>
    expect(() => partnerProgress(0, 10, 20)).toThrow());
  it("uses exact UTC boundaries independently of device timezone", () => {
    const start = "2026-09-25T11:00:00Z",
      end = "2026-09-26T11:00:00Z";
    expect(eventStatus(start, end, Date.parse("2026-09-23T11:00:00Z"))).toBe(
      "UPCOMING",
    );
    expect(eventStatus(start, end, Date.parse(start) - 1)).toBe(
      "STARTING SOON",
    );
    expect(
      eventStatus(start, end, Date.parse("2026-09-25T04:00:00-07:00")),
    ).toBe("LIVE");
    expect(eventStatus(start, end, Date.parse(end))).toBe("ENDED");
  });
  it("rejects reversed dates", () =>
    expect(() => eventStatus("2026-09-26", "2026-09-25", 0)).toThrow());
});
