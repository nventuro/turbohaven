#!/usr/bin/env python3
"""Builds the app's data for a scenario: `python build.py 7`.

The book is the source of what players read and place. GHS is used to check
the result, so a misread page stops the build instead of reaching the table.
"""

import hashlib
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import pymupdf
from PIL import Image

import maps
import pages
import sources
from pages import Span, centre

ROOT = Path(__file__).parent
OUT = ROOT.parent / "public" / "data"
PIECES = json.loads((ROOT / "pieces.json").read_text())
# One drawing per requirement, named after it.
REQUIREMENT_ICONS = ROOT / "requirements"
NUMBER = re.compile(r"-?\d+(?:\.\d+)?")

PLAYER_COUNTS = (2, 3, 4)
SECTION_BANNER = (0.14, 0.12, 0.13)
LOOT_NAMES = {"random_item": "Random item"}

# The banner across the top of a scenario page ends just above its first panel.
HEADER_BOTTOM = 98.0
# Tabs hanging off the banner sit further apart than the words inside one.
TAB_GAP = 12.0

SCENARIO_PANELS = {"Scenario Goals", "Scenario Goal", "Scenario Effects", "Special Rules",
                   "Section Links"}
SECTION_PANELS = SCENARIO_PANELS | {"Rewards"}

# For each scenario, the paragraphs that wait for a later section, by id.
HELD_BACK = ROOT / "held-back"
# Story text is read when the book says to, so only panels can wait.
HELD_BACK_KINDS = ("goals", "effects", "rules", "links")
# Every paragraph of the last build of each scenario, with its id.
PARAGRAPHS = sources.CACHE / "paragraphs"

# For each language, each scenario's story paragraphs in that language, by id.
TRANSLATIONS = ROOT / "translations"
# The languages the app can show the story in, besides the book's English.
LANGUAGES = ("es-AR",)
# Every story paragraph of the last build of each scenario, by id, to translate from.
STORY = sources.CACHE / "story"


class Build:
    """What is shared while reading all the pages of one scenario."""

    def __init__(self):
        self.placed_doors: set[str] = set()
        self.piece_totals: Counter = Counter()
        self.tile_labels: list[str] = []
        self.unknown_tokens: dict[str, Path] = {}
        self.unknown_requirements: dict[str, Path] = {}


def find_scenario_page(number: str) -> tuple[Path, int]:
    found = None
    for path in sources.scenario_books():
        for index, page in enumerate(pymupdf.open(path)):
            top = " ".join(w[4] for w in page.get_text("words") if w[1] < 60 and w[0] < 150)
            if found:
                if re.match(rf"{number}\s*CONT", top):
                    raise ValueError(f"scenario {number} runs over two pages, not supported yet")
                return found
            if re.match(rf"{number}\s*•", top):
                found = path, index
    if not found:
        raise ValueError(f"scenario {number} is not in the book")
    return found


def panel_text(doc, page, panel: pages.Panel, spans: list[Span]) -> list[list[dict]]:
    inside = [s for s in spans if panel.rect.contains(centre(s.rect)) and pages.is_body_text(s)]
    return pages.flow_text(inside + pages.read_icons(doc, page, panel.rect, spans, OUT / "icons"))


def panels_named(doc, page, panels: list[pages.Panel], spans: list[Span], *labels: str) -> list:
    """Returns the paragraphs of every panel with one of these headings."""
    paragraphs = []
    for panel in panels:
        if panel.label in labels:
            paragraphs += panel_text(doc, page, panel, spans)
    return paragraphs


def check_panels(panels: list[pages.Panel], known: set[str], where: str) -> None:
    """Stops the build on a panel the app has no place for, so none goes missing."""
    for panel in panels:
        if panel.label not in known:
            raise ValueError(f"{where} has a {panel.label!r} panel, which the app doesn't show yet")


def read_header(doc, page, spans: list[Span], where: str) -> tuple[str | None, list[dict]]:
    """Reads the banner across the top of a scenario page, besides its number and title.

    Returns the region named on a tab below it, if any, and the requirements
    on the ribbon at its end, which are drawn as icons or written out. A tab
    can also credit a guest designer, which isn't needed at the table.
    """
    header = [s for s in spans if s.rect.y1 < HEADER_BOTTOM]
    ribbons = [
        i.rect for i in pages.read_images(page)
        if i.rect.y1 < HEADER_BOTTOM and 40 < i.rect.height < 44 and i.rect.x0 > 400
    ]
    ribbon = None
    for rect in ribbons:
        ribbon = rect if ribbon is None else ribbon | rect

    written, tabs, unknown = [], [], []
    for span in header:
        if ribbon and ribbon.contains(centre(span.rect)) and span.font.startswith("PirataOne"):
            written.append(span)
        elif span.font.startswith("Tinos"):
            tabs.append(span)
        elif span.font.startswith("PirataOne") and span.size > 20:
            continue  # the title
        elif span.font.startswith("GermaniaOne") and span.rect.y0 < 60:
            continue  # the number and map location
        else:
            unknown.append(span)
    if unknown:
        raise ValueError(f"{where}: the header has text the app doesn't read: "
                         f"{[s.text for s in unknown]}")

    groups: list[list[Span]] = []
    for span in sorted(tabs, key=lambda s: s.rect.x0):
        if groups and span.rect.x0 - groups[-1][-1].rect.x1 < TAB_GAP:
            groups[-1].append(span)
        else:
            groups.append([span])
    labels = ["".join(s.text for s in group).strip() for group in groups]
    regions = [label for label in labels if not label.startswith("Design")]
    if len(regions) > 1:
        raise ValueError(f"{where}: the header has more tabs than a region: {regions}")

    items = [(s.rect.x0, {"name": s.text.strip(), "icon": None}) for s in written]
    if ribbon:
        for icon in pages.read_icons(doc, page, ribbon, spans, OUT / "icons"):
            items.append((icon.rect.x0, {"name": None, "icon": icon.file}))
    requirements = [item for _, item in sorted(items, key=lambda pair: pair[0])]
    return (regions[0] if regions else None), requirements


def _drawing(svg: str) -> tuple[str, list[float]]:
    return NUMBER.sub("#", svg), [float(n) for n in NUMBER.findall(svg)]


def requirement_name(svg: str) -> str | None:
    """Names a requirement icon after the reference drawing it matches.

    The same icon comes out of each page with coordinates that differ in the
    last decimal, so drawings are compared with a tolerance.
    """
    shape, numbers = _drawing(svg)
    for reference in sorted(REQUIREMENT_ICONS.glob("*.svg")):
        reference_shape, reference_numbers = _drawing(reference.read_text())
        if reference_shape == shape and all(
            abs(a - b) < 0.01 for a, b in zip(numbers, reference_numbers)
        ):
            return reference.stem
    return None


def name_requirements(build: Build, requirements: list[dict], ghs: dict, where: str) -> None:
    """Names the requirements drawn as icons, then checks them all against GHS.

    GHS also lists scenarios that must be played first, which the banner
    doesn't show, since the campaign only unlocks the scenario after them.
    """
    for requirement in requirements:
        if requirement["icon"]:
            path = OUT / "icons" / requirement["icon"]
            requirement["name"] = requirement_name(path.read_text())
            if not requirement["name"]:
                build.unknown_requirements[requirement["icon"]] = path

    expected = set()
    for entry in ghs.get("requirements", []):
        for kind, values in entry.items():
            if kind in ("buildings", "campaignSticker"):
                expected |= {value.split(":")[0] for value in values}
            elif kind != "scenarios":
                raise ValueError(f"{where}: GHS has a {kind!r} requirement the app doesn't read")
    if build.unknown_requirements:
        return
    found = {re.sub(r"\W+", "-", r["name"].lower()).strip("-") for r in requirements}
    if found != expected:
        raise ValueError(f"{where}: requirements differ from GHS: book {found}, GHS {expected}")


def key_entries(page: pymupdf.Page) -> list[pages.PlacedImage]:
    """Returns the banners of the Scenario Key, one for each piece."""
    return [
        image for image in pages.read_images(page)
        if 105 < image.rect.width < 115 and 34 < image.rect.height < 39
    ]


def read_key(page: pymupdf.Page, spans: list[Span]) -> dict[str, int | None]:
    """Reads the Scenario Key: its pieces, with how many the whole scenario uses."""
    key = {}
    for image in key_entries(page):
        inside = [s for s in spans if image.rect.contains(centre(s.rect))]
        words = sorted((s for s in inside if s.size < 8.5), key=lambda s: (s.rect.y0, s.rect.x0))
        counts = [s for s in inside if 9 < s.size < 10]
        key[" ".join(s.text.strip() for s in words)] = int(counts[0].text) if counts else None
    return key


def loot_rows(spans: list[Span]) -> list[Span]:
    return sorted(
        (s for s in spans if re.fullmatch(r"x\d{1,2}", s.text.strip())),
        key=lambda s: s.rect.y0,
    )


def loot_boxes(page: pymupdf.Page, spans: list[Span]) -> list[pages.Panel]:
    """Returns the Loot box, if the page has one, which is framed unlike the text panels."""
    rows = loot_rows(spans)
    frames = [
        d["rect"] for d in page.get_drawings()
        if d["fill"] and rows and all(d["rect"].contains(centre(s.rect)) for s in rows)
    ]
    return [pages.Panel("Loot", min(frames, key=lambda r: r.width * r.height))] if frames else []


def read_loot(doc, page, spans: list[Span], ghs: dict) -> list[dict]:
    rows = loot_rows(spans)
    counts = [int(s.text.strip()[1:]) for s in rows]
    if counts != list(ghs.values()):
        raise ValueError(f"loot differs from GHS: book {counts}, GHS {ghs}")

    loot = []
    for span, (kind, count) in zip(rows, ghs.items()):
        area = pymupdf.Rect(span.rect.x0 - 24, span.rect.y0 - 4, span.rect.x0, span.rect.y1 + 4)
        icons = pages.read_icons(doc, page, area, spans, OUT / "icons")
        loot.append({
            "name": LOOT_NAMES.get(kind, kind.capitalize()),
            "count": count,
            "icon": icons[0].file if icons else None,
        })
    return loot


def ghs_counts(rooms: list[dict]) -> dict[str, dict[int, Counter]]:
    """Returns how many of each monster GHS places, by player count and type."""
    counts: dict = defaultdict(lambda: defaultdict(Counter))
    for room in rooms:
        for monster in room.get("monster", []):
            for players in PLAYER_COUNTS:
                kind = monster.get("type") or monster.get(f"player{players}")
                if kind:
                    counts[monster["name"]][players][kind] += 1
    return counts


def book_counts(tokens: list[maps.Token]) -> dict[str, dict[int, Counter]]:
    counts: dict = defaultdict(lambda: defaultdict(Counter))
    for token in tokens:
        for players, kind in zip(PLAYER_COUNTS, token.presence):
            if kind:
                counts[PIECES[token.hash]["name"]][players][kind] += 1
    return counts


def same_shape(book: dict[int, Counter], ghs: dict[int, Counter]) -> bool:
    return all(sum(book[p].values()) == sum(ghs[p].values()) for p in PLAYER_COUNTS)


def reconcile_monsters(book: dict, ghs: dict, where: str) -> dict[str, str]:
    """Checks the map's monsters against GHS.

    Returns the types GHS calls something the map's markers cannot express,
    which is how a boss or a named monster comes out: it stands on the same
    piece as a normal monster and is printed with elite markers.
    """
    slug = lambda name: name.lower().replace(" ", "-")
    unmatched_book = [n for n in book if slug(n) not in ghs]
    unmatched_ghs = [n for n in ghs if n not in map(slug, book)]
    if len(unmatched_book) != len(unmatched_ghs):
        raise ValueError(f"{where}: monsters differ: book {list(book)}, GHS {list(ghs)}")

    for name in book:
        if slug(name) in ghs and any(
            book[name][p] != ghs[slug(name)][p] for p in PLAYER_COUNTS
        ):
            raise ValueError(f"{where}: {name} differs from GHS")

    renames = {}
    for book_name, ghs_name in zip(unmatched_book, unmatched_ghs):
        if not same_shape(book[book_name], ghs[ghs_name]):
            raise ValueError(f"{where}: {book_name} differs from GHS's {ghs_name}")
        if any(ghs[ghs_name][p]["boss"] for p in PLAYER_COUNTS):
            # GHS calls a named monster a boss too. Unlike a boss, it is a
            # variant of another monster type, and shares that type's standees.
            shared = sources.ghs_json(f"monster/{ghs_name}.json").get("standeeShare")
            renames[book_name] = "named" if shared else "boss"
    return renames


def read_room(build: Build, doc, pdf: Path, index: int, page, region: pymupdf.Rect,
              spans: list[Span], ghs_rooms: list[dict], name: str) -> dict | None:
    printed = maps.read_map(doc, page, region, spans)
    if not printed:
        return None

    unknown = [t for t in printed.tokens if t.hash not in PIECES]
    if unknown:
        probe = sources.CACHE / "unknown"
        probe.mkdir(parents=True, exist_ok=True)
        for token in unknown:
            pages.image_with_alpha(doc, token.image).save(probe / f"{token.hash}.png")
            build.unknown_tokens[token.hash] = probe / f"{token.hash}.png"
        return None

    art = {label: sources.tile_image(label) for label in build.tile_labels}
    tiles = [maps.identify_tile(doc, tile, art) for tile in printed.tiles]
    tile_refs = {r["ref"].strip() for r in ghs_rooms if r.get("ref")}
    if not tile_refs <= set(tiles):
        raise ValueError(f"{name}: tiles {tiles} do not include GHS's {tile_refs}")

    monsters = [t for t in printed.tokens if t.presence]
    pieces = [t for t in printed.tokens if not t.presence]

    book = book_counts(monsters)
    types = reconcile_monsters(book, ghs_counts(ghs_rooms), name)

    file = f"{name}.webp"
    width, height = maps.render_map(pdf, index, printed, spans,
                                    pages.read_panels(page, spans) + loot_boxes(page, spans),
                                    OUT / "maps" / file)

    area = printed.rect
    placements = []
    token_files = {}
    for token in monsters:
        monster = PIECES[token.hash]["name"]
        token_files[monster] = maps.save_token(doc, token, OUT / "tokens")
        rect = token.image.rect
        rename = types.get(monster)
        placements.append({
            "monster": monster,
            "token": token_files[monster],
            "x": (rect.x0 - area.x0) / area.width,
            "y": (rect.y0 - area.y0) / area.height,
            "width": rect.width / area.width,
            "height": rect.height / area.height,
            "strip": {
                "x": (token.strip.x0 - rect.x0) / rect.width,
                "y": (token.strip.y0 - rect.y0) / rect.height,
                "width": token.strip.width / rect.width,
                "height": token.strip.height / rect.height,
            },
            "presence": [rename if rename and kind else kind for kind in token.presence],
        })

    standees = {}
    for monster in token_files:
        slug = re.sub(r"\W+", "-", monster.lower()).strip("-")
        standee = sources.standee_image(slug)
        standees[monster] = None
        if standee:
            # Named after its content, as tokens are, so that a list of the
            # app's files doesn't give away which monsters a scenario has.
            data = pages.webp(Image.open(standee))
            standees[monster] = hashlib.sha1(data).hexdigest()[:12] + ".webp"
            pages.write_if_changed(OUT / "standees" / standees[monster], data)

    listed = Counter()
    thumbnails = {}
    for token in pieces:
        if token.door:
            if token.door in build.placed_doors:
                continue
            build.placed_doors.add(token.door)
        piece = PIECES[token.hash]
        listed[piece["name"]] += 1
        thumbnails[piece["name"]] = maps.save_token(doc, token, OUT / "tokens")
        build.piece_totals[piece.get("key", piece["name"])] += 1

    for label in tiles:
        pages.write_if_changed(OUT / "tiles" / f"{label}.webp", pages.webp(Image.open(art[label])))

    return {
        "tiles": tiles,
        "monsters": [
            {
                "name": monster,
                "token": token_files[monster],
                "standee": standees[monster],
                "counts": {
                    str(p): {
                        types.get(monster, kind): by_players[p][kind]
                        for kind in by_players[p]
                    }
                    for p in PLAYER_COUNTS
                },
            }
            for monster, by_players in book.items()
        ],
        "pieces": [
            {"name": piece, "token": thumbnails[piece], "count": count}
            for piece, count in listed.items()
        ],
        "map": {"file": file, "width": width, "height": height, "monsters": placements},
    }


