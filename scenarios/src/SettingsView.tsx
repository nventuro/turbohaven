import { SiteHeader } from '../../shared/SiteHeader.tsx';
import { LANGUAGES } from './language.ts';
import type { Language, Settings } from './types.ts';

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
  onDone: () => void;
}

export function SettingsView({ settings, onChange, onDone }: Props) {
  return (
    <div className="screen">
      <SiteHeader app="scenarios" />
      <main className="screen-body step-column">
        <h1>Settings</h1>
        <p className="hint">These stay in this browser, for every scenario.</p>
        <label className="setting">
          <input
            type="checkbox"
            checked={settings.skipLoot}
            onChange={(event) => onChange({ ...settings, skipLoot: event.target.checked })}
          />
          <span>
            <span className="setting-name">Skip the loot deck</span>
            <span className="setting-hint">Leaves it out of setup, for groups whose app builds the loot deck.</span>
          </span>
        </label>
        <div className="setting setting-choice" role="radiogroup" aria-labelledby="story-language">
          <span>
            <span className="setting-name" id="story-language">
              Story language
            </span>
            <span className="setting-hint">
              Rules and names stay in English, as on the cards, and so does any story not translated yet.
            </span>
            <span className="setting-options">
              {(Object.entries(LANGUAGES) as [Language, string][]).map(([language, name]) => (
                <label key={language} className="setting-option">
                  <input
                    type="radio"
                    name="language"
                    checked={settings.language === language}
                    onChange={() => onChange({ ...settings, language })}
                  />
                  {name}
                </label>
              ))}
            </span>
          </span>
        </div>
      </main>
      <footer className="screen-actions">
        <span />
        <button className="primary" onClick={onDone}>
          Done
        </button>
      </footer>
    </div>
  );
}
