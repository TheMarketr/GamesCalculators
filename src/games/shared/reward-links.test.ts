import { describe, it, expect, vi, afterEach } from "vitest";
import {
  normalizeRewardUrl,
  rewardStatus,
  uniqueRewards,
  relativeCheckTime,
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
