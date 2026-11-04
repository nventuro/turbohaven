---
name: add-scenario
description: Adds a Frosthaven scenario to the scenario helper. Builds its data from the books, checks it against the printed pages, and holds back anything that would show players what they haven't reached yet, without telling the user any of it. Use when the user says "/add-scenario <number>".
argument-hint: <scenario number>
disable-model-invocation: true
---

# Add a scenario

Add scenario $ARGUMENTS to the scenario helper in `scenarios/`.

The user runs this so they never have to look at what it produces. They are
playing the campaign, and this is a scenario they haven't played. They won't
read the data, the diffs or the screenshots, so you are the only check between
the books and their table. That gives you three jobs, in this order of
priority:

1. **Keep the user unspoiled.** Nothing you tell them gives the scenario away,
   and you never ask them about it.
2. **Get it right.** What the table reads and places must match the book:
   every rule, number, monster, token and tile.
3. **Keep it hidden until its time.** Nothing appears on a screen before the
   book would have shown it to players who play in order.

When you can't do all three, stop and report rather than ship something
wrong. When you can, use your judgment and say in the report what you
decided, in the content-free terms below.

## 1. Keep the user unspoiled

Everything about the scenario beyond its number is a spoiler. That includes its
title, story, monsters, pieces, rules, goals, sections, rooms and rewards. It
also includes how many rooms or sections it has, and whether it has a boss.

What shows in the terminal while you work is fine: commands, their output and
file edits. What you tell the user isn't:

- **Your messages and the report** refer to the scenario and its sections by
  number, and to files by path. They never name or describe what is in them,
  and they don't repeat the pipeline's errors, which can quote the book.
- **Never ask the user** anything about the scenario, such as what a token is
  called or whether a paragraph gives something away. They can't answer
  without spoiling it. Decide it yourself, and say in the report that you did,
  in general terms.

## 2. Build the data

From `scenarios/pipeline/` (set up the venv first if it's missing; see
`scenarios/README.md`):

```sh
.venv/bin/python build.py $ARGUMENTS
```

This reads the scenario page and every section it leads to from the books. It
then writes `scenarios/public/data/scenarios/$ARGUMENTS.json` and its images.
Gloomhaven Secretariat (GHS) checks the monsters, loot, tiles, requirements and
title, and the Scenario Key checks the pieces. The build stops on any
disagreement.

When it stops, act on the kind of stop:

- **Tokens it hasn't seen.** It lists each one with an image and the rooms
  it is printed in.
  1. Look at each image, and find the token on the render of a room it is
     printed in and in the Scenario Key on the render of the scenario page
     (see step 3).
  2. Add it to `pipeline/pieces.json` under the name the Key gives it.
  3. When the Key's name includes icons, the words around them go in `key`
     and a readable name in `name`, as the existing entries show.
- **A requirement icon it hasn't seen.** Copy the listed drawing into
  `pipeline/requirements/`, named after the GHS requirement it stands for.
- **FAQ entries without a decision.** Decide each one as step 4 says, then
  build again.
- **A panel or header item the app has no place for, a scenario over two
  pages, or one in A and B versions.** Stop. The app can't show these yet, and
  adding a way to is a change to the app the user decides on. Report it in
  general terms, such as "a kind of panel the app doesn't show yet".
- **A disagreement with GHS or the Scenario Key, or a tile or marker it can't
  read.** Find out whether the pipeline misread the page. Look at the page
  render and the data.
  - If it did, fix the pipeline in general terms, never by special-casing this
    scenario.
  - If the book and GHS truly disagree, the book wins. If the pipeline has no
    way to accept that, stop and report.

After any change to the pipeline, rebuild every scenario already in
`public/data/scenarios/`. Check by hash that their files are unchanged,
unless your fix was meant to change them, and then check those again as in
step 3.

## 3. Check it against the book

The pipeline's checks cover counts. They don't cover whether the text reads
right or the maps look right, and a misread page can pass them. From
`scenarios/pipeline/`, render the pages:

