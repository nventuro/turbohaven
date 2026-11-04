// Plays a scenario through the app, from the keypad to its conclusion, at three
// screen sizes and for 2, 3 and 4 characters. Saves a screenshot of every step
// at 3 characters, each the full length of the screen, for comparing the
// screens with the book. At phone size it reads the story in the scenario's
// translation, if it has one.
//
// usage: node scenarios/checks/walkthrough.ts <app url> <scenario number> <screenshot folder>
//
// Whoever runs it may not have played the scenario, so what it prints names
// steps and sections by number and never quotes the scenario.

import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, type Page } from 'playwright';
import { inLanguage, LANGUAGES } from '../src/language.ts';
import type { FaqEntry, Language, Paragraph, PlayerCount, Room, Scenario, Section } from '../src/types.ts';

const [appArgument, number, out] = process.argv.slice(2);
if (!appArgument || !number || !out) {
  console.error('usage: node scenarios/checks/walkthrough.ts <app url> <scenario number> <screenshot folder>');
  process.exit(2);
}
const app = appArgument.endsWith('/') ? appArgument : `${appArgument}/`;
mkdirSync(out, { recursive: true });
// Browser messages can quote the page, so they go to a file rather than the terminal.
const browserLog = join(out, 'browser.log');

const VIEWPORTS = {
  tablet: { width: 1180, height: 820 },
  portrait: { width: 820, height: 1180 },
  phone: { width: 390, height: 844 },
};
const PLAYER_COUNTS: PlayerCount[] = [2, 3, 4];
const PANEL_KINDS = ['goals', 'effects', 'rules', 'links'] as const;
// Long enough that finding it on a screen means the paragraph is there, not a common phrase.
const DISTINCT_TEXT = 25;

const response = await fetch(new URL(`data/scenarios/${number}.json`, app));
if (!response.ok) {
  console.error(`scenario ${number} isn't on ${app}`);
  process.exit(2);
}
const scenario = (await response.json()) as Scenario;
const translation = (Object.keys(scenario.translations) as Language[]).at(0);
const sections = Object.values(scenario.sections);
// The book lets the party read any section it reaches, but a conclusion ends the run.
const readingOrder = [...sections.filter((s) => !s.isConclusion), ...sections.filter((s) => s.isConclusion)];

const normalise = (text: string) => text.replace(/\s+/g, ' ').trim();
const distinctTexts = (paragraphs: Paragraph[]) =>
  paragraphs.flatMap((paragraph) =>
    paragraph.flatMap((segment) =>
      'text' in segment && normalise(segment.text).length >= DISTINCT_TEXT ? [normalise(segment.text)] : [],
    ),
  );
const faqTexts = (entries: FaqEntry[]) => distinctTexts(entries.flatMap((entry) => entry.paragraphs));
const sectionTexts = (section: Section) => [
  ...distinctTexts([...section.story, ...PANEL_KINDS.flatMap((kind) => section[kind]), ...section.rewards]),
  ...faqTexts(section.faq),
];
const scenarioTexts = (shown: Scenario) => [
  ...distinctTexts([...shown.intro, ...PANEL_KINDS.flatMap((kind) => shown[kind])]),
  ...faqTexts(shown.faq),
];

const monstersAt = (room: Room, players: PlayerCount) =>
  room.monsters.filter((monster) => Object.keys(monster.counts[players]).length);
const placedAt = (room: Room, players: PlayerCount) =>
  room.monsters.reduce((total, m) => total + Object.values(m.counts[players]).reduce((a, b) => a + (b ?? 0), 0), 0);

let failures = 0;
const fail = (...message: (string | number)[]) => {
  failures++;
  console.log('FAIL', ...message);
};

/** Fails if the screen shows text that only a section the party hasn't read has. */
async function checkHidden(page: Page, shown: Scenario, read: Set<string>, where: string) {
  const onScreen = normalise(await page.locator('main').innerText());
  const known = new Set([...scenarioTexts(shown), ...[...read].flatMap((id) => sectionTexts(shown.sections[id]))]);
  for (const section of Object.values(shown.sections)) {
    if (read.has(section.id)) continue;
    if (sectionTexts(section).some((text) => !known.has(text) && onScreen.includes(text))) {
      fail(where, `shows text from section ${section.id} before it is read`);
    }
  }
}

