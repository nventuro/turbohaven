import type { ReactNode } from 'react';
import { ScenarioBar } from './ScenarioBar.tsx';
import type { Scenario } from './types.ts';

export interface Step {
  label: string;
  body: ReactNode;
  /** Whether the step needs the whole screen rather than a single column. */
  wide?: boolean;
}

interface Props {
  scenario: Scenario;
  /** What the bar calls the screen, if not the scenario's number. */
  label?: string;
  onLeave?: () => void;
  steps: Step[];
  current: number;
  onStep: (step: number) => void;
  finishLabel: string;
  onFinish: () => void;
}

/** Shows one step at a time, so nothing further on is seen before its turn. */
export function StepScreen({ scenario, label, onLeave, steps, current, onStep, finishLabel, onFinish }: Props) {
  const index = Math.min(current, steps.length - 1);
  const next = steps[index + 1];

  return (
    <div className="screen">
      <ScenarioBar scenario={scenario} label={label} onLeave={onLeave}>
        <ol className="step-hexes" aria-label="Steps">
          {steps.map((step, position) => (
            <li
              key={step.label}
              className={position < index ? 'done' : position === index ? 'current' : ''}
              aria-current={position === index ? 'step' : undefined}
              title={step.label}
            />
          ))}
        </ol>
      </ScenarioBar>
      <main className={`screen-body ${steps[index].wide ? '' : 'step-column'}`}>{steps[index].body}</main>
      <footer className="screen-actions">
        {index > 0 ? (
          <button className="quiet" onClick={() => onStep(index - 1)}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button className="primary" onClick={() => (next ? onStep(index + 1) : onFinish())}>
          {next ? `Next: ${next.label.toLowerCase()}` : finishLabel}
        </button>
      </footer>
    </div>
  );
}
