import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import type { Rulebook, Section, Spoiler, SpoilerContent, Treasures } from '../src/types.ts';

const md = new MarkdownIt({ html: true });

type Token = ReturnType<typeof md.parse>[number];

interface Draft {
  title: string;
  titleHtml: string;
  level: number;
  page: number;
  pageAnchors: number[];
  tokens: Token[];
}

const PAGE = /^<!-- page (\d+) -->\s*$/;

function toHtml(html: string): string {
  return html
    .replace(/<!-- page (\d+) -->/g, '<div class="page-mark" id="page-$1" data-page="$1"></div>')
    .replace(/<!-- sticker (\d+) -->/g, '<div data-spoiler="sticker-$1"></div>')
    .replace(/<!-- spoiler ([a-z-]+) -->/g, '<div data-spoiler="$1"></div>')
    .replace(/<!-- replaced-by ([a-z0-9-]+) -->/g, '<div data-replaced-by="$1">')
    .replace(/<!-- \/replaced-by -->/g, '</div>')
    .replace(/<!-- letters -->\s*<ol/g, '<ol type="A"')
    .replace(/href="#page_(\d+)"/g, 'href="#page-$1"')
    .replace(/<img /g, '<img loading="lazy" ')
    .replace(/<table\b/g, '<div class="table-wrap"><table')
    .replace(/<\/table>/g, '</table></div>');
}

function plainTitle(html: string): string {
  return html
    .replace(/<img[^>]*\balt="([^"]*)"[^>]*>/g, (_, alt: string) => alt.replace(/ icon$/i, ''))
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim();
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/’/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitIntoDrafts(markdown: string): Draft[] {
  const tokens = md.parse(markdown, {});
  const drafts: Draft[] = [];
  let page = 0;
  let pending: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const pageMatch = token.type === 'html_block' && token.level === 0 ? token.content.match(PAGE) : null;
    if (pageMatch) {
      page = Number(pageMatch[1]);
      let next = i + 1;
      while (tokens[next]?.type === 'html_block' && PAGE.test(tokens[next].content)) next++;
      if (tokens[next]?.type === 'heading_open' && tokens[next].level === 0) {
        pending.push(page);
        continue;
      }
    }
    if (token.type === 'heading_open' && token.level === 0) {
      const titleHtml = toHtml(md.renderInline(tokens[i + 1].content));
      drafts.push({
        title: plainTitle(titleHtml),
        titleHtml,
        level: Number(token.tag.slice(1)),
        page,
        pageAnchors: pending,
        tokens: [],
      });
      pending = [];
      i += 2;
      continue;
    }
    if (drafts.length === 0) throw new Error('Rulebook text must start with a heading');
    drafts[drafts.length - 1].tokens.push(token);
  }
  return drafts;
}

function spoilerIdsIn(markdown: string): string[] {
  return [...markdown.matchAll(/<!-- (?:sticker (\d+)|spoiler ([a-z-]+)) -->/g)].map(([, sticker, other]) =>
    sticker ? `sticker-${sticker}` : other,
  );
}

function buildTree(drafts: Draft[], reservedIds: string[]): Section[] {
  const roots: Section[] = [];
  const stack: Section[] = [];
  // A shown spoiler is addressed by its own id, so no section may share it.
  const usedIds = new Set(reservedIds);

  for (const draft of drafts) {
    while (stack.length > 0 && stack[stack.length - 1].level >= draft.level) stack.pop();
    const parent = stack[stack.length - 1];

    const base = slug(draft.title);
    let id = usedIds.has(base) && parent ? `${parent.id}-${base}` : base;
    for (let n = 2; usedIds.has(id); n++) id = `${base}-${n}`;
    usedIds.add(id);

    const rendered = toHtml(md.renderer.render(draft.tokens, md.options, {}));
    const section: Section = {
      id,
      title: draft.title,
      titleHtml: draft.titleHtml,
      level: draft.level,
      page: draft.page,
      pageAnchors: draft.pageAnchors,
      html: rendered.replace('<!-- treasure-lookup -->', ''),
      hasTreasureLookup: rendered.includes('<!-- treasure-lookup -->'),
      children: [],
    };
    (parent ? parent.children : roots).push(section);
    stack.push(section);
  }

  return roots;
}

function spoilerLabel(id: string): Pick<Spoiler, 'label' | 'seal'> {
  const [kind, mark] = id.split('-');
  return { label: `${kind[0].toUpperCase()}${kind.slice(1)} ${mark.toUpperCase()}`, seal: mark.toUpperCase() };
}

function spoilersIn(sections: Section[]): Spoiler[] {
  const found: Spoiler[] = [];
  const walk = (section: Section, path: string[]) => {
    const sectionPath = [...path, section.id];
    for (const [, id] of section.html.matchAll(/data-spoiler="([^"]+)"/g)) {
      found.push({ id, ...spoilerLabel(id), sectionPath });
    }
    section.children.forEach((child) => walk(child, sectionPath));
  };
  sections.forEach((section) => walk(section, []));

  const stickerNumber = (spoiler: Spoiler) => (spoiler.id.startsWith('sticker-') ? Number(spoiler.seal) : Infinity);
  return found.sort((a, b) => stickerNumber(a) - stickerNumber(b) || a.id.localeCompare(b.id));
}

function buildSpoiler(spoiler: Spoiler, markdown: string): SpoilerContent {
  const heading = markdown.match(/^#+ (.*)\n+/);
  const body = heading ? markdown.slice(heading[0].length) : markdown;
  return {
    id: spoiler.id,
    title: heading ? plainTitle(md.renderInline(heading[1])) : spoiler.label,
    html: toHtml(md.render(body)),
  };
}

function buildTreasures(markdown: string): Treasures {
  const treasures: Treasures = {};
  for (const line of markdown.split('\n')) {
    const entry = line.match(/^(\d+)\. (.*)$/);
    if (entry) treasures[entry[1]] = toHtml(md.renderInline(entry[2]));
  }
  return treasures;
}

/** Compiles the rulebook source in `contentDir` into the JSON files the app loads from `outDir`. */
export function buildContent(contentDir: string, outDir: string): void {
  const rulebookDir = join(contentDir, 'rulebook');
  const spoilersDir = join(contentDir, 'spoilers');
  const read = (dir: string, name: string) => readFileSync(join(dir, name), 'utf8');

  const markdown = readdirSync(rulebookDir)
    .sort()
    .map((name) => read(rulebookDir, name))
    .join('\n\n');
  const sections = buildTree(splitIntoDrafts(markdown), spoilerIdsIn(markdown));
  const spoilers = spoilersIn(sections);

  const files = new Set(readdirSync(spoilersDir));
  files.delete('appendix-e.md');
  for (const { id } of spoilers) {
    if (!files.delete(`${id}.md`)) throw new Error(`The rules have a place for ${id} but it has no file`);
  }
  if (files.size > 0) throw new Error(`The rules have no place for ${[...files].join(', ')}`);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, 'spoilers'), { recursive: true });
  const rulebook: Rulebook = { sections, spoilers };
  writeFileSync(join(outDir, 'rulebook.json'), JSON.stringify(rulebook));
  for (const spoiler of spoilers) {
    const content = buildSpoiler(spoiler, read(spoilersDir, `${spoiler.id}.md`));
    writeFileSync(join(outDir, 'spoilers', `${spoiler.id}.json`), JSON.stringify(content));
  }
  writeFileSync(
    join(outDir, 'spoilers', 'treasures.json'),
    JSON.stringify(buildTreasures(read(spoilersDir, 'appendix-e.md'))),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  buildContent(join(root, 'content'), join(root, 'public', 'content'));
}
