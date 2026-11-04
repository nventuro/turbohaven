import type { ReactNode } from 'react';
import { SiteHeader } from '../../shared/SiteHeader.tsx';
import type { Scenario } from './types.ts';

interface Props {
  scenario: Scenario;
  /** What to call the screen, if not the scenario's number. */
  label?: string;
  /** Offers to leave the scenario, when given. */
  onLeave?: () => void;
  children?: ReactNode;
}

export function ScenarioBar({ scenario, label, onLeave, children }: Props) {
  const leave = () => {
    if (window.confirm(`Leave ${scenario.title}? Your progress in it will be cleared.`)) onLeave?.();
  };
  return (
    <SiteHeader app="scenarios" className="scenario-bar">
      <p className="scenario-bar-title">
        <span className="scenario-bar-number">{label ?? scenario.number}</span> {scenario.title}
      </p>
      {children}
      {onLeave && (
        <button className="quiet" onClick={leave}>
          Leave<span className="leave-scenario"> scenario</span>
        </button>
      )}
    </SiteHeader>
  );
}