```sh
.venv/bin/python render.py $ARGUMENTS <scratchpad>/pages-$ARGUMENTS
```

It saves the scenario page and each section's part of its page, and each map
again larger, even when the build stops. Open them with the Read tool and
compare them with the data:

- Every panel is there, under the right kind: goals, effects, special rules,
  section links, rewards.
- Every paragraph is complete and in order across columns. Icons sit where
  the book puts them, and bold and italic text matches the book's.
- Section references and door numbers point where the book points.
- Each room's tiles have the right labels and sides. Its map image shows that
  room as the book prints it, without its monsters, and nothing from another
  room.
- Monster tokens sit on the right hexes, normal or elite at each of 2, 3 and
  4 characters. Pieces carry the right names.
- The location, region, complexity and requirements match the page header.

Fix what's wrong in the pipeline, as in step 2. Never hand-edit the generated
files, because the next build would undo it.

## 4. Hold back what isn't revealed yet

The book prints a scenario's goals, effects, rules and links together on its
first page. It does that to fit the page, not because players should know all
of it up front. The app shows each thing when the party reaches it.

Every build lists the scenario's paragraphs in
`scenarios/pipeline/.cache/paragraphs/$ARGUMENTS.md`. Each one appears where
it now stands, with an id, and the list also gives each room's tiles,
monsters and pieces. Go back to the page renders wherever the list isn't
enough.

Walk through the scenario the way the party will:

1. the introduction and setup of the starting room;
2. play;
3. each section in the order it can be reached;
4. the conclusion, then its rewards.

At each screen, ask of everything on it: could a player who has seen only what
came before learn something here that the book tells later? That includes:

- a name: a monster, a character, a place, an object;
- that something exists: a room, a boss, an ally, a second wave;
- what a door leads to, or how the scenario ends;
- a hint that gives any of these away without naming it.

What the party has already seen counts as known:

- the introduction;
- the story of each section on the way there;
- everything placed in the rooms so far;
- the scenario's header;
- anything the rulebook covers.

Leave these alone:

