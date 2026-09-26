import type { Crosshair } from './crosshair';

export type PreviewState = 'standing' | 'moving' | 'firing' | 'moving-firing';
export interface PreviewBox { x: number; y: number; w: number; h: number; a: number }

// Settings visualization: error multipliers shift line offsets by four preview units.
// This does not calculate weapon recoil, in-game pixel scale, or bullet spread.
export function previewBoxes(s: Crosshair, state: PreviewState): PreviewBox[] {
  const boxes: PreviewBox[] = [];
  for (const p of ['0', '1'] as const) {
    if (!s[`${p}b`]) continue;
    const length = s[`${p}l`];
    const vertical = s[`${p}g`] ? s[`${p}v`] : length;
    const thickness = s[`${p}t`];
    const movement = (state === 'moving' || state === 'moving-firing') && s[`${p}m`] ? s[`${p}s`] * 4 : 0;
    const firing = (state === 'firing' || state === 'moving-firing') && s[`${p}f`] ? s[`${p}e`] * 4 : 0;
    const offset = s[`${p}o`] + movement + firing;
    const opacity = s[`${p}a`];
    boxes.push(
      { x: offset, y: -thickness / 2, w: length, h: thickness, a: opacity },
      { x: -offset - length, y: -thickness / 2, w: length, h: thickness, a: opacity },
      { x: -thickness / 2, y: offset, w: thickness, h: vertical, a: opacity },
      { x: -thickness / 2, y: -offset - vertical, w: thickness, h: vertical, a: opacity },
    );
  }
  if (s.d) boxes.push({ x: -s.z / 2, y: -s.z / 2, w: s.z, h: s.z, a: s.a });
  return boxes;
}
