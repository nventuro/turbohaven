# turbohaven

A helper application for the board game Frosthaven, built around staying
spoiler-free.

## Rulebook

A digital version of the rulebook, with:

- collapsible sections that stay collapsed between visits
- search
- opt-in spoilers: rules added by envelopes and stickers stay sealed until you
  break the seals your campaign has reached, and sealed text stays out of the
  page and its search

## Scenario helper

Aids with scenario setup and advancement, in a spoiler-minimized way. See
`scenarios/README.md`.

## Layout

- `rules/` is the rulebook.
- `scenarios/` is the scenario helper, and the pipeline that reads its data out
  of the scenario books.
- `shared/` is what both apps use: the site's colours, fonts and base styles,
  the bar along the top of every screen, and the code that loads data and saves
  to the browser.
- `index.html` is the page at the site's root, which leads to the two.

Both apps share one `package.json`, and their TypeScript settings build on
`tsconfig.base.json`. Each has its own Vite config, and the root's Vite config
runs both in one dev server.

## Running it

```sh
npm install
npm run dev     # the whole site, locally, with each app in its folder
npm test        # rulebook unit tests, using fake stickers
npm run format  # formats the code with Prettier
npm run build   # the whole site, static, in dist/
```

The build stops on code Prettier would format differently, so run
`npm run format` before pushing.

## Publishing

Pushing to `main` publishes the site to GitHub Pages, at
<https://nventuro.github.io/turbohaven/>, with the rulebook under `rules/` and
the scenario helper under `scenarios/`. A link to the root that names a section
or a spoiler list goes on to the rulebook.

## Content

**`rules/content/spoilers/` holds the sticker and appendix text. Opening it
spoils the game**, and so does a diff of it.

- `rules/content/rulebook/` is the base rules, in file name order.
- `rules/content/spoilers/` has one file per sticker or gated appendix.
  `appendix-e.md` is read one treasure at a time, as the book requires.
- `rules/public/figures/` has the book's diagrams and worked examples, placed in
  the base rules with `<img class="figure">`.

These markers in the base rules connect the two:

| Marker                            | Meaning                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `<!-- sticker 4 -->`              | Where sticker 4 goes                                               |
| `<!-- spoiler appendix-d -->`     | Where a gated appendix goes                                        |
| `<!-- replaced-by sticker-13 -->` | Printed text that sticker 13 covers, up to `<!-- /replaced-by -->` |
| `<!-- treasure-lookup -->`        | Where to look up treasures by number                               |
| `<!-- page 12 -->`                | Where printed page 12 starts                                       |
| `<!-- letters -->`                | The next numbered list uses letters                                |

## Disclaimer

This is an unofficial fan project, not affiliated with or endorsed by
Cephalofair Games. Frosthaven and all related properties, images and text are
owned by Cephalofair Games.
