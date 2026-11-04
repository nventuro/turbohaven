import { dataUrl } from './data.ts';
import { FormulaKey, Line, Panel, Prose } from './Rich.tsx';
import { gatherSteps, placeStep } from './RoomParts.tsx';
import { StepScreen, type Step } from './Steps.tsx';
import type { Run, Scenario, Settings } from './types.ts';

function Complexity({ level }: { level: number }) {
  return (
    <span className="complexity" role="img" aria-label={`${level} of 3`}>
      {[1, 2, 3].map((dot) => (
        <i key={dot} className={dot <= level ? 'complexity-on' : ''} />
      ))}
    </span>
  );
}

function Introduction({ scenario }: { scenario: Scenario }) {
  const { location, region, requirements } = scenario;
  return (
    <article className="reading">
      <p className="scenario-line">
        Map location {location}
        {region && `, ${region}`}
      </p>
      <h1 className="title title-large">{scenario.title}</h1>
      <dl className="scenario-facts">
        <div>
          <dt>Complexity</dt>
          <dd>
            <Complexity level={scenario.complexity} />
          </dd>
        </div>
        {requirements.length > 0 && (
          <div>
            <dt>Requirements</dt>
            <dd className="requirements">
              {requirements.map((requirement) => (
                <span key={requirement.name} className="requirement">
                  {requirement.icon && <img src={dataUrl(`icons/${requirement.icon}`)} alt="" />}
                  {requirement.name}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
      <Prose paragraphs={scenario.intro} />
    </article>
  );
}

function setupSteps(scenario: Scenario, run: Run, settings: Settings): Step[] {
  const { room, loot, effects } = scenario;
  const cards = loot.reduce((total, card) => total + card.count, 0);
  const steps: Step[] = [
    { label: 'Introduction', body: <Introduction scenario={scenario} /> },
    ...gatherSteps(room, run.players, 'For the starting room only. Later rooms come out when you get there.'),
  ];
  if (!settings.skipLoot) {
    steps.push({
      label: 'Loot deck',
      body: (
        <>
          <h1>Build the loot deck</h1>
          <p className="hint">{cards} cards in total.</p>
          <ul className="loot">
            {loot.map((card) => (
              <li key={card.name}>
                {card.icon && <img src={dataUrl(`icons/${card.icon}`)} alt="" />}
                <span>{card.name}</span>
                <span className="piece-count">{card.count}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }
  if (effects.length) {
    steps.push({
      label: 'Effects',
      body: (
        <>
          <h1>Apply the scenario effects</h1>
          <div className="stack step-panels">
            <Panel kind="effects">
              {effects.map((paragraph, index) => (
                <p key={index}>
                  <Line paragraph={paragraph} />
                </p>
              ))}
              <FormulaKey paragraphs={effects} players={run.players} />
            </Panel>
          </div>
        </>
      ),
    });
  }
  steps.push(placeStep(room, run.players));
  return steps;
}

interface Props {
  scenario: Scenario;
  run: Run;
  settings: Settings;
  update: (changes: Partial<Run>) => void;
  onLeave: () => void;
}

export function Setup({ scenario, run, settings, update, onLeave }: Props) {
  const steps = setupSteps(scenario, run, settings);
  return (
    <StepScreen
      scenario={scenario}
      onLeave={onLeave}
      steps={steps}
      current={run.setupStep}
      onStep={(step) => update({ setupStep: step })}
      finishLabel={run.started ? 'Back to the scenario' : 'Start the scenario'}
      onFinish={() => update({ started: true, playing: true, setupStep: steps.length - 1 })}
    />
  );
}