def section_region(page: pymupdf.Page, spans: list[Span], section: str) -> pymupdf.Rect:
    """Returns the part of a page that holds a section, from its banner to the next one below."""
    banners = [
        d["rect"] for d in page.get_drawings()
        if d["fill"] and 20 < d["rect"].height < 25 and d["rect"].width > 100
        and all(abs(a - b) < 0.015 for a, b in zip(d["fill"], SECTION_BANNER))
    ]
    heading = next(s for s in spans if pages.is_panel_heading(s) and s.text.strip() == section)
    banner = next(b for b in banners if b.contains(centre(heading.rect)))
    below = [
        b.y0 for b in banners
        if b.y0 > banner.y0 and b.x0 < banner.x1 and b.x1 > banner.x0
    ]
    return pymupdf.Rect(banner.x0 - 2, banner.y1,
                        banner.x1 + 2, min(below) if below else pages.PAGE_BOTTOM + 8)


def read_section(build: Build, section: str) -> dict:
    pdf, index = sources.section_page(section)
    doc = pymupdf.open(pdf)
    page = doc[index]
    spans = pages.read_spans(page)
    region = section_region(page, spans, section)

    panels = [p for p in pages.read_panels(page, spans) if region.contains(centre(p.rect))]
    check_panels(panels, SECTION_PANELS, f"section {section}")
    ghs = sources.ghs_section(section)
    room = read_room(build, doc, pdf, index, page, region, spans,
                     ghs.get("rooms", []) if ghs else [], section)

    def in_panel(rect) -> bool:
        return any(p.rect.contains(centre(rect)) for p in panels)

    story = [
        s for s in spans
        if region.contains(centre(s.rect)) and pages.is_body_text(s) and not in_panel(s.rect)
    ]
    labels = {s.text.strip() for s in spans if pages.is_panel_heading(s)
              and region.contains(centre(s.rect))}

    return {
        "id": section,
        "isConclusion": "Conclusion" in labels,
        "story": pages.flow_text(story),
        "rules": panels_named(doc, page, panels, spans, "Special Rules"),
        "effects": panels_named(doc, page, panels, spans, "Scenario Effects"),
        "goals": panels_named(doc, page, panels, spans, "Scenario Goal", "Scenario Goals"),
        "links": panels_named(doc, page, panels, spans, "Section Links"),
        "rewards": panels_named(doc, page, panels, spans, "Rewards"),
        "room": room,
    }


def section_refs(value) -> list[str]:
    """Returns the sections a piece of output refers to, in reading order."""
    if isinstance(value, list):
        return [ref for item in value for ref in section_refs(item)]
    if isinstance(value, dict):
        if "section" in value:
            return [value["section"]]
        return [ref for key, item in value.items() if key != "room" for ref in section_refs(item)]
    return []


def paragraph_id(paragraph: list[dict]) -> str:
    """Identifies a paragraph by its content, so a decision about it survives rebuilds."""
    return hashlib.sha1(json.dumps(paragraph, sort_keys=True).encode()).hexdigest()[:12]


def hold_back(scenario: dict) -> list[tuple[str, str, str]]:
    """Moves each paragraph in the scenario's held-back file to the section it waits for.

    The book prints a scenario's goals, rules and links up front, even when
    they give away what a door hides. Which ones do is a judgment made for
    each scenario, recorded as a paragraph id and the section that reveals
    it. An id the book no longer has stops the build, so that a decision
    never lapses unseen.

    Returns what was moved, as (kind, from, to).
    """
    path = HELD_BACK / f"{scenario['number']}.json"
    waits = json.loads(path.read_text()) if path.exists() else {}
    sections = scenario["sections"]
    everything = {scenario["number"]: scenario, **sections}

    found = {}
    for key, source in everything.items():
        for kind in HELD_BACK_KINDS:
            for paragraph in source[kind]:
                held = paragraph_id(paragraph)
                if held in waits:
                    if held in found:
                        raise ValueError(f"{path.name}: paragraph {held} is printed more than once")
                    found[held] = key, kind, paragraph

    moved = []
    for held, target in waits.items():
        if held not in found:
            raise ValueError(f"{path.name}: the book has no {'/'.join(HELD_BACK_KINDS)} paragraph {held}")
        if target not in sections:
            raise ValueError(f"{path.name}: scenario {scenario['number']} has no section {target}")
        key, kind, paragraph = found[held]
        everything[key][kind].remove(paragraph)
        sections[target][kind].append(paragraph)
        moved.append((kind, key, target))
    return moved


