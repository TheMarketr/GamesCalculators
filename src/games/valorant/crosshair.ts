// Primary profile token meanings reviewed against genesy/crosshair-codes.
// Independent implementation. Unsupported sections are rejected rather than silently lost.
export interface Crosshair {
  c: number;
  u: string;
  h: number;
  t: number;
  o: number;
  d: number;
  z: number;
  a: number;
  f: number;
  m: number;
  "0b": number;
  "0a": number;
  "0l": number;
  "0v": number;
  "0g": number;
  "0t": number;
  "0o": number;
  "0m": number;
  "0s": number;
  "0f": number;
  "0e": number;
  "1b": number;
  "1a": number;
  "1l": number;
  "1v": number;
  "1g": number;
  "1t": number;
  "1o": number;
  "1m": number;
  "1s": number;
  "1f": number;
  "1e": number;
}
export const defaultCrosshair: Crosshair = {
  c: 0,
  u: "FFFFFF",
  h: 1,
  t: 1,
  o: 0.5,
  d: 0,
  z: 2,
  a: 1,
  f: 1,
  m: 0,
  "0b": 1,
  "0a": 0.8,
  "0l": 6,
  "0v": 6,
  "0g": 0,
  "0t": 2,
  "0o": 3,
  "0m": 0,
  "0s": 1,
  "0f": 1,
  "0e": 1,
  "1b": 1,
  "1a": 0.35,
  "1l": 2,
  "1v": 2,
  "1g": 0,
  "1t": 2,
  "1o": 10,
  "1m": 1,
  "1s": 1,
  "1f": 1,
  "1e": 1,
};
export const colors = [
  "#FFFFFF",
  "#00FF00",
  "#7FFF00",
  "#DFFF00",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FF0000",
];
const booleans = new Set([
  "h",
  "d",
  "f",
  "m",
  "0b",
  "0g",
  "0m",
  "0f",
  "1b",
  "1g",
  "1m",
  "1f",
]);
export function validateCrosshair(s: Crosshair) {
  for (const [key, value] of Object.entries(s)) {
    if (!Object.hasOwn(defaultCrosshair, key))
      throw new Error(`Unsupported crosshair setting: ${key}`);
    if (key === "u") {
      if (typeof value !== "string" || !/^[a-f0-9]{6}(ff)?$/i.test(value))
        throw new Error(
          "Use RGB or opaque RGBA (ending FF); transparency is controlled by layer opacity.",
        );
      continue;
    }
    const n = Number(value),
      opacity = ["o", "a", "0a", "1a"].includes(key),
      multiplier = /^[01][se]$/.test(key),
      max =
        key === "c"
          ? 8
          : booleans.has(key) || opacity
            ? 1
            : multiplier
              ? 3
              : key === "t"
                ? 6
                : key === "z"
                  ? 6
                  : key.endsWith("t")
                    ? 10
                    : 20;
    if (
      !Number.isFinite(n) ||
      n < 0 ||
      n > max ||
      (!opacity && !multiplier && !Number.isInteger(n))
    )
      throw new Error(`Invalid value for ${key}.`);
  }
  return s;
}
export function parseCrosshair(code: string): Crosshair {
  const tokens = code.trim().split(";");
  if (tokens[0] !== "0")
    throw new Error("Expected a VALORANT version 0 profile.");
  if (tokens.length === 1) return { ...defaultCrosshair };
  if (tokens[1] !== "P")
    throw new Error(
      "Only primary profiles beginning 0;P are supported. ADS, sniper and global sections are not edited.",
    );
  if ((tokens.length - 2) % 2) throw new Error("Incomplete key/value pair.");
  const next = { ...defaultCrosshair },
    seen = new Set<string>();
  for (let i = 2; i < tokens.length; i += 2) {
    const key = tokens[i] as keyof Crosshair,
      value = tokens[i + 1];
    if (!Object.hasOwn(next, key) || seen.has(key))
      throw new Error(`Unsupported or repeated token: ${key}`);
    seen.add(key);
    if (key === "u") next.u = value.toUpperCase();
    else {
      if (value.trim() === "") throw new Error("Empty numeric value.");
      next[key] = Number(value);
    }
  }
  return validateCrosshair(next);
}
export function serializeCrosshair(s: Crosshair) {
  validateCrosshair(s);
  return (
    "0;P;" +
    Object.entries(s)
      .map(
        ([key, value]) =>
          `${key};${key === "u" ? String(value).slice(0, 6).toUpperCase() + "FF" : value}`,
      )
      .join(";")
  );
}
export const crosshairProfiles = [
  {
    id: "cyan-classic",
    name: "Cyan classic",
    style: "Classic",
    priority: "Precision",
    settings: {
      ...defaultCrosshair,
      c: 5,
      h: 0,
      f: 0,
      "0a": 1,
      "0l": 4,
      "0t": 2,
      "0o": 2,
      "0f": 0,
      "1b": 0,
    },
  },
  {
    id: "green-dot",
    name: "Green dot",
    style: "Dot",
    priority: "Minimal obstruction",
    settings: {
      ...defaultCrosshair,
      c: 1,
      d: 1,
      z: 2,
      h: 1,
      f: 0,
      "0b": 0,
      "1b": 0,
    },
  },
  {
    id: "white-outline",
    name: "White outlined",
    style: "Medium",
    priority: "Visibility",
    settings: {
      ...defaultCrosshair,
      c: 0,
      h: 1,
      o: 1,
      f: 0,
      "0a": 1,
      "0l": 5,
      "0o": 3,
      "0f": 0,
      "1b": 0,
    },
  },
  {
    id: "yellow-small",
    name: "Yellow small",
    style: "Small",
    priority: "Minimal obstruction",
    settings: {
      ...defaultCrosshair,
      c: 4,
      h: 0,
      f: 0,
      "0a": 1,
      "0l": 3,
      "0t": 1,
      "0o": 2,
      "0f": 0,
      "1b": 0,
    },
  },
  {
    id: "magenta-box",
    name: "Magenta hollow box",
    style: "Circle",
    priority: "Visibility",
    settings: {
      ...defaultCrosshair,
      c: 6,
      h: 0,
      f: 0,
      "0a": 1,
      "0l": 2,
      "0t": 4,
      "0o": 2,
      "0f": 0,
      "1b": 0,
    },
  },
  {
    id: "red-large",
    name: "Red large",
    style: "Large",
    priority: "Visibility",
    settings: {
      ...defaultCrosshair,
      c: 7,
      h: 1,
      o: 1,
      f: 0,
      "0a": 1,
      "0l": 8,
      "0t": 2,
      "0o": 4,
      "0f": 0,
      "1b": 0,
    },
  },
].map((p) => ({
  ...p,
  source: "GamesCalculators original practice profile",
  sourceUrl:
    "https://playvalorant.com/en-gb/news/game-updates/valorant-patch-notes-4-05/",
  reviewedAt: "2026-09-25",
  unit: "crosshair settings",
  note:
    p.style === "Circle"
      ? "Pixel hollow-box approximation, not a smooth circle."
      : "Original profile; no professional-player association.",
}));
