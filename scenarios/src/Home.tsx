import { useState } from 'react';
import { SiteHeader } from '../../shared/SiteHeader.tsx';
import { loadScenario } from './data.ts';
import type { PlayerCount, Scenario } from './types.ts';

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['back', '0', 'open'],
];
const MAX_DIGITS = 3;

interface Props {
  onStart: (scenario: Scenario, players: PlayerCount) => void;
  onSettings: () => void;
}

export function Home({ onStart, onSettings }: Props) {
  const [number, setNumber] = useState('');
  const [found, setFound] = useState<Scenario | null>(null);
  const [missing, setMissing] = useState<string | null>(null);

  const press = async (key: string) => {
    setMissing(null);
    if (key === 'back') {
      setNumber(number.slice(0, -1));
    } else if (key === 'open') {
      const scenario = await loadScenario(number);
      if (scenario) setFound(scenario);
      else setMissing(number);
    } else if (number.length < MAX_DIGITS) {
      setNumber(number + key);
    }
  };

  return (
    <div className="screen">
      <SiteHeader app="scenarios">
        <button className="quiet" onClick={onSettings}>
          Settings
        </button>
      </SiteHeader>
      <main className="home">
        <section className="home-reading" aria-live="polite">
          <div className="hex-display">{number || '?'}</div>
          {found ? <h1 className="title">{found.title}</h1> : <h1 className="home-prompt">Which scenario?</h1>}
          {missing && <p className="home-error">Scenario {missing} isn't in the app yet.</p>}
        </section>

        {found ? (
          <section className="home-keys">
            <h2 className="home-prompt">How many characters?</h2>
            <div className="hex-row">
              {([2, 3, 4] as const).map((players) => (
                <button key={players} className="hex-key" onClick={() => onStart(found, players)}>
                  {players}
                </button>
              ))}
            </div>
            <button
              className="quiet"
              onClick={() => {
                setFound(null);
                setNumber('');
              }}
            >
              Choose another scenario
            </button>
          </section>
        ) : (
          <section className="home-keys" aria-label="Scenario number">
            <div className="hex-keypad">
              {KEY_ROWS.map((row, index) => (
                <div key={index} className="hex-row">
                  {row.map((key) => (
                    <button
                      key={key}
                      className={`hex-key ${key === 'open' ? 'hex-key-open' : ''}`}
                      disabled={(key === 'open' || key === 'back') && !number}
                      aria-label={key === 'back' ? 'Delete digit' : undefined}
                      onClick={() => press(key)}
                    >
                      {key === 'back' ? '⌫' : key === 'open' ? 'Open' : key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
