import { describe, expect, it } from 'vitest';
import { composeBody, type SpoilerState } from '../src/compose.ts';

const SPOILER = { id: 'sticker-2', label: 'Sticker 2', seal: '2', sectionPath: [] };
const HTML =
  '<div data-replaced-by="sticker-2"><p>Printed rule.</p></div><div data-spoiler="sticker-2"></div><p>After.</p>';
const WITHOUT_SPOILER = '<div data-replaced-by="sticker-2"><p>Printed rule.</p></div><p>After.</p>';
const LIST = '<ol><li>First.</li><li>\n<div data-spoiler="sticker-2"></div>\n</li><li>Last.</li></ol>';

const state = (overrides: Partial<SpoilerState> = {}): SpoilerState => ({
  spoilers: [SPOILER],
  added: new Set(),
  loaded: {},
  failed: new Set(),
  ...overrides,
});
const added = () =>
  state({
    added: new Set(['sticker-2']),
    loaded: { 'sticker-2': { id: 'sticker-2', title: 'Fake Kayaks', html: '<p>Fake rule.</p>' } },
  });

describe('composeBody', () => {
  it('leaves sections without spoilers untouched', () => {
    expect(composeBody('<p>Plain.</p>', state(), new Set())).toBe('<p>Plain.</p>');
  });

  it('shows nothing for a spoiler that is off, keeping the printed text', () => {
    expect(composeBody(HTML, state(), new Set())).toBe(WITHOUT_SPOILER);
  });

  it('removes the list item of a spoiler that is off', () => {
    expect(composeBody(LIST, state(), new Set())).toBe('<ol><li>First.</li><li>Last.</li></ol>');
  });

  it('keeps the list item of a spoiler that is on', () => {
    expect(composeBody(LIST, added(), new Set())).toMatch(/<li>\s*<details class="sticker"/);
  });

  it('expands a spoiler that is on, replacing the printed text', () => {
    const body = composeBody(HTML, added(), new Set());
    expect(body).toContain('<details class="sticker" id="sticker-2" open>');
    expect(body).toContain('Fake Kayaks');
    expect(body).toContain('Fake rule.');
    expect(body).not.toContain('Printed rule.');
    expect(body).toContain('After.');
  });

  it('keeps a spoiler collapsed once the reader collapses it', () => {
    expect(composeBody(HTML, added(), new Set(['sticker-2']))).toContain('<details class="sticker" id="sticker-2">');
  });

  it('shows nothing for a spoiler turned back off, even with its text already fetched', () => {
    expect(composeBody(HTML, { ...added(), added: new Set() }, new Set())).toBe(WITHOUT_SPOILER);
  });

  it('keeps the printed text until the spoiler has loaded', () => {
    const body = composeBody(HTML, state({ added: new Set(['sticker-2']) }), new Set());
    expect(body).toContain('Sticker 2 is loading');
    expect(body).toContain('Printed rule.');
  });

  it('says so when a spoiler fails to load', () => {
    const body = composeBody(HTML, state({ added: new Set(['sticker-2']), failed: new Set(['sticker-2']) }), new Set());
    expect(body).toContain("couldn't load");
  });
});
