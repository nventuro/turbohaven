#!/usr/bin/env python3
"""Renders the printed pages of a built scenario, to compare with its data: `python render.py 7 <folder>`.

Saves the scenario page, and each section it leads to cut down to its own part
of its page, since a section page also prints sections of other scenarios.
Each map is saved again larger, so its markers can be told apart.
"""

import json
import sys
from pathlib import Path

import pymupdf

import build
import maps
import pages
import sources

READING_DPI = 150
MAP_DPI = 300


def render(doc: pymupdf.Document, page: pymupdf.Page, region: pymupdf.Rect, map_region: pymupdf.Rect,
           name: str, out: Path) -> None:
    page.get_pixmap(dpi=READING_DPI, clip=region).save(out / f"{name}.png")
    printed = maps.read_map(doc, page, map_region, pages.read_spans(page))
    if printed:
        page.get_pixmap(dpi=MAP_DPI, clip=printed.rect).save(out / f"{name}-map.png")


def main() -> None:
    number, out = sys.argv[1], Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)

    pdf, index = build.find_scenario_page(number)
    doc = pymupdf.open(pdf)
    page = doc[index]
    render(doc, page, page.rect, build.scenario_map_region(page), number, out)

    # Which sections a scenario leads to is only known once it has built.
    built = build.OUT / "scenarios" / f"{number}.json"
    if not built.exists():
        print(f"scenario {number} isn't built yet, so only its page is in {out}")
        return
    for section in json.loads(built.read_text())["sections"]:
        pdf, index = sources.section_page(section)
        doc = pymupdf.open(pdf)
        page = doc[index]
        region = build.section_region(page, pages.read_spans(page), section)
        render(doc, page, region, region, section, out)
    print(f"scenario {number}'s pages are in {out}")


if __name__ == "__main__":
    main()