def story_paragraphs(scenario: dict) -> dict[str, list[dict]]:
    """Returns every paragraph of the scenario's story text by id, in reading order."""
    paragraphs = {paragraph_id(p): p for p in scenario["intro"]}
    for section in scenario["sections"].values():
        paragraphs |= {paragraph_id(p): p for p in section["story"]}
    return paragraphs


def _marks(paragraph: list[dict]) -> list[dict]:
    return [segment for segment in paragraph if "text" not in segment]


def translate(scenario: dict) -> dict:
    """Returns the scenario's story text in each language it has been translated into.

    A translation maps each story paragraph's id to that paragraph in its
    language. It must cover every story paragraph and nothing else, and keep
    each paragraph's icons, doors, scenarios and sections in order, so that a
    change to the book stops the build instead of leaving the translation
    behind it.
    """
    originals = story_paragraphs(scenario)
    translations = {}
    for language in LANGUAGES:
        path = TRANSLATIONS / language / f"{scenario['number']}.json"
        if not path.exists():
            continue
        where = f"{language}/{path.name}"
        translated = json.loads(path.read_text())
        if missing := sorted(originals.keys() - translated.keys()):
            raise ValueError(f"{where}: no translation of paragraphs {', '.join(missing)}")
        if extra := sorted(translated.keys() - originals.keys()):
            raise ValueError(f"{where}: the book has no story paragraphs {', '.join(extra)}")
        for key, paragraph in translated.items():
            texts = [segment for segment in paragraph if "text" in segment]
            if not all(isinstance(s["text"], str) and set(s) <= {"text", "bold", "italic"} for s in texts):
                raise ValueError(f"{where}: paragraph {key} has a text segment the app can't show")
            if _marks(paragraph) != _marks(originals[key]):
                raise ValueError(f"{where}: paragraph {key} doesn't keep the book's icons, doors, "
                                 f"scenarios and sections in order")

        def story(paragraphs: list[list[dict]]) -> list[list[dict]]:
            return [translated[paragraph_id(p)] for p in paragraphs]

        translations[language] = {
            "intro": story(scenario["intro"]),
            "story": {key: story(section["story"]) for key, section in scenario["sections"].items()},
        }
    return translations


def list_story(scenario: dict) -> Path:
    """Writes every story paragraph of a built scenario by id, for translating."""
    STORY.mkdir(parents=True, exist_ok=True)
    path = STORY / f"{scenario['number']}.json"
    path.write_text(json.dumps(story_paragraphs(scenario), ensure_ascii=False, indent=2) + "\n")
    return path


def _readable(paragraph: list[dict]) -> str:
    marks = {"icon": "icon {}", "door": "door {}", "scenario": "scenario {}", "section": "section {}"}
    parts = []
    for segment in paragraph:
        mark = next((kind for kind in marks if kind in segment), None)
        parts.append(f"[{marks[mark].format(segment[mark])}]" if mark else segment["text"])
    return "".join(parts)


def list_paragraphs(scenario: dict) -> Path:
    """Writes every paragraph of a built scenario where it now stands, with its id, for review.

    Each room's monsters and pieces are listed too, since they are part of
    what the party has seen once the room is placed.
    """
    lines = []
    for key, source in {scenario["number"]: scenario, **scenario["sections"]}.items():
        lines.append(f"# {'Scenario' if key == scenario['number'] else 'Section'} {key}")
        for kind in ("intro", "story", *HELD_BACK_KINDS, "rewards"):
            if source.get(kind):
                lines.append(f"\n## {kind}\n")
                lines += [f"- {paragraph_id(p)}: {_readable(p)}" for p in source[kind]]
        if source.get("room"):
            room = source["room"]
            lines.append("\n## room\n")
            lines.append(f"- tiles: {', '.join(room['tiles'])}")
            lines.append(f"- monsters: {', '.join(m['name'] for m in room['monsters'])}")
            lines.append(f"- pieces: {', '.join(p['name'] for p in room['pieces'])}")
        lines.append("")
    PARAGRAPHS.mkdir(parents=True, exist_ok=True)
    path = PARAGRAPHS / f"{scenario['number']}.md"
    path.write_text("\n".join(lines))
    return path


def scenario_map_region(page: pymupdf.Page) -> pymupdf.Rect:
    """Returns the part of a scenario page that can hold its map: all of it below the banner's top."""
    return pymupdf.Rect(page.rect.x0, 80, page.rect.x1, page.rect.y1)


