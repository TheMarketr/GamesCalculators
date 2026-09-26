import { describe, it, expect } from "vitest";
import { sensitivityResult, rankPlan } from "./calculate";
import {
  crosshairProfiles,
  defaultCrosshair,
  parseCrosshair,
  serializeCrosshair,
} from "./crosshair";
import { previewBoxes } from './preview-geometry';
describe("VALORANT sensitivity and RR", () => {
  it("calculates eDPI and the CS2 conversion fixture", () => {
    const r = sensitivityResult(0.35, 800, 0.07, 0.022);
    expect(r.edpi).toBe(280);
    expect(r.converted).toBeCloseTo(1.11363636);
    expect(r.cm360).toBeCloseTo(46.6530612);
  });
  it("round trips a game swap", () => {
    const r = sensitivityResult(0.35, 800, 0.07, 0.022);
    expect(
      sensitivityResult(r.converted, 800, 0.022, 0.07).converted,
    ).toBeCloseTo(0.35);
  });
  it("preserves physical distance at inverse DPI and sensitivity", () =>
    expect(sensitivityResult(0.175, 1600, 0.07, 0.07).cm360).toBe(
      sensitivityResult(0.35, 800, 0.07, 0.07).cm360,
    ));
  it.each([0, -1, NaN, Infinity])("rejects invalid sensitivity %s", (n) =>
    expect(() => sensitivityResult(n, 800, 0.07, 0.022)).toThrow(),
  );
  it("calculates the documented Gold example", () => {
    const r = rankPlan(9, 40, 10, 20, 18, 55);
    expect(r.remaining).toBe(60);
    expect(r.net).toBeCloseTo(2.9);
    expect(r.games).toBe(21);
    expect(r.allWins).toBe(3);
  });
  it("does not invent a finite climb for negative expectation", () =>
    expect(rankPlan(9, 40, 10, 20, 18, 40).games).toBeNull());
  it("returns zero for an achieved target", () =>
    expect(rankPlan(9, 40, 9, 20, 18, 40).games).toBe(0));
  it("rejects targets outside supported rank tiers", () => {
    expect(() => rankPlan(9, 40, 21, 20, 18, 55)).toThrow();
    expect(() => rankPlan(9, 40, 8, 20, 18, 55)).toThrow();
  });
});
describe("VALORANT primary crosshair codec", () => {
  it('has at least 20 unique original preset IDs', () => {
    expect(crosshairProfiles.length).toBeGreaterThanOrEqual(20);
    expect(new Set(crosshairProfiles.map(profile => profile.id)).size).toBe(crosshairProfiles.length);
  });
  it('changes fixed-coordinate preview geometry with length, offset and thickness', () => {
    const base = previewBoxes(defaultCrosshair, 'standing');
    expect(previewBoxes({ ...defaultCrosshair, '0l': 10 }, 'standing')[0].w).toBeGreaterThan(base[0].w);
    expect(previewBoxes({ ...defaultCrosshair, '0o': 7 }, 'standing')[0].x).toBeGreaterThan(base[0].x);
    expect(previewBoxes({ ...defaultCrosshair, '0t': 5 }, 'standing')[0].h).toBeGreaterThan(base[0].h);
  });
  it('visualizes movement and firing offsets only when enabled', () => {
    const base = { ...defaultCrosshair, '0m': 1, '0f': 1, '0s': 2, '0e': 1 };
    expect(previewBoxes(base, 'moving')[0].x).toBe(base['0o'] + 8);
    expect(previewBoxes(base, 'firing')[0].x).toBe(base['0o'] + 4);
    expect(previewBoxes(base, 'moving-firing')[0].x).toBe(base['0o'] + 12);
    expect(previewBoxes({ ...base, '0m': 0, '0f': 0 }, 'moving-firing')[0].x).toBe(base['0o']);
  });
  it("reads the default profile and a compact known token fixture", () => {
    expect(parseCrosshair("0")).toEqual(defaultCrosshair);
    expect(parseCrosshair("0;P;c;5;h;0;0l;4;0o;2;0f;0;1b;0")).toMatchObject({
      c: 5,
      h: 0,
      "0l": 4,
      "0o": 2,
      "0f": 0,
      "1b": 0,
    });
  });
  it.each(crosshairProfiles)(
    "round trips $name without losing settings",
    (profile) => {
      const r = parseCrosshair(serializeCrosshair(profile.settings));
      expect({ ...r, u: r.u.slice(0, 6) }).toEqual(profile.settings);
      expect(serializeCrosshair(r)).toBe(serializeCrosshair(profile.settings));
    },
  );
  it("supports custom colors and independent vertical lengths", () =>
    expect(parseCrosshair("0;P;c;8;u;abcdefff;0g;1;0v;9")).toMatchObject({
      c: 8,
      u: "ABCDEFFF",
      "0g": 1,
      "0v": 9,
    }));
  it("rejects prototype keys and unsupported color alpha", () => {
    expect(() => parseCrosshair("0;P;constructor;1")).toThrow();
    expect(() => parseCrosshair("0;P;__proto__;1")).toThrow();
    expect(() => parseCrosshair("0;P;u;00000000")).toThrow();
  });
  it.each([
    "",
    "1;P;c;5",
    "0;A;c;5",
    "0;P;c;5;S;d;1",
    "0;P;c;",
    "0;P;c;9",
    "0;P;o;1.5",
    "0;P;c;5;c;6",
    "0;P;0l;-1",
    "0;P;u;nothex",
    "0;P;0l;2.5",
    "0;P;c;Infinity",
  ])("rejects malformed or unsupported profile %s", (code) =>
    expect(() => parseCrosshair(code)).toThrow(),
  );
});
