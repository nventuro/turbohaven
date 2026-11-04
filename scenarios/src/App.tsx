import { useEffect, useState } from 'react';
import { loadScenario, useRun, useSettings } from './data.ts';
import { Home } from './Home.tsx';
import { inLanguage } from './language.ts';
import { Play } from './Play.tsx';
import { SectionView } from './SectionView.tsx';
import { SettingsView } from './SettingsView.tsx';
import { Setup } from './Setup.tsx';
import type { Run, Scenario } from './types.ts';

export function App() {
  const [run, setRun] = useRun();
  const [settings, setSettings] = useSettings();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (run && run.number !== scenario?.number) {
      loadScenario(run.number).then((loaded) => (loaded ? setScenario(loaded) : setRun(null)));
    }
  }, [run, scenario, setRun]);

  const view = showSettings
    ? 'settings'
    : !run
      ? 'home'
      : run.open
        ? `${run.open}-${run.sectionStep}`
        : run.playing
          ? 'play'
          : `setup-${run.setupStep}`;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (showSettings) {
    return <SettingsView settings={settings} onChange={setSettings} onDone={() => setShowSettings(false)} />;
  }
  if (!run) {
    return (
      <Home
        onSettings={() => setShowSettings(true)}
        onStart={(started, players) => {
          setScenario(started);
          setRun({
            number: started.number,
            players,
            setupStep: 0,
            started: false,
            playing: false,
            read: [],
            open: null,
            sectionStep: 0,
          });
        }}
      />
    );
  }
  if (!scenario || scenario.number !== run.number) return null;
  const shown = inLanguage(scenario, settings.language);

  const update = (changes: Partial<Run>) => setRun({ ...run, ...changes });
  const leave = () => setRun(null);

  if (run.open) {
    return (
      <SectionView
        scenario={shown}
        section={shown.sections[run.open]}
        players={run.players}
        step={run.sectionStep}
        onStep={(step) => update({ sectionStep: step })}
        onBack={() => update({ open: null })}
        onFinish={leave}
      />
    );
  }
  if (run.playing) return <Play scenario={shown} run={run} update={update} onLeave={leave} />;
  return <Setup scenario={shown} run={run} settings={settings} update={update} onLeave={leave} />;
}