def build_scenario(number: str) -> dict:
    ghs = sources.ghs_scenario(number)
    build = Build()
    pdf, index = find_scenario_page(number)
    doc = pymupdf.open(pdf)
    page = doc[index]
    spans = pages.read_spans(page)
    panels = pages.read_panels(page, spans)

    title = next(s for s in spans if s.font.startswith("PirataOne") and s.rect.y0 < 80).text.strip()
    if title != ghs["name"]:
        raise ValueError(f"page is titled {title!r}, GHS says {ghs['name']!r}")
    location = next(s for s in spans if s.text.strip().startswith("•")).text.split("•")[1].strip()
    region_name, requirements = read_header(doc, page, spans, f"scenario {number}")
    name_requirements(build, requirements, ghs, f"scenario {number}")
    check_panels(panels, SCENARIO_PANELS, f"scenario {number}")

    # The introduction can run on into the next column, so it is told apart by
    # what it isn't: it is the page's only body text outside the header, the
    # panels and the Key.
    entries = key_entries(page)
    intro = pages.flow_text([
        s for s in spans
        if pages.is_body_text(s) and s.rect.y1 >= HEADER_BOTTOM
        and not any(p.rect.contains(centre(s.rect)) for p in panels)
        and not any(e.rect.contains(centre(s.rect)) for e in entries)
    ])

    key = read_key(page, spans)
    build.tile_labels = sorted({
        s.text.strip() for s in spans
        if pages.TILE_LABEL.fullmatch(s.text.strip()) and s.font.startswith("GermaniaOne")
    })

    ghs_rooms = [r for r in ghs.get("rooms", []) if r.get("initial")]
    room = read_room(build, doc, pdf, index, page, scenario_map_region(page), spans, ghs_rooms, number)

    scenario = {
        "number": number,
        "title": title,
        "location": location,
        "region": region_name,
        "requirements": requirements,
        "complexity": ghs.get("complexity"),
        "intro": intro,
        "goals": panels_named(doc, page, panels, spans, "Scenario Goals", "Scenario Goal"),
        "effects": panels_named(doc, page, panels, spans, "Scenario Effects"),
        "rules": panels_named(doc, page, panels, spans, "Special Rules"),
        "links": panels_named(doc, page, panels, spans, "Section Links"),
        "loot": read_loot(doc, page, spans, ghs["lootDeckConfig"]),
        "room": room,
    }

    sections: dict[str, dict] = {}
    queue = section_refs(scenario)
    while queue:
        section = queue.pop(0)
        if section not in sections:
            sections[section] = read_section(build, section)
            queue += section_refs(sections[section])
    scenario["sections"] = sections

    if build.unknown_tokens:
        listing = "\n".join(f"  {h}  {p}" for h, p in build.unknown_tokens.items())
        raise SystemExit(f"name these tokens in pieces.json:\n{listing}")
    if build.unknown_requirements:
        listing = "\n".join(f"  {p}" for p in build.unknown_requirements.values())
        raise SystemExit(f"copy each of these requirement icons into {REQUIREMENT_ICONS}, "
                         f"named after the requirement:\n{listing}")

    expected = {label: count for label, count in key.items() if count is not None}
    if dict(build.piece_totals) != expected:
        raise ValueError(f"pieces differ from the Scenario Key: "
                         f"maps {dict(build.piece_totals)}, key {expected}")

    for kind, source, target in hold_back(scenario):
        print(f"held back a {kind} paragraph from {source} until {target}")
    # Listed before the translations are checked, so a stale one can be brought up to date from it.
    print(f"story listed in {list_story(scenario)}")
    scenario["translations"] = translate(scenario)
    for language in scenario["translations"]:
        print(f"story translated into {language}")
    return scenario


def main() -> None:
    number = sys.argv[1]
    for directory in ("icons", "maps", "standees", "tiles", "tokens", "scenarios"):
        (OUT / directory).mkdir(parents=True, exist_ok=True)
    scenario = build_scenario(number)
    pages.write_if_changed(OUT / "scenarios" / f"{number}.json",
                           json.dumps(scenario, ensure_ascii=False).encode())
    print(f"paragraphs listed in {list_paragraphs(scenario)}")
    print(f"scenario {number}: {len(scenario['sections'])} sections, all checks passed")


if __name__ == "__main__":
    main()