/** Saves the whole length of the screen. */
async function screenshot(page: Page, name: string) {
  // Captured whole, the bar of buttons along the bottom would be drawn where the
  // first view of the screen ends, over what lies below it. Unstuck, it comes
  // after everything else, as it does once the screen is scrolled to its end.
  await page.screenshot({
    path: join(out, `${name}.png`),
    fullPage: true,
    style: '.screen-actions { position: static; }',
  });
}

async function currentStep(page: Page) {
  return (await page.locator('.step-hexes [aria-current="step"]').getAttribute('title')) ?? '';
}

async function heading(page: Page) {
  const headings = page.locator('main h1');
  return (await headings.count()) ? normalise((await headings.first().textContent()) ?? '') : '';
}

/** Steps through a stepped screen to its last step, checking each one. Returns the steps' names and text. */
async function walk(
  page: Page,
  shown: Scenario,
  tag: string,
  where: string,
  room: Room | null,
  players: PlayerCount,
  read: Set<string>,
  shoot: boolean,
) {
  const steps: string[] = [];
  const texts: string[] = [];
  for (let n = 0; ; n++) {
    await page.locator('main').waitFor();
    const step = await currentStep(page);
    const at = `${tag} ${where}, step ${n + 1} (${step})`;
    steps.push(step);

    await page
      .locator('main img')
      .evaluateAll((images) =>
        Promise.all(
          (images as HTMLImageElement[]).map(
            (image) => image.complete || new Promise((done) => (image.onload = image.onerror = done)),
          ),
        ),
      );
    const broken = await page
      .locator('main img')
      .evaluateAll((images) => (images as HTMLImageElement[]).filter((image) => !image.naturalWidth).length);
    if (broken) fail(at, `${broken} pictures didn't load`);

    const title = await heading(page);
    if (/Pull these monsters|Gather these tokens/.test(title)) {
      if (await page.locator('main .piece-count, main .monster-count').count()) fail(at, 'shows how many to take');
      if (!(await page.locator('main .gallery').count())) fail(at, 'shows no pictures');
    }
    if (room && /Pull these monsters/.test(title)) {
      const pictures = await page.locator('main .gallery img').count();
      const present = monstersAt(room, players).length;
      if (pictures !== present) fail(at, `${pictures} monster pictures for ${present} monsters`);
    }
    if (room && title === 'Place everything') {
      const placed = await page.locator('.placed').count();
      const listed = placedAt(room, players);
      if (placed !== listed) fail(at, `${placed} monsters on the map, ${listed} listed`);
    }
    if (step === 'Conclusion' && (await page.locator('.panel-rewards').count()))
      fail(at, 'shows rewards with the story');
    const story =
      step === 'Introduction' ? shown.intro : ['Story', 'Conclusion'].includes(step) ? shown.sections[where].story : [];
    const onScreen = normalise(await page.locator('main').innerText());
    texts.push(onScreen);
    if (distinctTexts(story).some((text) => !onScreen.includes(text))) fail(at, 'shows the story in another language');
    await checkHidden(page, shown, read, at);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 0) fail(at, `runs ${overflow}px off the side of the screen`);

    if (shoot) await screenshot(page, `${tag.split(',')[0]}-${where}-${n + 1}`);
    const next = page.getByRole('button', { name: /^Next:/ });
    if (!(await next.count())) return { steps, text: texts.join(' ') };
    await next.click();
  }
}

/** Checks the play screen, where the party spends the scenario. */
async function checkPlay(page: Page, shown: Scenario, tag: string, read: Set<string>, shoot: boolean, name: string) {
  await page.locator('.play').waitFor();
  const at = `${tag} play screen ${name}`;
  await checkHidden(page, shown, read, at);
  const opened = [scenario, ...[...read].map((id) => scenario.sections[id])];
  const goals = opened.some((source) => source.goals.length);
  const placeholder = await page.locator('.panel-goals .panel-note').count();
  if (goals === Boolean(placeholder)) fail(at, goals ? 'shows the goal placeholder' : 'shows no goal');
  const onScreen = normalise(await page.locator('main').innerText());
  if (faqTexts(opened.flatMap((source) => source.faq)).some((text) => !onScreen.includes(text))) {
    fail(at, 'is missing an answer from the FAQ');
  }
  if (shoot) await screenshot(page, `${tag.split(',')[0]}-play-${name.replaceAll(' ', '-')}`);
}

