import { FaqPanel, FormulaKey, Line, Panel, Prose, type PanelKind } from './Rich.tsx';
import { gatherSteps, PLACE_LABEL, placeStep } from './RoomParts.tsx';
import { StepScreen, type Step } from './Steps.tsx';
import type { Paragraph, PlayerCount, Scenario, Section } from './types.ts';

function PlainPanel({ kind, paragraphs, players }: { kind: PanelKind; paragraphs: Paragraph[]; players: PlayerCount }) {
  if (!paragraphs.length) return null;
  return (
    <Panel kind={kind}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <Line paragraph={paragraph} />
        </p>
      ))}
      <FormulaKey paragraphs={paragraphs} players={players} />
    </Panel>
  );
}

/**
 * A section takes the same steps as setting up a scenario: the story first,
 * then each part of a new room, its rules and what the party earns, so that
 * reading one part never gives away the next.
 */
function sectionSteps(section: Section, players: PlayerCount): Step[] {
  const { room, goals, effects, rules, faq, rewards } = section;
  const story: Step = {
    label: section.isConclusion ? 'Conclusion' : 'Story',
    body: (
      <article className="reading">
        {section.isConclusion && <h1 className="conclusion-heading">Conclusion</h1>}
        <Prose paragraphs={section.story} />
      </article>
    ),
  };
  const steps: Step[] = section.story.length || section.isConclusion ? [story] : [];
  // Nothing is played after a conclusion, so what the FAQ says about it bears on its rewards.
  const faqWithRewards = section.isConclusion && rewards.length > 0;
  const newRules = faqWithRewards ? [] : faq;
  if (room) steps.push(...gatherSteps(room, players));
  if (goals.length || effects.length || rules.length || newRules.length) {
    steps.push({
      label: 'New rules',
      body: (
        <>
          <h1>New rules</h1>
          <div className="stack step-panels">
            <PlainPanel kind="goals" paragraphs={goals} players={players} />
            <PlainPanel kind="effects" paragraphs={effects} players={players} />
            <PlainPanel kind="rules" paragraphs={rules} players={players} />
            <FaqPanel entries={newRules} />
          </div>
        </>
      ),
    });
  }
  if (room) steps.push(placeStep(room, players));
  if (rewards.length) {
    steps.push({
      label: 'Rewards',
      body: (
        <div className="stack">
          <PlainPanel kind="rewards" paragraphs={rewards} players={players} />
          {faqWithRewards && <FaqPanel entries={faq} />}
        </div>
      ),
    });
  }
  return steps.length ? steps : [story];
}

/** The step that shows a section's room put together, or null if it brings in none. */
export function roomStep(section: Section, players: PlayerCount): number | null {
  if (!section.room) return null;
  return sectionSteps(section, players).findIndex((step) => step.label === PLACE_LABEL);
}

interface Props {
  scenario: Scenario;
  section: Section;
  players: PlayerCount;
  step: number;
  onStep: (step: number) => void;
  onBack: () => void;
  onFinish: () => void;
}

export function SectionView({ scenario, section, players, step, onStep, onBack, onFinish }: Props) {
  return (
    <StepScreen
      scenario={scenario}
      label={section.id}
      steps={sectionSteps(section, players)}
      current={step}
      onStep={onStep}
      finishLabel={section.isConclusion ? 'Finish the scenario' : 'Back to the scenario'}
      onFinish={section.isConclusion ? onFinish : onBack}
    />
  );
}
