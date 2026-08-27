import { useEffect, useMemo, useState } from 'preact/hooks';
import { shareResult } from '../../components/tools/CalculatorUi';
import { getToolCatalog, type CatalogItem } from '../../data/tool-catalogs';
import { formatCompact } from '../../utils/format';
import { calculateSecondary, type CalculationMetric } from './calculate';
import { getCalculatorProfile, getSecondaryMode } from './profiles';

type Props = { gameSlug: string; toolSlug: string; toolName: string };
type SortMode = 'score' | 'name' | 'value' | 'rating';

function routeCatalog(gameSlug: string, toolSlug: string) {
  let items = getToolCatalog(gameSlug, toolSlug);
  if (gameSlug === '99-nights' && (toolSlug === 'characters' || toolSlug === 'class-comparison')) items = items.filter((item) => item.category === 'role profile');
  if (gameSlug === '99-nights' && toolSlug === 'items') items = items.filter((item) => item.category !== 'role profile');
  if (gameSlug === '99-nights' && toolSlug === 'crafting') items = items.filter((item) => item.category === 'crafting');
  if (gameSlug === 'mm2' && toolSlug === 'knife-values') items = items.filter((item) => item.category === 'knife');
  if (gameSlug === 'mm2' && toolSlug === 'godly-values') items = items.filter((item) => item.rarity === 'godly');
  return items;
}

function formatMetric(metric: CalculationMetric) {
  if (typeof metric.value === 'string') return metric.value;
  if (metric.format === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(metric.value);
  if (metric.format === 'compact') return formatCompact(metric.value);
  if (metric.format === 'percent') return `${metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
  if (metric.format === 'duration') {
    const seconds = Math.max(0, metric.value);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remainder = Math.round(seconds % 60);
    return [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}m`, remainder && `${remainder}s`].filter(Boolean).join(' ') || '0s';
  }
  return metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function FormulaWorkbench({ gameSlug, toolSlug, toolName }: Props) {
  const profile = getCalculatorProfile(gameSlug, toolSlug);
  const defaults = useMemo(() => Object.fromEntries(profile?.fields.map((item) => [item.key, item.defaultValue]) ?? []), [profile]);
  const [values, setValues] = useState<Record<string, number>>(defaults);
  const storageKey = `gc:recent:${gameSlug}:${toolSlug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setValues({ ...defaults, ...JSON.parse(saved) });
    } catch { /* Ignore invalid local state. */ }
  }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(values)); }, [storageKey, values]);

  if (!profile) return <div class="calculator universal-tool"><p class="assumption-note">This calculator configuration could not be loaded.</p></div>;
  const metrics = calculateSecondary(profile.formula, values);
  const summary = metrics.map((metric) => `${metric.label}: ${formatMetric(metric)}${metric.suffix ?? ''}`).join(' · ');

  return <div class="calculator universal-tool">
    <div class="calculator-header"><div><span class="eyebrow">{profile.eyebrow}</span><h2>{profile.heading}</h2></div><button class="text-button" type="button" onClick={() => setValues(defaults)}>Reset</button></div>
    <div class="secondary-input-grid">
      {profile.fields.map((item) => <label class="calc-field" key={item.key}><span>{item.label}{item.suffix && <small>{item.suffix}</small>}</span><input type="number" min={item.min} max={item.max} step={item.step} value={values[item.key] ?? item.defaultValue} onInput={(event) => setValues({ ...values, [item.key]: Number((event.currentTarget as HTMLInputElement).value) })}/></label>)}
    </div>
    <div class="secondary-result-grid" aria-live="polite">
      {metrics.map((metric) => <div class={`result-metric result-metric--${metric.tone ?? 'default'}`} key={metric.label}><span>{metric.label}</span><strong>{formatMetric(metric)}{metric.suffix && <small>{metric.suffix}</small>}</strong></div>)}
    </div>
    <div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult(toolName, summary)}>Share result</button><button class="button button--secondary" type="button" onClick={() => navigator.clipboard.writeText(summary)}>Copy result</button></div>
    <p class="assumption-note">{profile.note} Inputs are saved only on this device.</p>
  </div>;
}

function ReferenceExplorer({ gameSlug, toolSlug, toolName }: Props) {
  const catalog = useMemo(() => routeCatalog(gameSlug, toolSlug), [gameSlug, toolSlug]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortMode>(toolSlug.startsWith('best-') ? 'score' : 'value');
  const categories = ['all', ...new Set(catalog.map((item) => item.category))];
  const filtered = [...catalog].filter((item) => (category === 'all' || item.category === category) && `${item.name} ${item.category} ${item.rarity} ${item.note}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'score') return (b.value * b.rating) - (a.value * a.rating);
    return b.value - a.value;
  });

  return <div class="calculator universal-tool">
    <div class="calculator-header"><div><span class="eyebrow">Searchable local reference</span><h2>Explore {toolName.replace(/^(Grow a Garden|Blox Fruits|Steal a Brainrot|99 Nights|Adopt Me|MM2|Pet Simulator 99|GTA VI)\s+/, '')}</h2></div><span class="reference-count">{filtered.length} shown</span></div>
    <div class="reference-controls"><label class="calc-field"><span>Search</span><input type="search" value={query} placeholder="Search names, categories or rarity" onInput={(event) => setQuery((event.currentTarget as HTMLInputElement).value)}/></label><label class="calc-field"><span>Category</span><select value={category} onChange={(event) => setCategory((event.currentTarget as HTMLSelectElement).value)}>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></label><label class="calc-field"><span>Sort by</span><select value={sort} onChange={(event) => setSort((event.currentTarget as HTMLSelectElement).value as SortMode)}><option value="value">Value / power</option><option value="rating">Demand / utility</option><option value="score">Combined score</option><option value="name">Name</option></select></label></div>
    <div class="interactive-table-wrap"><table class="interactive-table"><thead><tr><th>Name</th><th>Category</th><th>Tier</th><th>Reference</th><th>Rating</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.slug}><th scope="row"><strong>{item.name}</strong><small>{item.note}</small></th><td>{item.category}</td><td><span class="value-badge">{item.rarity}</span></td><td>{formatCompact(item.value)}</td><td>{item.rating.toFixed(1)} / 10</td></tr>)}</tbody></table></div>
    {!filtered.length && <div class="empty-state"><strong>No matching entries</strong><small>Try a broader search or reset the category.</small></div>}
    <p class="assumption-note">Values and ratings are editable local planning references. Check the update date and current game patch before making a trade or purchase decision.</p>
  </div>;
}