async function changeSettings(page: Page, skipLoot: boolean, language: Language) {
  await page.getByRole('button', { name: 'Settings' }).click();
  if (skipLoot) await page.getByLabel(/Skip the loot deck/).check();
  await page.getByLabel(LANGUAGES[language], { exact: true }).check();
  await page.getByRole('button', { name: 'Done' }).click();
}

async function play(
  page: Page,
  tag: string,
  players: PlayerCount,
  skipLoot: boolean,
  language: Language,
  shoot: boolean,
) {
  const shown = inLanguage(scenario, language);
  await page.goto(app);
  const keypadOff = await page.evaluate(() => {
    const keys = [...document.querySelectorAll('.hex-key')].map((key) => key.getBoundingClientRect());
    return Math.max(...keys.map((key) => key.right)) - document.documentElement.clientWidth;
  });
  if (keypadOff > 0) fail(tag, `keypad runs ${keypadOff}px off screen`);
  if (skipLoot || language !== 'en') await changeSettings(page, skipLoot, language);

  for (const digit of number) await page.getByRole('button', { name: digit, exact: true }).click();
  await page.getByRole('button', { name: 'Open' }).click();
  await page.getByRole('heading', { name: 'How many characters?' }).waitFor();
  const offCentre = await page.evaluate(() => {
    const row = document.querySelector('.home-keys .hex-row')!.getBoundingClientRect();
    const prompt = document.querySelector('.home-keys .home-prompt')!.getBoundingClientRect();
    return Math.abs((row.left + row.right) / 2 - (prompt.left + prompt.right) / 2);
  });
  if (offCentre > 1) fail(tag, `character count row is ${offCentre}px off centre`);
  await page.getByRole('button', { name: String(players), exact: true }).click();

  const facts = normalise(await page.locator('.scenario-facts').innerText());
  if (!facts.includes('Complexity')) fail(tag, 'introduction shows no complexity');
  if (scenario.requirements.some((requirement) => !facts.includes(requirement.name))) {
    fail(tag, 'introduction is missing a requirement');
  }
  if (scenario.region && !(await page.locator('.scenario-line').innerText()).includes(scenario.region)) {
    fail(tag, 'introduction shows no region');
  }

  const read = new Set<string>();
  const { steps: setup } = await walk(page, shown, tag, 'setup', scenario.room, players, read, shoot);
  if (skipLoot === setup.includes('Loot deck')) fail(tag, skipLoot ? 'shows the loot deck' : 'has no loot deck step');

  // The last step of setup shows the map, which turns a quarter at a time and stays inside its box.
  const angles = new Set<string>();
  for (let turn = 1; turn <= 4; turn++) {
    await page.getByRole('button', { name: 'Turn map' }).click();
    const fits = await page.evaluate(() => {
      const box = document.querySelector('.map-box')!.getBoundingClientRect();
      const map = document.querySelector('.map')!.getBoundingClientRect();
      return (
        map.left >= box.left - 1 && map.right <= box.right + 1 && map.top >= box.top - 1 && map.bottom <= box.bottom + 1
      );
    });
    if (!fits) fail(tag, `map overflows its box after ${turn} turns`);
    angles.add(await page.locator('.map').evaluate((map) => (map as HTMLElement).style.transform));
  }
  if (angles.size !== 4) fail(tag, `map turns to ${angles.size} positions, not 4`);

  await page.getByRole('button', { name: 'Start the scenario' }).click();
  await checkPlay(page, shown, tag, read, shoot, 'at the start');

  const conclusions = readingOrder.filter((section) => section.isConclusion);
  let reloaded = false;
  for (const section of readingOrder) {
    const id = section.id;
    const trigger = page
      .locator('button.trigger')
      .filter({ has: page.locator('strong', { hasText: new RegExp(`^${id.replace('.', '\\.')}$`) }) });
    if (!(await trigger.count())) {
      fail(tag, `play screen has no way to read section ${id}`);
      continue;
    }
    const roomLink = page.getByRole('button', { name: `See the ${id} room` });
    if (await roomLink.count()) fail(tag, `play screen links to the room of section ${id} before it is read`);

    // A conclusion ends the run, so the party's progress is put back after reading all but the last.
    const saved = section.isConclusion ? await page.evaluate(() => localStorage.getItem('turbohaven.run')) : null;
    await trigger.first().click();
    await page.getByRole('button', { name: `It happened, read ${id}` }).click();
    read.add(id);

    // A reload partway through a section comes back to the same step.
    if (!reloaded && !section.isConclusion && (await page.getByRole('button', { name: /^Next:/ }).count())) {
      reloaded = true;
      await page.getByRole('button', { name: /^Next:/ }).click();
      const before = await currentStep(page);
      await page.reload();
      await page.locator('main').waitFor();
      if ((await currentStep(page)) !== before) fail(tag, `reload in section ${id} moved to another step`);
      await page.getByRole('button', { name: 'Back', exact: true }).click();
    }

    const { steps, text } = await walk(page, shown, tag, id, section.room, players, read, shoot);
    if (section.rewards.length && !steps.includes('Rewards')) fail(tag, `section ${id} has no rewards step`);
    if (faqTexts(section.faq).some((faq) => !text.includes(faq))) {
      fail(tag, `section ${id} leaves out an answer from the FAQ`);
    }

    if (!section.isConclusion) {
      await page.getByRole('button', { name: 'Back to the scenario' }).click();
      if (section.room) {
        await roomLink.click();
        if ((await currentStep(page)) !== 'Place everything')
          fail(tag, `room link for section ${id} opens another step`);
        const back = page.getByRole('button', { name: 'Back to the scenario' });
        while (!(await back.count())) await page.getByRole('button', { name: /^Next:/ }).click();
        await back.click();
      }
      await checkPlay(page, shown, tag, read, shoot, `after ${id}`);
    } else if (section !== conclusions.at(-1)) {
      await page.evaluate((run) => localStorage.setItem('turbohaven.run', run!), saved);
      await page.reload();
      read.delete(id);
      await checkPlay(page, shown, tag, read, false, `after ${id}`);
    } else {
      await page.getByRole('button', { name: 'Finish the scenario' }).click();
      await page.getByRole('heading', { name: 'Which scenario?' }).waitFor();
    }
  }
  if (!conclusions.length) fail(tag, 'scenario has no conclusion');
}

