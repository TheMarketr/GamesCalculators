import { describe, it, expect, vi, afterEach } from "vitest";
import {
  normalizeRewardUrl,
  rewardStatus,
  uniqueRewards,
  relativeCheckTime,
  rewardFeedView,
  type Reward,
} from "./reward-links";
import { readLocal, readClaimed, writeLocal } from "./local-progress";
const sample: Reward = {
  id: "one",
  type: "other",
  label: "Test fixture",
  claimUrl: "https://mply.io/test",
  source: "fixture",
  sourceUrl: "https://www.monopolygo.com/",
  discoveredAt: "2026-09-25T00:00:00Z",
  checkedAt: "2026-09-25T00:00:00Z",
};
describe("Source-tracked reward safeguards", () => {
  it("normalizes UTM, hashes and query ordering", () =>
    expect(
      normalizeRewardUrl(
        "https://mply.io/test?z=1&utm_source=x&a=2#x",
        "monopoly-go",
      ),
    ).toBe("https://mply.io/test?a=2&z=1"));
  it.each([
    "http://mply.io/test",
    "https://mply.io.evil.test/a",
    "https://user@mply.io/a",
    "https://mply.io:444/a",
    "javascript:alert(1)",
    "https://evil.test/a",
  ])("rejects unsafe MONOPOLY GO link %s", (url) =>
    expect(() => normalizeRewardUrl(url, "monopoly-go")).toThrow(),
  );
  it("allows only the reviewed Coin Master path and hosts", () => {
    expect(
      normalizeRewardUrl("https://d10xl.com/coinmaster/example", "coin-master"),
    ).toContain("/coinmaster/");
    expect(() =>
      normalizeRewardUrl("https://d10xl.com/another-game/test", "coin-master"),
    ).toThrow();
    expect(() =>
      normalizeRewardUrl("https://mply.io/a", "coin-master"),
    ).toThrow();
  });
  it("deduplicates equivalent reward URLs", () =>
    expect(
      uniqueRewards(
        [
          sample,
          { ...sample, id: "two", claimUrl: sample.claimUrl + "?utm_source=x" },
        ],
        "monopoly-go",
      ),
    ).toHaveLength(1));
  it("separates age from retirement and future uncertainty", () => {
    expect(rewardStatus(sample, Date.parse(sample.discoveredAt) + 1000)).toBe(
      "NEW",
    );
    expect(
      rewardStatus(sample, Date.parse(sample.discoveredAt) + 86400000),
    ).toBe("RECENT");
    expect(
      rewardStatus(sample, Date.parse(sample.discoveredAt) + 3 * 86400000),
    ).toBe("OLDER");
    expect(rewardStatus({ ...sample, retired: true }, 0)).toBe("RETIRED");
    expect(rewardStatus(sample, 0)).toBe("DATE UNCONFIRMED");
  });
  it("formats honest check ages", () =>
    expect(
      relativeCheckTime(
        sample.checkedAt,
        Date.parse(sample.checkedAt) + 120000,
      ),
    ).toBe("2 minutes ago"));
  it("keeps an empty MONOPOLY GO feed usable", () => {
    const view = rewardFeedView([], "monopoly-go", Date.parse("2026-09-25T15:00:00Z"), "all", false, []);
    expect(view.shown).toEqual([]);
    expect(view.todayRows).toEqual([]);
    expect(view.knownAmount).toBe(0);
  });
  it("filters today's dice and counts only known quantities", () => {
    const now = Date.parse("2026-09-25T15:00:00Z");
    const dice: Reward = { ...sample, id: "dice", type: "dice", amount: 25, discoveredAt: "2026-09-25T14:00:00Z" };
    const unknown: Reward = { ...sample, id: "unknown", claimUrl: "https://mply.io/unknown", type: "dice", discoveredAt: "2026-09-25T13:00:00Z" };
    const old: Reward = { ...sample, id: "old", claimUrl: "https://mply.io/old", type: "dice", amount: 50, discoveredAt: "2026-09-21T14:00:00Z" };
    const view = rewardFeedView([old, unknown, dice], "monopoly-go", now, "today", false, []);
    expect(view.todayRows).toHaveLength(2);
    expect(view.knownAmount).toBe(25);
    expect(view.shown.map(r => r.id)).toEqual(["dice", "unknown"]);
    expect(rewardFeedView([old, unknown, dice], "monopoly-go", now, "all", true, ["dice"]).shown.map(r => r.id)).not.toContain("dice");
  });
  it("separates Coin Master spin, coin, daily and retired rewards", () => {
    const now = Date.parse("2026-09-25T15:00:00Z");
    const daily: Reward = { ...sample, id: "daily", claimUrl: "https://coin-master.co/daily", label: "Official Coin Master Daily Gift", discoveredAt: "2026-09-25T14:00:00Z" };
    const spins: Reward = { ...daily, id: "spins", claimUrl: "https://coin-master.co/spins", label: "50 spins", type: "spins", spins: 50 };
    const coins: Reward = { ...daily, id: "coins", claimUrl: "https://coin-master.co/coins", label: "Coins", type: "coins" };
    const retired: Reward = { ...daily, id: "retired", claimUrl: "https://coin-master.co/retired", retired: true };
    const rows = [daily, spins, coins, retired];
    expect(rewardFeedView(rows, "coin-master", now, "spins", false, []).shown.map(r => r.id)).toEqual(["spins"]);
    expect(rewardFeedView(rows, "coin-master", now, "coins", false, []).shown.map(r => r.id)).toEqual(["coins"]);
    expect(rewardFeedView(rows, "coin-master", now, "daily", false, []).shown.map(r => r.id)).toEqual(["daily"]);
    expect(rewardFeedView(rows, "coin-master", now, "all", false, []).knownAmount).toBe(50);
    expect(rewardFeedView(rows, "coin-master", now, "all", false, []).archive.some(r => r.id === "retired")).toBe(true);
  });
  it("validates stored claimed IDs", () => {
    expect(readClaimed(["a", 3, "a", "b", null])).toEqual(["a", "b"]);
    expect(readClaimed({ a: true })).toEqual([]);
  });
  afterEach(() => vi.unstubAllGlobals());
  it("survives unavailable storage", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw Error("blocked");
      },
      setItem() {
        throw Error("blocked");
      },
    });
    expect(readLocal("x", [])).toEqual([]);
    expect(writeLocal("x", [])).toBe(false);
  });
  it("saves, reloads and recovers from corrupt storage", () => {
    const memory = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => memory.get(key),
      setItem: (key: string, value: string) => memory.set(key, value),
    });
    expect(writeLocal("x", ["a"])).toBe(true);
    expect(readLocal("x", [])).toEqual(["a"]);
    memory.set("x", "bad JSON");
    expect(readLocal("x", [])).toEqual([]);
  });
});
