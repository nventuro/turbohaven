import { useEffect, useState } from 'react';
import { loadJson } from '../../shared/load.ts';
import { browserStorage, readStored, writeStored } from '../../shared/storage.ts';
import type { Run, Scenario, Settings } from './types.ts';

const RUN_KEY = 'turbohaven.run';
const SETTINGS_KEY = 'turbohaven.scenario-settings';
const DEFAULT_SETTINGS: Settings = { skipLoot: false, language: 'en' };

export function dataUrl(path: string): string {
  return `${import.meta.env.BASE_URL}data/${path}`;
}

/** Returns a scenario, or null if the app has none with that number. */
export function loadScenario(number: string): Promise<Scenario | null> {
  return loadJson<Scenario>(dataUrl(`scenarios/${number}.json`)).catch(() => null);
}

function saved<T>(key: string): Partial<T> | null {
  return readStored(browserStorage(), key) as Partial<T> | null;
}

function save(key: string, value: unknown) {
  writeStored(browserStorage(), key, value);
}

function savedRun(): Run | null {
  const run = saved<Run>(RUN_KEY);
  // A run saved by an earlier version of the app can lack newer fields.
  return run ? ({ sectionStep: 0, ...run } as Run) : null;
}

/** The scenario in progress, kept across reloads so a closed tab loses nothing. */
export function useRun(): [Run | null, (run: Run | null) => void] {
  const [run, setRun] = useState<Run | null>(savedRun);
  useEffect(() => save(RUN_KEY, run), [run]);
  return [run, setRun];
}

export function useSettings(): [Settings, (settings: Settings) => void] {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULT_SETTINGS,
    ...saved<Settings>(SETTINGS_KEY),
  }));
  useEffect(() => save(SETTINGS_KEY, settings), [settings]);
  return [settings, setSettings];
}