function ComparisonWorkbench({ gameSlug, toolSlug, toolName }: Props) {
  const catalog = useMemo(() => routeCatalog(gameSlug, toolSlug), [gameSlug, toolSlug]);
  const [leftSlug, setLeftSlug] = useState(catalog[0]?.slug ?? '');
  const [rightSlug, setRightSlug] = useState(catalog[1]?.slug ?? catalog[0]?.slug ?? '');
  const left = catalog.find((item) => item.slug === leftSlug) ?? catalog[0];
  const right = catalog.find((item) => item.slug === rightSlug) ?? catalog[1] ?? catalog[0];
  if (!left || !right) return <div class="calculator universal-tool"><p class="assumption-note">No comparison records are available.</p></div>;
  const valueGap = right.value ? (left.value - right.value) / right.value * 100 : 0;
  const score = (item: CatalogItem) => item.value * (.5 + item.rating / 20);
  const winner = score(left) >= score(right) ? left : right;

  return <div class="calculator universal-tool">
    <div class="calculator-header"><div><span class="eyebrow">Side-by-side comparison</span><h2>Compare two options</h2></div><button class="text-button" type="button" onClick={() => { setLeftSlug(right.slug); setRightSlug(left.slug); }}>Swap</button></div>
    <div class="comparison-picker-grid"><label class="calc-field"><span>First option</span><select value={leftSlug} onChange={(event) => setLeftSlug((event.currentTarget as HTMLSelectElement).value)}>{catalog.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label><span aria-hidden="true">VS</span><label class="calc-field"><span>Second option</span><select value={rightSlug} onChange={(event) => setRightSlug((event.currentTarget as HTMLSelectElement).value)}>{catalog.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label></div>
    <div class="comparison-cards"><article><span>{left.category}</span><h3>{left.name}</h3><strong>{formatCompact(left.value)}</strong><p>Rating {left.rating.toFixed(1)} / 10</p><small>{left.note}</small></article><article><span>{right.category}</span><h3>{right.name}</h3><strong>{formatCompact(right.value)}</strong><p>Rating {right.rating.toFixed(1)} / 10</p><small>{right.note}</small></article></div>
    <div class="secondary-result-grid"><div class="result-metric"><span>Value gap</span><strong>{valueGap >= 0 ? '+' : ''}{valueGap.toFixed(1)}%</strong></div><div class="result-metric result-metric--good"><span>Higher blended score</span><strong>{winner.name}</strong></div></div>
    <div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult(toolName, `${left.name} vs ${right.name}: ${winner.name} has the higher blended planning score.`)}>Share comparison</button></div>
    <p class="assumption-note">The blended score combines the displayed local reference and rating. Use it as one planning signal, not a guaranteed ranking.</p>
  </div>;
}

function TradeSide({ title, catalog, selected, onChange }: { title: string; catalog: CatalogItem[]; selected: string[]; onChange: (items: string[]) => void }) {
  const [choice, setChoice] = useState(catalog[0]?.slug ?? '');
  const total = selected.reduce((sum, slug) => sum + (catalog.find((item) => item.slug === slug)?.value ?? 0), 0);
  return <section class="offer-panel"><div class="offer-heading"><div><span>{title}</span><strong>{selected.length} / 4 items</strong></div></div><div class="item-picker"><select aria-label={`Choose an item for ${title}`} value={choice} onChange={(event) => setChoice((event.currentTarget as HTMLSelectElement).value)}>{catalog.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select><button type="button" disabled={!choice || selected.length >= 4} onClick={() => onChange([...selected, choice])}>+ Add</button></div><div class="offer-items">{selected.length ? selected.map((slug, index) => { const item = catalog.find((candidate) => candidate.slug === slug); return item && <div class="offer-item" key={`${slug}-${index}`}><span class="item-orb">{item.name.slice(0, 2).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.rarity} · Rating {item.rating.toFixed(1)}</small></span><b>{formatCompact(item.value)}</b><button type="button" aria-label={`Remove ${item.name}`} onClick={() => onChange(selected.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>; }) : <div class="empty-state"><span>＋</span><strong>Add your first item</strong><small>Up to four entries per side.</small></div>}</div><div class="offer-total"><span>Total reference</span><strong>{formatCompact(total)}</strong></div></section>;
}

function TradeWorkbench({ gameSlug, toolSlug, toolName }: Props) {
  const catalog = useMemo(() => routeCatalog(gameSlug, toolSlug), [gameSlug, toolSlug]);
  const [yours, setYours] = useState<string[]>([]);
  const [theirs, setTheirs] = useState<string[]>([]);
  const sum = (slugs: string[]) => slugs.reduce((total, slug) => total + (catalog.find((item) => item.slug === slug)?.value ?? 0), 0);
  const yourTotal = sum(yours); const theirTotal = sum(theirs); const difference = theirTotal - yourTotal;
  const percentage = yourTotal ? difference / yourTotal * 100 : theirTotal ? 100 : 0;
  const verdict = Math.abs(percentage) <= 7 ? 'FAIR' : percentage > 7 ? 'WIN' : 'LOSE';
  return <div class="calculator universal-tool"><div class="calculator-header"><div><span class="eyebrow">Multi-item comparison</span><h2>Build both sides of the trade</h2></div><button class="text-button" type="button" onClick={() => { setYours([]); setTheirs([]); }}>Clear</button></div><div class="trade-grid"><TradeSide title="Your offer" catalog={catalog} selected={yours} onChange={setYours}/><button class="swap-button" type="button" aria-label="Swap trade sides" onClick={() => { setYours(theirs); setTheirs(yours); }}>⇄</button><TradeSide title="Their offer" catalog={catalog} selected={theirs} onChange={setTheirs}/></div><div class={`wfl-result verdict-${verdict.toLowerCase()}`}><span>Trade result</span><strong>{verdict}</strong><p>{difference >= 0 ? 'Their side adds' : 'Your side adds'} {formatCompact(Math.abs(difference))} of local reference value.</p><div class="wfl-bar"><i style={{ width: `${Math.min(100, Math.abs(percentage))}%` }}></i><b></b></div><div><span>Your offer {formatCompact(yourTotal)}</span><span>Their offer {formatCompact(theirTotal)}</span></div></div><div class="calculator-actions"><button class="button button--primary" type="button" disabled={!yours.length && !theirs.length} onClick={() => shareResult(toolName, `${verdict}: ${formatCompact(yourTotal)} vs ${formatCompact(theirTotal)} (${percentage.toFixed(1)}% gap).`)}>Share result</button></div><p class="assumption-note">The fair band is ±7%. Local references and demand can change after a patch, so confirm important trades in the current market.</p></div>;
}

function PortfolioWorkbench({ gameSlug, toolSlug, toolName }: Props) {
  const catalog = useMemo(() => routeCatalog(gameSlug, toolSlug), [gameSlug, toolSlug]);
  const storageKey = `gc:recent:${gameSlug}:${toolSlug}:portfolio`;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  useEffect(() => { try { const saved = localStorage.getItem(storageKey); if (saved) setQuantities(JSON.parse(saved)); } catch { /* Ignore invalid local state. */ } }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(quantities)); }, [storageKey, quantities]);
  const total = catalog.reduce((sum, item) => sum + item.value * (quantities[item.slug] ?? 0), 0);
  const count = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const selected = catalog.filter((item) => (quantities[item.slug] ?? 0) > 0);
  return <div class="calculator universal-tool"><div class="calculator-header"><div><span class="eyebrow">Inventory builder</span><h2>Select items and quantities</h2></div><button class="text-button" type="button" onClick={() => setQuantities({})}>Clear</button></div><div class="portfolio-list">{catalog.map((item) => <label key={item.slug}><span class="item-orb">{item.name.slice(0, 2).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.rarity} · {formatCompact(item.value)} each</small></span><input aria-label={`${item.name} quantity`} type="number" min="0" max="999" value={quantities[item.slug] ?? 0} onInput={(event) => setQuantities({ ...quantities, [item.slug]: Math.max(0, Number((event.currentTarget as HTMLInputElement).value)) })}/></label>)}</div><div class="secondary-result-grid"><div class="result-metric"><span>Total items</span><strong>{count.toLocaleString()}</strong></div><div class="result-metric result-metric--good"><span>Total reference value</span><strong>{formatCompact(total)}</strong></div><div class="result-metric"><span>Unique entries</span><strong>{selected.length}</strong></div></div><div class="calculator-actions"><button class="button button--primary" type="button" disabled={!count} onClick={() => shareResult(toolName, `${count} items across ${selected.length} entries: ${formatCompact(total)} total reference value.`)}>Share total</button></div><p class="assumption-note">Your selections stay on this device. Values are local planning references and should be checked against the current market.</p></div>;
}

function CollectionTracker({ gameSlug, toolSlug, toolName }: Props) {
  const catalog = useMemo(() => routeCatalog(gameSlug, toolSlug), [gameSlug, toolSlug]);
  const storageKey = `gc:progress:${gameSlug}:${toolSlug}`;
  const [collected, setCollected] = useState<string[]>([]);
  useEffect(() => { try { const saved = localStorage.getItem(storageKey); if (saved) setCollected(JSON.parse(saved)); } catch { /* Ignore invalid local state. */ } }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(collected)); }, [storageKey, collected]);
  const completion = catalog.length ? collected.length / catalog.length * 100 : 0;
  return <div class="calculator universal-tool"><div class="calculator-header"><div><span class="eyebrow">Saved on this device</span><h2>Track collection progress</h2></div><button class="text-button" type="button" onClick={() => setCollected([])}>Clear</button></div><div class="tracker-progress"><div><span>Collection progress</span><strong>{collected.length} / {catalog.length}</strong></div><i><b style={{ width: `${completion}%` }}></b></i><small>{completion.toFixed(0)}% complete</small></div><div class="tracker-grid">{catalog.map((item) => { const checked = collected.includes(item.slug); return <label class={checked ? 'checked' : ''} key={item.slug}><input type="checkbox" checked={checked} onChange={() => setCollected(checked ? collected.filter((slug) => slug !== item.slug) : [...collected, item.slug])}/><span><strong>{item.name}</strong><small>{item.rarity} · {item.category}</small></span></label>; })}</div><div class="calculator-actions"><button class="button button--primary" type="button" onClick={() => shareResult(toolName, `${collected.length} of ${catalog.length} entries collected (${completion.toFixed(0)}%).`)}>Share progress</button></div><p class="assumption-note">Progress stays in this browser and can be cleared from Privacy Settings.</p></div>;
}

