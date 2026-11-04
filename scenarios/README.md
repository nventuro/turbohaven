# Scenario helper

Guides a party through a Frosthaven scenario one step at a time: setup for the
starting room only, then each new room and its rules as the party reaches it.

## Running the app

From the repository's root:

```sh
npm install
npm run dev
```

The app is under `/scenarios/` on the address it prints.

`npm run build` type-checks both apps and builds the whole site into `dist/`,
with this app in `dist/scenarios/`. It has no backend, and keeps the scenario
in progress in the browser's local storage.

## Adding a scenario

In Claude Code, `/add-scenario 7` does all of what follows. It also checks the
result against the book and decides what to hold back, without showing you
any of the scenario.

**`public/data/`, `pipeline/pieces.json` and `pipeline/.cache/` hold the
scenarios' content. Opening them spoils those scenarios**, and so does a diff
of them.

The app reads `public/data/`, which the pipeline generates from the scenario
and section books in [Worldhaven](https://github.com/any2cards/worldhaven).
[Gloomhaven Secretariat](https://github.com/Lurkars/gloomhavensecretariat) data
checks the result, so a misread page stops the build.

```sh
cd pipeline
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python build.py 7
```

The first run for a scenario can stop and list tokens it has not seen before,
with a path to an image of each. Add each one to `pipeline/pieces.json`, under
the name it has in the book's Scenario Key, then build again. If that name
contains icons, the text around them goes in `key` and a readable name in
`name`. Each token only needs naming once.

It can also stop on a requirement icon it has not seen before, such as one
for a building the party needs. Copy the listed drawing into
`pipeline/requirements/`, named after the requirement, as `Boat.svg` is.

The build stops on a part of a page the app has no place for yet, such as a
boss's special abilities, rather than leave it out.

Scenarios that run over two pages or come in A and B versions are not supported
yet, and the build stops with an error on them.

To compare a built scenario with the book,
`.venv/bin/python render.py 7 <folder>` renders its scenario page and each
section's part of its page, with each map again larger.

The book prints a scenario's goals, rules and links up front, even those that
give away what a door hides. `pipeline/held-back/7.json` lists the ones that
wait for a later section: it maps a paragraph's id to the section that
reveals it. Each build lists every paragraph with its id in
`pipeline/.cache/paragraphs/7.md`.

## Checking a scenario in the app

From the repository's root, with the dev server running, this plays a
scenario from the keypad to its conclusion at three screen sizes for 2, 3 and
4 characters, and saves a full-length screenshot of every step:

```sh
node scenarios/checks/walkthrough.ts http://localhost:5173/scenarios/ 7 <screenshot folder>
```

The first time, install its browser with `npx playwright install chromium`.
