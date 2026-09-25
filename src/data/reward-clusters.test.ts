import { describe, it, expect } from "vitest";
import { games } from "./games";
import { monopolyTopics } from "./monopoly-go/topics";
import events from "./monopoly-go/events.json";
import rewards from "./coin-master/rewards.json";
import { sensitivityGames } from "./valorant/sensitivity-games";
import { crosshairProfiles } from "../games/valorant/crosshair";
import { monopolyGoToolContent } from "./tool-content/monopoly-go";
import { coinMasterToolContent } from "./tool-content/coin-master";
import { valorantToolContent } from "./tool-content/valorant";
import { normalizeRewardUrl } from "../games/shared/reward-links";
describe("Reviewed reward and aim clusters", () => {
  it("registers unique tools with specific content, metadata and three valid sibling links", () => {
    const content = {
      ...monopolyGoToolContent,
      ...coinMasterToolContent,
      ...valorantToolContent,
    };
    for (const slug of ["monopoly-go", "valorant", "coin-master"]) {
      const game = games.find((g) => g.slug === slug)!;
      expect(game).toBeDefined();
      expect(game.icon?.src).toContain(slug);
      expect(new Set(game.tools.map((t) => t.slug)).size).toBe(
        game.tools.length,
      );
      for (const tool of game.tools) {
        expect(tool.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tool.related).toHaveLength(3);
        for (const related of tool.related!)
          expect(
            game.tools.some((t) => t.slug === related && t.slug !== tool.slug),
          ).toBe(true);
        const entry = content[`${slug}/${tool.slug}` as keyof typeof content];
        expect(entry).toBeDefined();
        expect(entry.faqs.length).toBeGreaterThanOrEqual(3);
        expect(entry.sources?.length).toBeGreaterThan(0);
      }
    }
    expect(
      games
        .find((g) => g.slug === "coin-master")!
        .tools.find((t) => t.slug === "free-spins")!.adsDisabled,
    ).toBe(true);
  });
  it("excludes unsourced cost and collection routes", () => {
    const withheld = {
      "monopoly-go": [
        "free-dice-links",
        "board-cost-calculator",
        "sticker-tracker",
      ],
      valorant: ["rank-distribution"],
      "coin-master": [
        "village-cost-calculator",
        "village-progress-calculator",
        "card-set-tracker",
        "free-coins",
      ],
    };
    for (const [slug, paths] of Object.entries(withheld))
      for (const path of paths)
        expect(
          games
            .find((g) => g.slug === slug)!
            .tools.some((t) => t.slug === path),
        ).toBe(false);
  });
  it("validates local source metadata and numeric units", () => {
    for (const rows of [sensitivityGames, crosshairProfiles]) {
      expect(rows.length).toBeGreaterThan(0);
      expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
      for (const row of rows) {
        expect(row.source).toBeTruthy();
        expect(row.sourceUrl).toMatch(/^https:\/\//);
        expect(row.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(row.unit).toBeTruthy();
      }
    }
    expect(sensitivityGames.every((r) => r.yaw > 0 && r.yaw < 1)).toBe(true);
    expect(new Set(monopolyTopics.map((r) => r.name)).size).toBe(
      monopolyTopics.length,
    );
    expect(new Set(events.map((r) => r.id)).size).toBe(events.length);
    expect(
      events.every(
        (r) =>
          Date.parse(r.endUtc) > Date.parse(r.startUtc) &&
          r.sourceUrl.startsWith("https://www.monopolygo.com/"),
      ),
    ).toBe(true);
  });
  it("keeps reward identities, types and check dates valid without invented amounts", () => {
    expect(rewards.length).toBeGreaterThan(0);
    expect(new Set(rewards.map((r) => r.id)).size).toBe(rewards.length);
    for (const row of rewards) {
      expect(normalizeRewardUrl(row.claimUrl, "coin-master")).toBe(
        row.claimUrl,
      );
      expect(["spins", "coins", "other"]).toContain(row.type);
      expect(Number.isFinite(Date.parse(row.checkedAt))).toBe(true);
      expect(Number.isFinite(Date.parse(row.discoveredAt))).toBe(true);
      expect(row.sourceUrl).toBe("https://coin-master.co/m/Reward-Center2");
      expect(row.spins === null || row.spins >= 0).toBe(true);
      expect(row.coins === null || row.coins >= 0).toBe(true);
    }
  });
});