function CodesTracker({ gameSlug, toolSlug }: Props) {
  const storageKey = `gc:progress:${gameSlug}:${toolSlug}`;
  const [input, setInput] = useState('');
  const [codes, setCodes] = useState<{ code: string; redeemed: boolean }[]>([]);
  useEffect(() => { try { const saved = localStorage.getItem(storageKey); if (saved) setCodes(JSON.parse(saved)); } catch { /* Ignore invalid local state. */ } }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(codes)); }, [storageKey, codes]);
  const add = () => { const code = input.trim(); if (code && !codes.some((item) => item.code.toLowerCase() === code.toLowerCase())) { setCodes([...codes, { code, redeemed: false }]); setInput(''); } };
  return <div class="calculator universal-tool"><div class="calculator-header"><div><span class="eyebrow">Local redemption log</span><h2>Track codes you want to try</h2></div><span class="reference-count">{codes.filter((item) => item.redeemed).length} redeemed</span></div><div class="code-entry"><label class="calc-field"><span>Code</span><input value={input} placeholder="Enter a code exactly as shown" onInput={(event) => setInput((event.currentTarget as HTMLInputElement).value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); add(); } }}/></label><button class="button button--primary" type="button" onClick={add}>Add code</button></div><div class="tracker-grid">{codes.map((item) => <label class={item.redeemed ? 'checked' : ''} key={item.code}><input type="checkbox" checked={item.redeemed} onChange={() => setCodes(codes.map((entry) => entry.code === item.code ? { ...entry, redeemed: !entry.redeemed } : entry))}/><span><strong>{item.code}</strong><small>{item.redeemed ? 'Marked redeemed' : 'Waiting to try'}</small></span><button type="button" aria-label={`Remove ${item.code}`} onClick={(event) => { event.preventDefault(); setCodes(codes.filter((entry) => entry.code !== item.code)); }}>×</button></label>)}</div>{!codes.length && <div class="empty-state"><strong>No saved codes yet</strong><small>Add a code from an official game announcement or a source you trust.</small></div>}<div class="calculator-actions"><button class="button button--secondary" type="button" disabled={!codes.length} onClick={() => navigator.clipboard.writeText(codes.filter((item) => !item.redeemed).map((item) => item.code).join('\n'))}>Copy unredeemed codes</button></div><p class="assumption-note">This page does not invent or promise active codes. It gives you a private checklist for codes you find and verify.</p></div>;
}

export default function Calculator(props: Props) {
  const mode = getSecondaryMode(props.gameSlug, props.toolSlug);
  if (mode === 'codes') return <CodesTracker {...props}/>;
  if (mode === 'tracker') return <CollectionTracker {...props}/>;
  if (mode === 'trade') return <TradeWorkbench {...props}/>;
  if (mode === 'portfolio') return <PortfolioWorkbench {...props}/>;
  if (mode === 'comparison') return <ComparisonWorkbench {...props}/>;
  if (mode === 'reference') return <ReferenceExplorer {...props}/>;
  return <FormulaWorkbench {...props}/>;
}
