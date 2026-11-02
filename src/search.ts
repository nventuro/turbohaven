import MiniSearch from 'minisearch';
import { isShown, withoutReplacedText, type SpoilerState } from './compose.ts';
import type { Section } from './types.ts';

interface SearchDoc {
  id: string;
  title: string;
  text: string;
}

export interface SearchHit {
  id: string;
  title: string;
  before: string;
  match: string;
  after: string;
}

export type RulesIndex = MiniSearch<SearchDoc>;

const SNIPPET_REACH = 70;

/** Reduces rule html to searchable text, keeping what each icon stands for. */
export function plainText(html: string): string {
  return html
    .replace(/<img[^>]*\balt="([^"]*)"[^>]*>/g, (_, alt: string) => ` ${alt.replace(/ icon$/i, '')} `)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function documents(sections: Section[], state: SpoilerState): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const walk = (section: Section) => {
    const text = plainText(withoutReplacedText(section.html, state));
    docs.push({ id: section.id, title: section.title, text });
    section.children.forEach(walk);
  };
  sections.forEach(walk);
  // Only shown spoilers are indexed, so a search can never hint at a sealed one.
  for (const { id, title, html } of Object.values(state.loaded)) {
    if (isShown(state, id)) docs.push({ id, title, text: plainText(html) });
  }
  return docs;
}

export function buildIndex(sections: Section[], state: SpoilerState): RulesIndex {
  const index: RulesIndex = new MiniSearch<SearchDoc>({
    fields: ['title', 'text'],
    storeFields: ['title', 'text'],
    searchOptions: { boost: { title: 3 }, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
  });
  index.addAll(documents(sections, state));
  return index;
}

function snippet(text: string, terms: string[]): Pick<SearchHit, 'before' | 'match' | 'after'> {
  const lower = text.toLowerCase();
  const positions = terms
    .map((term) => ({ term, at: lower.indexOf(term.toLowerCase()) }))
    .filter(({ at }) => at >= 0)
    .sort((a, b) => a.at - b.at);
  if (positions.length === 0) return { before: '', match: '', after: text.slice(0, SNIPPET_REACH * 2) };

  const { term, at } = positions[0];
  const end = at + term.length;
  return {
    before: (at > SNIPPET_REACH ? '…' : '') + text.slice(Math.max(0, at - SNIPPET_REACH), at),
    match: text.slice(at, end),
    after: text.slice(end, end + SNIPPET_REACH) + (end + SNIPPET_REACH < text.length ? '…' : ''),
  };
}

/** Finds the rules matching `query`, best match first. */
export function find(index: RulesIndex, query: string, limit = 12): SearchHit[] {
  return index
    .search(query)
    .slice(0, limit)
    .map((result) => ({
      id: String(result.id),
      title: result.title as string,
      ...snippet(result.text as string, result.terms),
    }));
}
