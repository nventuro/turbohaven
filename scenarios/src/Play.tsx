import { useState } from 'react';
import { FormulaKey, Line, Panel, referencedSection, type PanelKind } from './Rich.tsx';
import { ScenarioBar } from './ScenarioBar.tsx';
import { roomStep } from './SectionView.tsx';
import type { Paragraph, PlayerCount, Run, Scenario, Section } from './types.ts';

interface TriggerProps {
  paragraph: Paragraph;
  isRead: boolean;
  onRead: (section: string) => void;
}

/** A condition from the book. Reading on takes a second press, so a slip spoils nothing. */
function Trigger({ paragraph, isRead, onRead }: TriggerProps) {
  const section = referencedSection(paragraph)!;
  const [confirming, setConfirming] = useState(false);

  if (isRead) {
    return (
      <div className="trigger trigger-read">
        <p>
          <Line paragraph={paragraph} />
        </p>
        <button className="quiet" onClick={() => onRead(section)}>
          Read {section} again
        </button>
      </div>
    );
  }
  if (confirming) {
    return (
      <div className="trigger trigger-confirm">
        <p>
          <Line paragraph={paragraph} />
        </p>
        <div className="trigger-choice">
          <button className="quiet" onClick={() => setConfirming(false)}>
            Not yet
          </button>
          <button className="primary" onClick={() => onRead(section)}>
            It happened, read {section}
          </button>
        </div>
      </div>
    );
  }
  return (
    <button className="trigger" onClick={() => setConfirming(true)}>
      <Line paragraph={paragraph} />
    </button>
  );
}

function RichPanel({
  kind,
  paragraphs,
  players,
  read,
  onRead,
}: {
  kind: PanelKind;
  paragraphs: Paragraph[];
  players: PlayerCount;
  read: string[];
  onRead: (section: string) => void;
}) {
  if (!paragraphs.length) return null;
  return (
    <Panel kind={kind}>
      {paragraphs.map((paragraph, index) => {
        const section = referencedSection(paragraph);
        return section ? (
          <Trigger key={section} paragraph={paragraph} isRead={read.includes(section)} onRead={onRead} />
        ) : (
          <p key={index}>
            <Line paragraph={paragraph} />
          </p>
        );
      })}
      <FormulaKey paragraphs={paragraphs} players={players} />
    </Panel>
  );
}

interface Props {
  scenario: Scenario;
  run: Run;
  update: (changes: Partial<Run>) => void;
  onLeave: () => void;
}

export function Play({ scenario, run, update, onLeave }: Props) {
  const opened: (Scenario | Section)[] = [scenario, ...run.read.map((id) => scenario.sections[id])];
  const gather = (pick: (source: Scenario | Section) => Paragraph[]) => opened.flatMap(pick);
  const read = (section: string) =>
    update({
      open: section,
      sectionStep: 0,
      read: run.read.includes(section) ? run.read : [...run.read, section],
    });
  const goals = gather((s) => s.goals);
  const panel = (kind: PanelKind, paragraphs: Paragraph[]) => (
    <RichPanel kind={kind} paragraphs={paragraphs} players={run.players} read={run.read} onRead={read} />
  );
  const rooms = run.read.filter((id) => scenario.sections[id].room);

  return (
    <div className="screen">
      <ScenarioBar scenario={scenario} onLeave={onLeave} />
      <main className="screen-body play">
        <div className="stack">
          {goals.length ? (
            panel('goals', goals)
          ) : (
            // A goal that names something still behind a door appears once the party gets there.
            <Panel kind="goals">
              <p className="panel-note">You'll learn how to complete the scenario as you explore.</p>
            </Panel>
          )}
          {panel(
            'effects',
            gather((s) => s.effects),
          )}
          {panel(
            'rules',
            gather((s) => s.rules),
          )}
        </div>
        <div className="stack">
          {panel(
            'links',
            gather((s) => s.links),
          )}
          <section className="looked-back">
            <button className="quiet" onClick={() => update({ playing: false })}>
              See the starting room
            </button>
            {rooms.map((id) => (
              <button
                key={id}
                className="quiet"
                onClick={() => update({ open: id, sectionStep: roomStep(scenario.sections[id], run.players)! })}
              >
                See the {id} room
              </button>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
