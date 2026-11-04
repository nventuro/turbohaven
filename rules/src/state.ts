import { readStored, writeStored } from '../../shared/storage.ts';

export interface Saved {
  /** Spoilers the group has turned on. */
  spoilers: string[];
  /** Sections and spoilers the reader keeps collapsed. */
  collapsed: string[];
}

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

const KEY = 'turbohaven';

const isTextList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === 'string');

/** Reads the saved choices, falling back to none if they're missing or unreadable. */
export function readSaved(storage: Storage | undefined): Saved {
  const saved = readStored(storage, KEY);
  const { spoilers, collapsed } = (typeof saved === 'object' && saved ? saved : {}) as Partial<Saved>;
  return { spoilers: isTextList(spoilers) ? spoilers : [], collapsed: isTextList(collapsed) ? collapsed : [] };
}

/** Saves the choices if the browser allows it; they then last only for this visit otherwise. */
export function writeSaved(storage: Storage | undefined, saved: Saved): void {
  writeStored(storage, KEY, saved);
}

/** Reads the spoiler list out of a shared link, or returns null if the link has none. */
export function sharedSpoilers(search: string): string[] | null {
  const value = new URLSearchParams(search).get('spoilers');
  if (value === null) return null;
  return value
    .split(',')
    .filter(Boolean)
    .map((entry) => (/^\d+$/.test(entry) ? `sticker-${entry}` : entry));
}

/** Builds a link that gives whoever opens it this spoiler list. */
export function shareLink(href: string, spoilers: string[]): string {
  const url = new URL(href);
  url.hash = '';
  url.search = '';
  const list = spoilers.map((id) => id.replace(/^sticker-/, '')).join(',');
  return `${url.href}?spoilers=${list}`;
}
