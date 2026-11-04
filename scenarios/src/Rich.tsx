import type { ReactNode } from 'react';
import { dataUrl } from './data.ts';
import { formulaLetters, type FormulaLetter } from './formulas.ts';
import type { Paragraph, PlayerCount, Segment } from './types.ts';

function renderSegment(segment: Segment, key: number): ReactNode {
  if ('icon' in segment) {
    return <img key={key} className="inline-icon" src={dataUrl(`icons/${segment.icon}`)} alt="" />;
  }
  if ('door' in segment) {
    return (
      <span key={key} className="door-mark">
        {segment.door}
      </span>
    );
  }
  if ('scenario' in segment) {
    return (
      <span key={key} className="scenario-mark">
        {segment.scenario}
      </span>
    );
  }
  if ('section' in segment) return <strong key={key}>{segment.section}</strong>;
  if (segment.bold) return <strong key={key}>{segment.text}</strong>;
  if (segment.italic) return <em key={key}>{segment.text}</em>;
  return segment.text;
}

function isMark(segment: Segment): boolean {
  return 'icon' in segment || 'door' in segment || 'scenario' in segment;
}

/**
 * Groups each run of marks with the text that touches it without a space.
 * Browsers will break a line on either side of a mark, even before the
 * period that ends its sentence.
 */
function unbrokenRuns(paragraph: Paragraph): (Segment | Segment[])[] {
  const runs: (Segment | Segment[])[] = [];
  let group: Segment[] | null = null;
  for (const segment of paragraph) {
    if (isMark(segment)) {
      if (!group) {
        group = [];
        const previous = runs.at(-1);
        if (previous && !Array.isArray(previous) && 'text' in previous) {
          const tail = /\S*$/.exec(previous.text)![0];
          const rest = previous.text.slice(0, previous.text.length - tail.length);
          if (rest) runs[runs.length - 1] = { ...previous, text: rest };
          else runs.pop();
          if (tail) group.push({ ...previous, text: tail });
        }
        runs.push(group);
      }
      group.push(segment);
    } else if (group && 'text' in segment) {
      const head = /^\S*/.exec(segment.text)![0];
      if (head) group.push({ ...segment, text: head });
      const rest = segment.text.slice(head.length);
      if (rest) {
        runs.push({ ...segment, text: rest });
        group = null;
      }
    } else {
      runs.push(segment);
      group = null;
    }
  }
  return runs;
}

export function Line({ paragraph }: { paragraph: Paragraph }) {
  return (
    <>
      {unbrokenRuns(paragraph).map((run, index) =>
        Array.isArray(run) ? (
          <span key={index} className="unbroken">
            {run.map(renderSegment)}
          </span>
        ) : (
          renderSegment(run, index)
        ),
      )}
    </>
  );
}

export function Prose({ paragraphs }: { paragraphs: Paragraph[] }) {
  return (
    <div className="prose">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <Line paragraph={paragraph} />
        </p>
      ))}
    </div>
  );
}

// As the rulebook's Equations rule defines them.
const FORMULA_MEANINGS: Record<FormulaLetter, (players: PlayerCount) => string> = {
  C: (players) => `number of characters (${players})`,
  L: () => 'scenario level',
  H: () => 'maximum hit points of an elite of that monster type',
};

/** Explains the letters in the formulas of some rules, if they have any. */
export function FormulaKey({ paragraphs, players }: { paragraphs: Paragraph[]; players: PlayerCount }) {
  const text = paragraphs.map((paragraph) => paragraph.map((s) => ('text' in s ? s.text : ' ')).join('')).join(' ');
  const letters = formulaLetters(text);
  if (!letters.length) return null;
  return (
    <dl className="formula-key">
      {letters.map((letter) => (
        <div key={letter}>
          <dt>{letter}</dt>
          <dd>{FORMULA_MEANINGS[letter](players)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function referencedSection(paragraph: Paragraph): string | null {
  const reference = paragraph.find((segment) => 'section' in segment);
  return reference && 'section' in reference ? reference.section : null;
}

export type PanelKind = 'goals' | 'effects' | 'rules' | 'links' | 'rewards';

const PANEL_TITLES: Record<PanelKind, string> = {
  goals: 'Scenario goals',
  effects: 'Scenario effects',
  rules: 'Special rules',
  links: 'Section links',
  rewards: 'Rewards',
};

export function Panel({ kind, children }: { kind: PanelKind; children: ReactNode }) {
  return (
    <section className={`panel panel-${kind}`}>
      <h3>{PANEL_TITLES[kind]}</h3>
      <div className="panel-body">{children}</div>
    </section>
  );
}
