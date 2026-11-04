import type { Language, Scenario } from './types.ts';

/** Each language the story can be read in, by the name it has for its speakers. */
export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  'es-AR': 'Español',
};

/** The scenario with its story text in a language, or in English if it hasn't been translated into that one. */
export function inLanguage(scenario: Scenario, language: Language): Scenario {
  const translation = scenario.translations[language];
  if (!translation) return scenario;
  const sections = Object.fromEntries(
    Object.entries(scenario.sections).map(([id, section]) => [id, { ...section, story: translation.story[id] }]),
  );
  return { ...scenario, intro: translation.intro, sections };
}
