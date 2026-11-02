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

Aids with scenario setup and advancement, in a spoiler-minimized way.

## Running it

```sh
npm install
npm run dev     # local site
npm test        # unit tests, using fake stickers
npm run build   # static site in dist/
```

## Publishing

Pushing to `main` publishes the rulebook to GitHub Pages, at
<https://nventuro.github.io/turbohaven/>.

## Content

**`content/spoilers/` holds the sticker and appendix text. Opening it spoils the
game**, and so does a diff of it.

- `content/rulebook/` is the base rules, in file name order.
- `content/spoilers/` has one file per sticker or gated appendix. `appendix-e.md`
  is read one treasure at a time, as the book requires.
- `public/figures/` has the book's diagrams and worked examples, placed in the
  base rules with `<img class="figure">`.

These markers in the base rules connect the two:

| Marker                          | Meaning                                       |
| ------------------------------- | --------------------------------------------- |
| `<!-- sticker 4 -->`            | Where sticker 4 goes                          |
| `<!-- spoiler appendix-d -->`   | Where a gated appendix goes                   |
| `<!-- replaced-by sticker-13 -->` | Printed text that sticker 13 covers, up to `<!-- /replaced-by -->` |
| `<!-- treasure-lookup -->`      | Where to look up treasures by number          |
| `<!-- page 12 -->`              | Where printed page 12 starts                  |
| `<!-- letters -->`              | The next numbered list uses letters           |

## Disclaimer

This is an unofficial fan project, not affiliated with or endorsed by
Cephalofair Games. Frosthaven and all related properties, images and text are
owned by Cephalofair Games.