const browser = await chromium.launch();
for (const [label, viewport] of Object.entries(VIEWPORTS)) {
  for (const players of PLAYER_COUNTS) {
    const language = label === 'phone' && translation ? translation : 'en';
    const tag = `${label}, ${players} characters${language === 'en' ? '' : `, in ${language}`}:`;
    const context = await browser.newContext({ viewport, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    context.setDefaultTimeout(10_000);
    const page = await context.newPage();
    let problems = 0;
    const note = (message: string) => {
      problems++;
      appendFileSync(browserLog, `${tag} ${message}\n`);
    };
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type())) note(message.text());
    });
    page.on('pageerror', (error) => note(error.message));
    page.on('response', (answer) => {
      if (answer.status() >= 400) note(`${answer.status()} ${answer.url()}`);
      // A dev server answers a file it has lost track of with the app's page instead of an error.
      const isData = new URL(answer.url()).pathname.startsWith(new URL('data/', app).pathname);
      if (isData && answer.headers()['content-type']?.startsWith('text/html')) note(`page instead of ${answer.url()}`);
    });

    try {
      await play(page, tag, players, label === 'portrait' && players === 2, language, players === 3);
    } catch (error) {
      // Only the first line: the rest describes the page, which can quote it.
      fail(tag, 'stopped:', String(error).split('\n')[0]);
      note(String(error));
    }
    if (problems) fail(tag, `${problems} browser problems, listed in ${browserLog}`);
    await context.close();
  }
}
await browser.close();

console.log(
  failures
    ? `${failures} failures`
    : `scenario ${number}: all checks passed at 3 screen sizes for 2, 3 and 4 characters` +
        (translation ? `, at phone size in ${translation}` : ''),
);
process.exitCode = failures ? 1 : 0;
