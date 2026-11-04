import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { loadJson } from '../../shared/load.ts';
import { SiteHeader } from '../../shared/SiteHeader.tsx';
import { browserStorage } from '../../shared/storage.ts';
import { Contents } from './Contents.tsx';
import type { SpoilerState } from './compose.ts';
import { buildIndex } from './search.ts';
import { SearchBox } from './SearchBox.tsx';
import { SectionView } from './SectionView.tsx';
import { SpoilerPanel } from './SpoilerPanel.tsx';
import { readSaved, sharedSpoilers, writeSaved } from './state.ts';
import type { Rulebook, SpoilerContent } from './types.ts';

const withEntry = (set: Set<string>, id: string) => new Set(set).add(id);
const withoutEntries = (set: Set<string>, ids: string[]) => {
  const next = new Set(set);
  ids.forEach((id) => next.delete(id));
  return next;
};

export function App() {
  const [saved] = useState(() => readSaved(browserStorage()));
  const [rulebook, setRulebook] = useState<Rulebook | null>(null);
  const [rulebookFailed, setRulebookFailed] = useState(false);

  const [added, setAdded] = useState(() => new Set(sharedSpoilers(window.location.search) ?? saved.spoilers));
  const [loaded, setLoaded] = useState<Record<string, SpoilerContent>>({});
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const requested = useRef(new Set<string>());

  // Collapsed is what the reader chose and is saved. Revealed is what a link or
  // search opened for this visit, so a section the reader keeps collapsed stays
  // that way next time.
  const [collapsed, setCollapsed] = useState(() => new Set(saved.collapsed));
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const [contentsOpen, setContentsOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    loadJson<Rulebook>('content/rulebook.json').then(setRulebook, () => setRulebookFailed(true));
  }, []);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('spoilers')) return;
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  }, []);

  useEffect(() => {
    if (!rulebook) return;
    for (const id of added) {
      if (requested.current.has(id) || !rulebook.spoilers.some((spoiler) => spoiler.id === id)) continue;
      requested.current.add(id);
      loadJson<SpoilerContent>(`content/spoilers/${id}.json`).then(
        (content) => setLoaded((current) => ({ ...current, [id]: content })),
        () => setFailed((current) => withEntry(current, id)),
      );
    }
  }, [rulebook, added]);

  useEffect(() => {
    writeSaved(browserStorage(), { spoilers: [...added], collapsed: [...collapsed] });
  }, [added, collapsed]);

  const reveal = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const path: string[] = [];
    for (
      let details = target.closest('details');
      details;
      details = details.parentElement?.closest('details') ?? null
    ) {
      if (details.id) path.push(details.id);
    }
    flushSync(() => setRevealed((current) => new Set([...current, ...path])));
    target.scrollIntoView();
  }, []);

  const goTo = useCallback(
    (id: string) => {
      window.history.pushState(null, '', `#${id}`);
      setContentsOpen(false);
      reveal(id);
    },
    [reveal],
  );

  useEffect(() => {
    const followHash = () => reveal(window.location.hash.slice(1));
    window.addEventListener('hashchange', followHash);
    return () => window.removeEventListener('hashchange', followHash);
  }, [reveal]);

  useEffect(() => {
    if (rulebook && window.location.hash) reveal(window.location.hash.slice(1));
  }, [rulebook, reveal]);

  const toggle = (id: string, isOpen: boolean) => {
    if (isOpen) {
      setRevealed((current) => withoutEntries(current, [id]));
      setCollapsed((current) => withEntry(current, id));
    } else {
      setCollapsed((current) => withoutEntries(current, [id]));
    }
  };

  const handleRulesClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (link) {
      event.preventDefault();
      goTo(link.hash.slice(1));
      return;
    }
    const details = target.closest('summary')?.parentElement;
    if (details instanceof HTMLDetailsElement) {
      event.preventDefault();
      toggle(details.id, details.open);
    }
  };

  const toggleSpoiler = (id: string) => {
    if (added.has(id)) {
      setAdded((current) => withoutEntries(current, [id]));
      return;
    }
    const path = rulebook?.spoilers.find((spoiler) => spoiler.id === id)?.sectionPath ?? [];
    setAdded((current) => withEntry(current, id));
    setCollapsed((current) => withoutEntries(current, [...path, id]));
  };

  const spoilerState: SpoilerState = useMemo(
    () => ({ spoilers: rulebook?.spoilers ?? [], added, loaded, failed }),
    [rulebook, added, loaded, failed],
  );
  const closed = useMemo(() => withoutEntries(collapsed, [...revealed]), [collapsed, revealed]);
  const index = useMemo(() => buildIndex(rulebook?.sections ?? [], spoilerState), [rulebook, spoilerState]);

  if (rulebookFailed) {
    return <p className="load-error">The rulebook didn't load. Reload the page to try again.</p>;
  }

  return (
    <>
      <SiteHeader
        app="rules"
        start={
          <button type="button" className="contents-button" onClick={() => setContentsOpen((open) => !open)}>
            Contents
          </button>
        }
      >
        <SearchBox index={index} onPick={goTo} />
        <button type="button" className="spoilers-button" onClick={() => setPanelOpen(true)}>
          Spoilers
          <span className="seal">{added.size}</span>
        </button>
      </SiteHeader>

      <div className="layout">
        <nav className={contentsOpen ? 'sidebar open' : 'sidebar'} aria-label="Contents">
          {rulebook && <Contents sections={rulebook.sections} closed={closed} onPick={goTo} onToggle={toggle} />}
        </nav>

        <main className="rules" onClick={handleRulesClick}>
          {rulebook?.sections.map((section) => (
            <SectionView key={section.id} section={section} spoilers={spoilerState} closed={closed} />
          ))}
        </main>
      </div>

      {rulebook && (
        <SpoilerPanel
          open={panelOpen}
          spoilers={rulebook.spoilers}
          added={added}
          onToggle={toggleSpoiler}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </>
  );
}
