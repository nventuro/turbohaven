---
name: translate-story
description: Translates a Frosthaven scenario's story text (its introduction, each section's story, its conclusion) into Argentinian Spanish, keeping each speaker's voice. Leaves rules, goals, effects, links and rewards alone. Use when asked to translate a scenario's story or lore into Spanish, or when the user says "/translate-story <scenario number>".
argument-hint: <scenario number, or the text itself>
---

# Translate a scenario's story

Translate the story text of scenario $ARGUMENTS, or the story text you are
given, into Argentinian (Rioplatense) Spanish.

The players read it aloud at the table, in Spanish, while playing with the
English game. It has to sound like a Spanish book written for them, not like a
translation, and it must not tell them anything the English doesn't.

## What to translate

Only the story text, which is what the book prints for players to read aloud:

- the scenario's introduction;
- each section's story, including the story of a conclusion.

Never translate rules, goals, effects, links, rewards, monster or piece names,
or anything else that tells players what to do. Those stay in English, as on
the cards and in the rulebook.

## The user may not have played it

The user is playing the campaign and may not have reached this scenario. Unless
they asked to see its text, don't quote or describe the text or your
translation in your messages, and don't ask them about it: decide every doubt
yourself. Say in general terms what you decided, if it matters.

## A scenario in the app

The scenario helper reads a scenario's Spanish story from
`scenarios/pipeline/translations/es-AR/<number>.json`, which maps each story
paragraph's id to that paragraph in Spanish. From `scenarios/pipeline/` (set
up the venv first if it's missing; see `scenarios/README.md`):

1. Build the scenario with `.venv/bin/python build.py <number>`. Each build
   lists the scenario's story paragraphs by id, in reading order, in
   `.cache/story/<number>.json`, even when it then stops on the translation.
2. If the scenario has no translation yet, copy that listing to
   `translations/es-AR/<number>.json` and translate each paragraph in place,
   keeping its id. If it has one and the build stopped on it, the book's text
   has changed: translate each paragraph it says is missing, from the listing,
   and remove each one it says the book no longer has. Leave the rest alone.
3. Build again. It stops if the translation misses a paragraph, has one the
   book doesn't, or changes a paragraph's icons, doors, scenarios or sections.
   Fix the translation and build again until it passes.

Keep the file laid out as the listing is, so its diffs stay readable.

## Paragraphs and segments

Story text is a list of paragraphs. Give back the same paragraphs, in the same
order, one translated paragraph for each original.

Each paragraph is a list of segments:

- `{ "text": "..." }`, maybe with `"bold": true` or `"italic": true`: translate
  the text, and keep the bold or italic on the words that translate it;
- `{ "icon": ... }`, `{ "door": ... }`, `{ "scenario": ... }`,
  `{ "section": ... }`: copy them unchanged. Keep each one next to the words it
  belongs to, even if Spanish word order moves those words.

Split and join the text segments around them as Spanish needs. In plain text,
these appear as markers such as `{scenario 13}`, which you keep the same way.

## Faithful, not literal

- Translate what each sentence means and how it feels, not word for word.
  Reorder, split or join sentences inside a paragraph when Spanish reads
  better.
- Add nothing and leave nothing out: no explanations, no softening, no extra
  description, no notes.
- **Never be more specific than the English.** If it says "the creature", "a
  figure" or "something", so do you, even if you know or can guess what it is.
  Vagueness in the story is often on purpose, and a precise word can give away
  what the book reveals later. Likewise, keep a pronoun or an ending in Spanish
  from settling something the English leaves open, such as whether an unknown
  speaker is a man or a woman.
- Keep the length and pacing close to the original: a short, punchy line stays
  short.

## Names stay in English

Players match the story against the English cards, map, stickers and rulebook,
so every name stays exactly as printed: people, peoples and species (Algox,
Lurkers), monsters, places (Frosthaven, the Biting Sea), buildings, items,
campaign stickers and scenario titles. Give them Spanish articles and grammar
around them: "los Lurkers", "un Algox", "el Biting Sea".

A place takes the gender of the kind of place it is: Frosthaven is a town, so
it is feminine ("Al verla"), and a sea or a mountain range is masculine.