- **Story text** (the introduction, each section's story, the conclusion) is
  read when the book says to read it. Never change or move it.
- **Rewards** come last already.
- **Anything players need before the reveal** stays where it is, even if it
  gives something away. That covers a rule that changes what they should do
  now, an effect applied at setup, a goal they can already work towards, and
  a link whose trigger can already happen. Playing by the rules matters more
  than a surprise. Note it for the report.

How the scenario ends is a reveal when it involves something players haven't
seen: a monster to kill that hasn't appeared yet, or something to destroy or
reach that they haven't seen or don't know is there. They can't work towards
it yet, so they don't need it, and showing it tells them what is coming. Hold
such a goal back until the section that reveals that thing, even when that
leaves no goal on screen until then. The same goes for a rule about such a
thing, or a link only it can trigger. A goal that refers only to what the
party has seen stays where it is.

Anything else that gives a reveal away is held back until the section that
reveals it, so it appears there. That section must be one the party passes
through on every route before the paragraph can matter. If no section is
like that, leave the paragraph where it is and note it for the report.

Record each hold-back in `scenarios/pipeline/held-back/$ARGUMENTS.json`,
which maps a paragraph's id to the section it waits for:

```json
{
  "3f2a9c1e07b4": "112.3"
}
```

A rebuild keeps your decisions, and stops if the book no longer has one of the
paragraphs. Build again, then check in the new listing that each held-back
paragraph is where you meant it to be.

The app shows a placeholder when no goal is shown yet. Apart from the
translation in step 5, don't write any other text of your own into a
scenario.

### What the FAQ says

The app also shows what the official FAQ says about the scenario: its errata
and its answers to questions. The build finds every FAQ entry that names the
scenario, one of its sections or one of its monsters, and lists them in
`scenarios/pipeline/.cache/faq/$ARGUMENTS.md`. It stops until
`scenarios/pipeline/faq/$ARGUMENTS.json` decides each one:

```json
{
  "5d0c8e1a92f4": { "in": "$ARGUMENTS" },
  "a71b3f06c2d8": { "in": "112.3", "quote": "the part about this scenario, copied exactly" },
  "e49d2b7f1c35": { "omit": "about another scenario" }
}
```

Finding entries by name casts a wide net, so leave these out with `omit` and a
short reason that gives nothing away:

- an entry that isn't about playing this scenario: one that names it only in
  passing, names another scenario numbered like one of its sections, or names
  one of its monsters only as an example of a general rule;
- an erratum the book scan already has fixed. The scans are of a later
  printing than some errata, so check each erratum about the book against the
  page render. Showing a fixed erratum would tell the table to undo the fix.

Errata about components, such as a sticker sheet or a count of standees, stay
in: they depend on the user's copy, and the FAQ says which printing they
apply to.

Show every other entry with `in`, set to the scenario's number to show it from
the start, or to the section to show it from:

- an entry about a section, from that section;
- an entry about a monster, from the room where that monster is first placed;
- an entry about the conclusion, from the conclusion, where it shows with the
  rewards;
- an entry about the scenario as a whole, from the start, unless it gives a
  reveal away. Then show it from the section that reveals it, by the same
  rules as the paragraphs above.

When an entry also covers other scenarios, showing all of it would spoil them.
Add `quote` with only the part about this one, copied exactly.

A rebuild keeps your decisions, and stops when the FAQ no longer has an entry
you decided on, or has one you haven't. Build again, then check in the
paragraphs listing that each entry is where you meant it to be.

## 5. Translate the story

Run the `translate-story` skill for scenario $ARGUMENTS. It translates the
story text into Spanish, in
`scenarios/pipeline/translations/es-AR/$ARGUMENTS.json`, and builds the
scenario again until the build accepts the translation.

If a pipeline change in step 2 changed the story of a scenario already in the
app, its build stops on its translation. Bring that one up to date the same
way.

## 6. Walk through it in the app

Start the dev server from the repository root with `npm run dev`, in the
background, if it isn't running. Then run the walkthrough from the repository
root, which takes several minutes, also in the background:

```sh
node scenarios/checks/walkthrough.ts http://localhost:5173/scenarios/ $ARGUMENTS <scratchpad>/walkthrough-$ARGUMENTS
```

It plays the scenario from the keypad to its conclusion at three screen
sizes, for 2, 3 and 4 characters, with the story in Spanish at phone size.
Along the way it checks that:

- every section can be opened from the play screen;
- every FAQ entry shows, in its section and on the play screen from then on;
- every picture and data file loads;
- each map holds as many monsters as the lists name;
- each story shows in the language chosen in the settings;
- no screen shows text that only a section not yet read has;
- rewards come after the conclusion's story.

Messages from the browser go to `browser.log` in the screenshot folder.

It saves a screenshot of every step at 3 characters, at each of the three
sizes. Each one shows the whole length of the screen, with the bar of buttons
that stays along the bottom drawn after everything else, where it ends up
once the screen is scrolled to its end. Look at every one of them with the
Read tool:

- at tablet size, check that each screen shows what step 3 found in the book
  and the FAQ entries step 4 placed there, and nothing step 4 held back;
- at portrait and phone sizes, check that everything on each screen can be
  read, and nothing is cut off, covered or squeezed;
- at phone size, check that each story reads as `translate-story` asks.

Then run `npm run build` from the repository root. It runs Prettier, the type
checks and every build.

## 7. Report

Leave everything in the working tree.

Tell the user, without naming or describing anything in the scenario:

- whether scenario $ARGUMENTS is in the app now, or why not, in the general
  terms of step 2;
- what you changed outside the scenario's own data: the pipeline, the
  pieces, the requirements. Say each change in terms of the book's layout,
  not its content;
- how many paragraphs you held back, and how many you left showing although
  they give something away;
- whether the story is translated, and any translation you brought up to
  date, by scenario number;
- how many FAQ entries show, and how many you left out and why, in general
  terms such as "already fixed in the book";
- which checks ran, and whether they passed.

Don't list the files you added, or the sections the paragraphs were held back
until.
