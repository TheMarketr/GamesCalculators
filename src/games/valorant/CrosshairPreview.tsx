import { colors, type Crosshair } from './crosshair';
import { previewBoxes, type PreviewState } from './preview-geometry';

export default function CrosshairPreview({ settings: s, background = 'dark', zoom = 2, state = 'standing', brightness = 100 }: {
  settings: Crosshair;
  background?: string;
  zoom?: number;
  state?: PreviewState;
  brightness?: number;
}) {
  const color = s.c === 8 ? '#' + s.u.slice(0, 6) : colors[s.c];
  const boxes = previewBoxes(s, state);
  return <div class={`crosshair-preview crosshair-preview--${background}`} style={{ '--preview-brightness': `${brightness}%` }}>
    <svg viewBox="-70 -46 140 92" role="img" aria-label={`${state.replace('-', ' and ')} crosshair settings preview at ${zoom} times scale`}>
      <g transform={`scale(${zoom})`}>
        {!!s.h && boxes.map((b, i) => <rect key={`outline-${i}`} x={b.x - s.t} y={b.y - s.t} width={b.w + 2 * s.t} height={b.h + 2 * s.t} fill="#000" opacity={s.o * b.a} />)}
        {boxes.map((b, i) => <rect key={`line-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={color} opacity={b.a} />)}
      </g>
    </svg>
  </div>;
}
