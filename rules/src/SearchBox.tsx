import { useEffect, useMemo, useRef, useState } from 'react';
import { find, type RulesIndex } from './search.ts';

const SHORTEST_QUERY = 2;

interface Props {
  index: RulesIndex;
  onPick: (id: string) => void;
}

export function SearchBox({ index, onPick }: Props) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const hits = useMemo(() => (trimmed.length < SHORTEST_QUERY ? [] : find(index, trimmed)), [index, trimmed]);

  useEffect(() => {
    const focusOnSlash = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement;
      if (event.key === '/' && !typing) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', focusOnSlash);
    return () => window.removeEventListener('keydown', focusOnSlash);
  }, []);

  const pick = (id: string) => {
    setQuery('');
    onPick(id);
  };

  return (
    <search className="search">
      <input
        ref={input}
        type="search"
        aria-label="Search the rules"
        placeholder="Search the rules"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setQuery('');
          if (event.key === 'Enter' && hits[0]) pick(hits[0].id);
        }}
      />
      {trimmed.length >= SHORTEST_QUERY && (
        <div className="results">
          {hits.length === 0 && <p>Nothing found for “{trimmed}”. Sealed stickers aren't searched.</p>}
          {hits.map((hit) => (
            <button type="button" key={hit.id} onClick={() => pick(hit.id)}>
              <strong>{hit.title}</strong>
              <span>
                {hit.before}
                <mark>{hit.match}</mark>
                {hit.after}
              </span>
            </button>
          ))}
        </div>
      )}
    </search>
  );
}