A common noun that only describes something ("the crab-like figures", "the
corpse", "the tunnel") is translated as usual.

## The narrator

The narrator speaks to the whole party, so its "you" is plural: **ustedes**,
with third-person plural verbs ("Siguen el rastro hasta una cueva", "Ustedes
saben que es cierto"). Use it even where the English sounds singular, unless
the text clearly addresses one character.

The voice is that of an Argentinian fantasy novel: literary and vivid, with a
dry humour when the English has one, but never stiff. Use Argentinian
vocabulary and grammar:

- no vosotros, os or vuestro in narration;
- lo and la, not le, for direct objects ("lo ven", not "le ven");
- Argentinian words over Spanish ones: agarrar or tomar, never coger (vulgar
  in Argentina); enojarse, not enfadarse; anteojos, not gafas; plata, not
  pasta; acá and allá over aquí and allí, when they sound natural; no tío,
  vale, chaval, pillar, pegatina or guay.

The party is usually mixed. Prefer phrasings that don't need a gender for it
("se encuentran al borde del mar" rather than "están parados al borde del
mar"), but only when they read as naturally. When the natural phrasing needs a
gender ("a cada uno", "los abruma"), use the generic masculine rather than
twist the sentence, and never -e or -x.

## The characters' voices

This is what makes the translation good. When a character speaks, find what
marks their voice in the English, and carry it into Spanish by Rioplatense
means, not by translating each mark:

- **Drunk:** slurred, rambling, repeating themselves, losing the thread.
  Elide sounds and aspirate the s ("¿Qué mirás, eh? Si yo... yo ehtoy
  bárbaro"), keep any hiccups the English writes out, and add a "che" or two.
- **Sailors and pirates:** nautical words (babor, estribor, cubierta, bodega,
  grumete, marinero de agua dulce for "landlubber"), oaths ("¡Mil rayos!",
  "¡Por todos los mares!"), and any "Arrr" kept as it is.
- **Brigands, thugs and lowlifes:** lunfardo, the old slang of Buenos Aires'
  streets: guita or mango for money, chorro, gil, cana, fierro for a weapon,
  rajar for running off, manyar for understanding, "¿Qué hacés, gil?".
- **Country folk and the plain-spoken:** "pa'", "nomás", "m'hijo",
  "'ta bien", dropped final d's ("verdá").
- **Nobles, officials and the pompous:** usted, long sentences and elevated
  vocabulary.
- **The archaic, ritual and divine:** vosotros, as Argentinians know it from
  old texts and the anthem ("Oíd, mortales"), with a solemn word order.
- **Speakers who break the language** (a monster, a stranger, a child): break
  Spanish the same way, dropping articles or using infinitives
  ("Vos no pasar").

Characters talk to each other with **vos** ("¿Vos sabés adónde vas?") and to a
group with **ustedes**, unless their voice calls for usted or vosotros as
above.

Keep it in the world:

- No slang from the last few decades or tied to modern life (chabón, flashear,
  posta, re- as an intensifier, joya), and no references to the real world.
  Lunfardo works because it is old.
- Match the English's coarseness. Don't add swearing it doesn't have, and
  don't clean up what it does.

## Punctuation

- Opening ¿ and ¡ in every question and exclamation.
- Keep the book's curly quotes, “ ” for speech and quoted words and ‘ ’ inside
  them, and a sentence's closing punctuation after them, as Spanish does:
  dijo: “Ya vienen”.
- An aside between dashes takes rayas on both sides, attached to it: "el olor
  —un hedor intenso— sale de adentro". An English dash that introduces an
  explanation usually becomes a colon.
- Keep italics and bold where the original has them.

## Before you hand it back

Read each paragraph against its original and check that:

- nothing was added, lost or made more specific;
- every name is spelled as printed in English;
- every icon, door, scenario and section is there, next to its words;
- the narrator says ustedes throughout, and nothing sounds like Spain;
- each character still sounds like themselves.

Then read it once more as an Argentinian reader would, aloud, and smooth whatever
trips the tongue.

For a scenario in the app, leave the translation in the working tree. For
text you were given, give back the translated paragraphs in the form you
received them, and nothing else unless asked.
