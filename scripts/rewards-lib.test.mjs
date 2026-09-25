import { describe, it, expect } from "vitest";
import {
  checkChain,
  normalize,
  fingerprint,
  validSource,
} from "./rewards-lib.mjs";
describe("Reward maintenance redirect and provenance safeguards", () => {
  it("deduplicates fingerprints independently of tracking parameters", () =>
    expect(fingerprint("https://mply.io/a?utm_campaign=x", "monopoly-go")).toBe(
      fingerprint("https://mply.io/a", "monopoly-go"),
    ));
  it("requires an official source page", () => {
    expect(() =>
      validSource("https://competitor.example/rewards", "coin-master"),
    ).toThrow();
    expect(() =>
      validSource("https://coin-master.co/short", "coin-master"),
    ).toThrow();
    expect(
      validSource("https://coin-master.co/m/Reward-Center2", "coin-master"),
    ).toContain("/m/");
  });
  it("rejects lookalike hosts", () =>
    expect(() =>
      normalize("https://coin-master.co.evil.example/a", "coin-master"),
    ).toThrow());
  it("follows a validated native-shop chain without opening the app", async () => {
    const calls = [];
    const mock = async (url) => {
      calls.push(url);
      return new Response(null, {
        status: 302,
        headers: {
          location:
            calls.length === 1
              ? "https://d10xl.com/coinmaster/example"
              : "coinmaster://shop_login?page=deals",
        },
      });
    };
    expect(
      (await checkChain("https://coin-master.co/test", "coin-master", mock))
        .state,
    ).toBe("reachable");
    expect(calls).toHaveLength(2);
  });
  it("blocks off-allowlist redirects", async () =>
    expect(
      checkChain(
        "https://mply.io/a",
        "monopoly-go",
        async () =>
          new Response(null, {
            status: 302,
            headers: { location: "https://evil.example/" },
          }),
      ),
    ).rejects.toThrow());
  it("distinguishes a retired URL from a transient 403", async () => {
    expect(
      (
        await checkChain(
          "https://mply.io/a",
          "monopoly-go",
          async () => new Response(null, { status: 410 }),
        )
      ).state,
    ).toBe("retired");
    await expect(
      checkChain(
        "https://mply.io/a",
        "monopoly-go",
        async () => new Response(null, { status: 403 }),
      ),
    ).rejects.toThrow();
  });
  it("stops redirect loops", async () =>
    expect(
      checkChain(
        "https://mply.io/a",
        "monopoly-go",
        async () =>
          new Response(null, {
            status: 302,
            headers: { location: "https://mply.io/a" },
          }),
      ),
    ).rejects.toThrow("loop"));
});
