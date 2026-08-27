import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

export interface SearchEntry {
  title: string;
  game: string;
  description: string;
  href: string;
  keywords: string[];
  type: 'Game' | 'Tool' | 'Guide';
}

interface Props { entries: SearchEntry[]; compact?: boolean }
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export default function GlobalSearch({ entries, compact = false }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const terms = normalize(query).split(' ').filter(Boolean);
    if (!terms.length) return entries.filter((entry) => entry.type === 'Tool').slice(0, 6);
    return entries
      .map((entry) => {
        const haystack = normalize([entry.title, entry.game, entry.description, ...entry.keywords].join(' '));
        const matched = terms.filter((term) => haystack.includes(term)).length;
        const starts = normalize(entry.title).startsWith(terms[0] ?? '') ? 2 : 0;
        return { entry, score: matched * 3 + starts };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 8)
      .map(({ entry }) => entry);
  }, [entries, query]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        rootRef.current?.querySelector('input')?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('pointerdown', handleClick);
    document.addEventListener('keydown', handleShortcut);
    return () => { document.removeEventListener('pointerdown', handleClick); document.removeEventListener('keydown', handleShortcut); };
  }, []);

  return (
    <div class={`global-search ${compact ? 'global-search--compact' : ''}`} ref={rootRef}>
      <label class="sr-only" for={compact ? 'header-search' : 'global-search'}>Search games and tools</label>
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input id={compact ? 'header-search' : 'global-search'} type="search"
        placeholder={compact ? 'Search tools' : 'Search games or tools — try “mine xp”'} value={query}
        onInput={(event) => { setQuery((event.target as HTMLInputElement).value); setOpen(true); }}
        onFocus={() => setOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }} autocomplete="off" />
      <kbd>⌘ K</kbd>
      {open && (
        <div class="search-results" role="listbox" aria-label="Search results">
          <p class="search-results__label">{query ? `${results.length} quick matches` : 'Popular tools'}</p>
          {results.length ? results.map((entry) => (
            <a href={entry.href} class="search-result" role="option">
              <span class="search-result__icon">{entry.type === 'Game' ? 'G' : '↗'}</span>
              <span><strong>{entry.title}</strong><small>{entry.type} · {entry.game}</small></span>
            </a>
          )) : <p class="search-empty">No exact match yet. Try a game, “XP”, “trade” or “value”.</p>}
        </div>
      )}
    </div>
  );
}
