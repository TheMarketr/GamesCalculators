import { useMemo, useState } from 'preact/hooks';
import { generateCircle } from './calculate';
import { Field, ResultMetric, Segmented, copyText, shareResult } from '../../../components/tools/CalculatorUi';

export default function Calculator() {
  const [diameter, setDiameter] = useState(21); const [thickness, setThickness] = useState(1); const [filled, setFilled] = useState<'outline'|'filled'>('outline'); const [grid, setGrid] = useState(true); const [zoom, setZoom] = useState(1); const [copied, setCopied] = useState(false);
  const result = useMemo(() => generateCircle({ diameter, thickness, filled: filled === 'filled' }), [diameter, thickness, filled]);
  const copyRows = async () => { await copyText(`${diameter}×${diameter} Minecraft circle\n${result.rows.join('\n')}`); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  return <div class="calculator calculator--circle">
    <div class="calculator-header"><div><span class="eyebrow">Shape settings</span><h2>Build your circle</h2></div><button class="text-button" type="button" onClick={() => { setDiameter(21); setThickness(1); setFilled('outline'); }}>Reset</button></div>
    <div class="circle-layout"><div class="controls-panel">
      <Field label="Diameter" hint="3–61 blocks"><div class="number-range"><input type="range" min="3" max="61" step="1" value={diameter} onInput={(e) => setDiameter(Number((e.target as HTMLInputElement).value))}/><input type="number" min="3" max="61" value={diameter} onInput={(e) => setDiameter(Math.max(3, Math.min(61, Number((e.target as HTMLInputElement).value))))}/></div></Field>
      <Field label="Thickness" hint="outline only"><div class="number-range"><input type="range" min="1" max={Math.max(1, Math.floor(diameter/2))} value={thickness} disabled={filled === 'filled'} onInput={(e) => setThickness(Number((e.target as HTMLInputElement).value))}/><input type="number" min="1" max={Math.max(1,Math.floor(diameter/2))} value={thickness} disabled={filled === 'filled'} onInput={(e) => setThickness(Number((e.target as HTMLInputElement).value))}/></div></Field>
      <Segmented label="Style" value={filled} options={[{value:'outline',label:'Outline'},{value:'filled',label:'Filled'}]} onChange={setFilled}/>
      <div class="result-grid"><ResultMetric label="Blocks needed" value={result.blockCount}/><ResultMetric label="Dimensions" value={`${diameter} × ${diameter}`}/></div>
      <button class="button button--primary full-button" type="button" onClick={copyRows}>{copied ? 'Copied instructions ✓' : 'Copy row instructions'}</button>
    </div>
    <div class="visual-panel"><div class="visual-toolbar"><strong>Block preview</strong><div><button type="button" class={grid ? 'active' : ''} onClick={() => setGrid(!grid)}>Grid</button><button type="button" onClick={() => setZoom(Math.max(.65,zoom-.15))}>−</button><span>{Math.round(zoom*100)}%</span><button type="button" onClick={() => setZoom(Math.min(1.6,zoom+.15))}>+</button></div></div><div class="circle-canvas"><div class={`block-grid ${grid ? '' : 'no-grid'}`} style={{gridTemplateColumns:`repeat(${diameter},1fr)`,transform:`scale(${zoom})`}}>{result.grid.flat().map((on) => <i class={on ? 'on' : ''}></i>)}</div></div><button class="share-link" type="button" onClick={() => shareResult('Minecraft Circle Generator', `${diameter}×${diameter} ${filled} circle uses ${result.blockCount} blocks.`)}>Share result ↗</button></div>
    </div>
    <details class="row-instructions"><summary>Row-by-row building instructions <span>+</span></summary><ol>{result.rows.map((row) => <li>{row}</li>)}</ol></details>
  </div>;
}
