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

export function Line({ paragraph }: { paragraph: Paragraph }) {
  return <>{paragraph.map(renderSegment)}</>;
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
