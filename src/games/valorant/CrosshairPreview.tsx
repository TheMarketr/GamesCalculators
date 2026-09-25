import { colors, type Crosshair } from "./crosshair";
export default function CrosshairPreview({
  settings: s,
  background = "dark",
  zoom = 3,
}: {
  settings: Crosshair;
  background?: string;
  zoom?: number;
}) {
  const color = s.c === 8 ? "#" + s.u.slice(0, 6) : colors[s.c];
  const boxes: { x: number; y: number; w: number; h: number; a: number }[] = [];
  for (const p of ["0", "1"] as const) {
    if (!s[`${p}b`]) continue;
    const l = s[`${p}l`],
      v = s[`${p}g`] ? s[`${p}v`] : l,
      t = s[`${p}t`],
      o = s[`${p}o`],
      a = s[`${p}a`];
    boxes.push(
      { x: o, y: -t / 2, w: l, h: t, a },
      { x: -o - l, y: -t / 2, w: l, h: t, a },
      { x: -t / 2, y: o, w: t, h: v, a },
      { x: -t / 2, y: -o - v, w: t, h: v, a },
    );
  }
  if (s.d) boxes.push({ x: -s.z / 2, y: -s.z / 2, w: s.z, h: s.z, a: s.a });
  const extent =
    Math.max(
      1,
      ...boxes.flatMap((b) => [Math.abs(b.x) + b.w, Math.abs(b.y) + b.h]),
    ) + (s.h ? s.t : 0);
  const fitZoom = Math.min(zoom, 60 / extent);
  return (
    <div class={`crosshair-preview crosshair-preview--${background}`}>
      <svg
        viewBox="-100 -65 200 130"
        role="img"
        aria-label="Static primary crosshair preview"
      >
        <g transform={`scale(${fitZoom})`}>
          {!!s.h &&
            boxes.map((b) => (
              <rect
                x={b.x - s.t}
                y={b.y - s.t}
                width={b.w + 2 * s.t}
                height={b.h + 2 * s.t}
                fill="#000"
                opacity={s.o}
              />
            ))}
          {boxes.map((b) => (
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill={color}
              opacity={b.a}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
