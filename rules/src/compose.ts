import type { Spoiler, SpoilerContent } from './types.ts';

export interface SpoilerState {
  spoilers: Spoiler[];
  /** Spoilers the group has turned on. */
  added: Set<string>;
  /** Text of the spoilers fetched so far. */
  loaded: Record<string, SpoilerContent>;
  /** Spoilers whose text couldn't be fetched. */
  failed: Set<string>;
}

const REPLACED = /<div data-replaced-by="([^"]+)">[\s\S]*?<\/div>/g;
const SLOT = /<div data-spoiler="([^"]+)"><\/div>/g;
const EMPTY_ITEM = /<li>\s*<\/li>/g;

export function isShown(state: SpoilerState, id: string): boolean {
  return state.added.has(id) && id in state.loaded;
}

/** Removes the printed text that shown spoilers cover, and keeps the rest of `html`. */
export function withoutReplacedText(html: string, state: SpoilerState): string {
  return html.replace(REPLACED, (block, id: string) => (isShown(state, id) ? '' : block));
}

function slotHtml(id: string, state: SpoilerState, closed: Set<string>): string {
  const spoiler = state.spoilers.find((candidate) => candidate.id === id);
  if (!spoiler || !state.added.has(id)) return '';
  const seal = `<span class="seal">${spoiler.seal}</span>`;

  if (isShown(state, id)) {
    const { title, html } = state.loaded[id];
    const open = closed.has(id) ? '' : ' open';
    return (
      `<details class="sticker" id="${id}"${open}>` +
      `<summary>${seal}<span>${title}</span></summary>` +
      `<div class="sticker-body">${html}</div></details>`
    );
  }
  if (state.failed.has(id)) {
    return `<p class="sealed">${seal}${spoiler.label} couldn't load. Reload the page to try again.</p>`;
  }
  return `<p class="sealed">${seal}${spoiler.label} is loading</p>`;
}

/** Fills the places of added spoilers, and removes the others so nothing shows they exist. */
export function composeBody(html: string, state: SpoilerState, closed: Set<string>): string {
  if (!html.includes('data-spoiler=') && !html.includes('data-replaced-by=')) return html;
  return withoutReplacedText(html, state)
    .replace(SLOT, (_, id: string) => slotHtml(id, state, closed))
    .replace(EMPTY_ITEM, '');
}
