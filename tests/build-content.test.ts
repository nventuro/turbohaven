import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildContent } from '../scripts/build-content.ts';
import type { Rulebook, Section, SpoilerContent, Treasures } from '../src/types.ts';

const fixture = join(import.meta.dirname, 'fixtures', 'content');

describe('buildContent', () => {
  let out: string;
  let rulebook: Rulebook;
  let raw: string;

  const flat = (sections: Section[]): Section[] => sections.flatMap((s) => [s, ...flat(s.children)]);
  const section = (id: string) => {
    const found = flat(rulebook.sections).find((s) => s.id === id);
    if (!found) throw new Error(`no section ${id}`);
    return found;
  };
  const spoiler = (id: string): SpoilerContent => JSON.parse(readFileSync(join(out, 'spoilers', `${id}.json`), 'utf8'));

  beforeAll(() => {
    out = mkdtempSync(join(tmpdir(), 'turbohaven-'));
    buildContent(fixture, out);
    raw = readFileSync(join(out, 'rulebook.json'), 'utf8');
    rulebook = JSON.parse(raw);
  });
  afterAll(() => rmSync(out, { recursive: true, force: true }));

  it('keeps every spoiler out of the base rules', () => {
    for (const text of ['marshmallow', 'Kayak', 'compass', 'Compass', 'lantern']) expect(raw).not.toContain(text);
  });

  it('writes one file per spoiler, plus the treasures', () => {
    expect(readdirSync(join(out, 'spoilers')).sort()).toEqual([
      'appendix-d.json',
      'sticker-1.json',
      'sticker-2.json',
      'treasures.json',
    ]);
  });

  it('nests sections by heading level', () => {
    expect(rulebook.sections.map((s) => s.id)).toEqual(['camp', 'appendices']);
    expect(section('camp').children.map((s) => s.id)).toEqual(['fishing', 'hiking']);
  });

  it('gives repeated titles their own id under their parent', () => {
    expect(section('hiking').children.map((s) => s.id)).toEqual(['hiking-fishing']);
  });

  it('keeps section ids apart from spoiler ids', () => {
    expect(section('appendices').children.map((s) => s.id)).toContain('appendices-appendix-d');
  });

  it('tracks the printed page of each section and page marks inside sections', () => {
    expect(section('camp')).toMatchObject({ page: 3, pageAnchors: [3] });
    expect(section('fishing')).toMatchObject({ page: 4, pageAnchors: [4] });
    expect(section('fishing').html).toContain('id="page-5"');
    expect(section('hiking').page).toBe(5);
  });

  it('points page references at page marks', () => {
    expect(section('camp').html).toContain('href="#page-4"');
  });

  it('keeps list numbering and lettering', () => {
    expect(section('hiking').html).toContain('<ol type="A" start="3">');
  });

  it('marks spoiler places and the text they replace', () => {
    expect(section('camp').html).toContain('<div data-spoiler="sticker-1"></div>');
    expect(section('hiking-fishing').html).toMatch(/<div data-replaced-by="sticker-2">\s*<p>Printed hiking rule/);
  });

  it('lists spoilers with names that give nothing away, stickers first', () => {
    expect(rulebook.spoilers.map(({ id, label, seal }) => [id, label, seal])).toEqual([
      ['sticker-1', 'Sticker 1', '1'],
      ['sticker-2', 'Sticker 2', '2'],
      ['appendix-d', 'Appendix D', 'D'],
    ]);
  });

  it('records which sections hold a spoiler', () => {
    expect(rulebook.spoilers[1].sectionPath).toEqual(['camp', 'hiking', 'hiking-fishing']);
  });

  it('uses a leading heading as the spoiler title, or else its label', () => {
    expect(spoiler('sticker-2')).toMatchObject({ title: 'Fake Kayaks' });
    expect(spoiler('sticker-2').html).not.toContain('<h3');
    expect(spoiler('sticker-1')).toMatchObject({ title: 'Sticker 1' });
  });

  it('turns the treasure list into a lookup by number', () => {
    expect(section('appendix-e-treasure-index').hasTreasureLookup).toBe(true);
    const treasures: Treasures = JSON.parse(readFileSync(join(out, 'spoilers', 'treasures.json'), 'utf8'));
    expect(Object.keys(treasures)).toEqual(['1', '2']);
    expect(treasures['2']).toContain('<span class="item-number">101</span>');
  });
});
