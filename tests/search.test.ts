import { describe, expect, it } from 'vitest';
import type { SpoilerState } from '../src/compose.ts';
import { buildIndex, find, plainText } from '../src/search.ts';
import type { Section } from '../src/types.ts';

const section = (id: string, title: string, html: string, children: Section[] = []): Section => ({
  id,
  title,
  titleHtml: title,
  level: 1,
  page: 1,
  pageAnchors: [],
  html,
  hasTreasureLookup: false,
  children,
});

const SECTIONS = [
  section('camp', 'Camp', '<p>Light a campfire before nightfall.</p>', [
    section('poison', 'Hazards', '<p>Gain <img alt="Poison Icon" src="x.png"> at dusk.</p>'),
    section('hiking', 'Hiking', '<div data-replaced-by="sticker-2"><p>Printed hiking rule.</p></div>'),
  ]),
];

const sealed: SpoilerState = {
  spoilers: [{ id: 'sticker-2', label: 'Sticker 2', seal: '2', sectionPath: [] }],
  added: new Set(),
  loaded: { 'sticker-2': { id: 'sticker-2', title: 'Fake Kayaks', html: '<p>Fake kayak rule.</p>' } },
  failed: new Set(),
};
const shown: SpoilerState = { ...sealed, added: new Set(['sticker-2']) };

describe('search', () => {
  it('finds rules in sections at any depth', () => {
    expect(find(buildIndex(SECTIONS, sealed), 'campfire').map((hit) => hit.id)).toEqual(['camp']);
  });

  it('finds rules by what their icons stand for', () => {
    expect(find(buildIndex(SECTIONS, sealed), 'poison').map((hit) => hit.id)).toEqual(['poison']);
  });

  it('never finds a sealed spoiler, even with its text already fetched', () => {
    expect(find(buildIndex(SECTIONS, sealed), 'kayak')).toEqual([]);
  });

  it('finds a shown spoiler', () => {
    expect(find(buildIndex(SECTIONS, shown), 'kayak').map((hit) => hit.id)).toEqual(['sticker-2']);
  });

  it('stops finding printed text once a spoiler replaces it', () => {
    expect(find(buildIndex(SECTIONS, sealed), 'printed').map((hit) => hit.id)).toEqual(['hiking']);
    expect(find(buildIndex(SECTIONS, shown), 'printed')).toEqual([]);
  });

  it('shows the matching text in context', () => {
    expect(find(buildIndex(SECTIONS, sealed), 'campfire')[0]).toMatchObject({
      before: 'Light a ',
      match: 'campfire',
      after: ' before nightfall.',
    });
  });
});

describe('plainText', () => {
  it('drops markup and keeps the meaning of icons', () => {
    expect(plainText('<p>Gain <img alt="Bless Icon" src="x.png"> &amp; rest</p>')).toBe('Gain Bless & rest');
  });
});
