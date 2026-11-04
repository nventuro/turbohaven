"""Cached access to the Frosthaven books, tile art and game data."""

import json
import re
import urllib.error
import urllib.request
from pathlib import Path

CACHE = Path(__file__).parent / ".cache"

# Pinned so that rebuilding a scenario cannot change it behind our back.
WORLDHAVEN = (
    "https://raw.githubusercontent.com/any2cards/worldhaven/"
    "ad2738b72a030a136294dddcba7f0cc76e910903"
)
GHS = (
    "https://raw.githubusercontent.com/Lurkars/gloomhavensecretariat/"
    "ff48a9948b0fd19f56e60816b13142074d1d9704/data/fh"
)

SCENARIO_BOOK_RANGES = [
    (2, 21), (22, 41), (42, 61), (62, 81), (82, 101), (102, 121), (122, 141), (142, 166),
]
SECTION_BOOK_RANGES = [
    (2, 21), (22, 41), (42, 61), (62, 81), (82, 101),
    (102, 121), (122, 141), (142, 161), (162, 181), (182, 197),
]


def fetch(url: str, name: str) -> Path:
    """Returns the local copy of a URL, downloading it the first time."""
    path = CACHE / name
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(url, timeout=120) as response:
            path.write_bytes(response.read())
    return path


def _book(kind: str, start: int, end: int) -> Path:
    name = f"fh-{kind}-book-{start}-{end}.pdf"
    return fetch(f"{WORLDHAVEN}/images/books/frosthaven/{name}", f"books/{name}")


def scenario_books() -> list[Path]:
    return [_book("scenario", *r) for r in SCENARIO_BOOK_RANGES]


def section_page(section: str) -> tuple[Path, int]:
    """Returns the PDF and page index holding a section.

    Sections are numbered after the printed page they appear on.
    """
    printed = int(section.split(".")[0])
    for start, end in SECTION_BOOK_RANGES:
        if start <= printed <= end:
            # The first volume keeps the book's cover as an extra leading page.
            return _book("section", start, end), printed - start + (1 if start == 2 else 0)
    raise ValueError(f"no section book holds page {printed}")


def ghs_json(path: str) -> dict:
    return json.loads(fetch(f"{GHS}/{path}", f"ghs/{path}").read_text())


def ghs_scenario(number: str) -> dict:
    match = re.fullmatch(r"(\d+)([A-Z]?)", number)
    return ghs_json(f"scenarios/{int(match[1]):03d}{match[2]}.json")


def ghs_section(section: str) -> dict | None:
    """Returns GHS's data for a section; it leaves out sections with no game state."""
    page, entry = section.split(".")
    try:
        return ghs_json(f"sections/{int(page):03d}-{entry}.json")
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise


def tile_image(label: str) -> Path:
    """Returns Worldhaven's art for a tile labelled like `06-A`."""
    listing = fetch(f"{WORLDHAVEN}/data/map-tiles.js", "worldhaven/map-tiles.js").read_text()
    stem = f"fh-{label[:2]}{label[3].lower()}-"
    found = re.search(rf"map-tiles/frosthaven/({re.escape(stem)}[a-z]+\.png)", listing)
    if not found:
        raise ValueError(f"Worldhaven has no art for tile {label}")
    name = found[1]
    return fetch(f"{WORLDHAVEN}/images/map-tiles/frosthaven/{name}", f"tiles/{name}")


def standee_image(slug: str) -> Path | None:
    """Returns Worldhaven's art for a monster's standee, or None if it has none."""
    name = f"fh-{slug}-standee.png"
    try:
        return fetch(f"{WORLDHAVEN}/images/art/frosthaven/monsters/standees/{name}",
                     f"standees/{name}")
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise
