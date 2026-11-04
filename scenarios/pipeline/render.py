#!/usr/bin/env python3
"""Renders the printed pages of a built scenario, to compare with its data: `python render.py 7 <folder>`.

Saves the scenario page, and each section it leads to cut down to its own part
of its page, since a section page also prints sections of other scenarios.
Each map is saved again larger, so its markers can be told apart. Works on a
scenario whose build stops, so that the pages can show why.
"""

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


def references(spans: list[pages.Span], region: pymupdf.Rect) -> list[str]:
    """Returns the sections a part of a page sends the reader to.

    Read from the text alone rather than from the built scenario, since the
    build can stop before it has read every section.
    """
    found = []
    for span in spans:
        reference = pages.SECTION_REF.fullmatch(span.text.strip())
        if reference and "Bold" in span.font and region.contains(pages.centre(span.rect)):
            found.append(reference[1])
    return found


def main() -> None:
    number, out = sys.argv[1], Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)

    pdf, index = build.find_scenario_page(number)
    doc = pymupdf.open(pdf)
    page = doc[index]
    render(doc, page, page.rect, build.scenario_map_region(page), number, out)

    sections, queue = [], references(pages.read_spans(page), page.rect)
    while queue:
        section = queue.pop(0)
        if section in sections:
            continue
        sections.append(section)
        pdf, index = sources.section_page(section)
        doc = pymupdf.open(pdf)
        page = doc[index]
        spans = pages.read_spans(page)
        region = build.section_region(page, spans, section)
        render(doc, page, region, region, section, out)
        queue += references(spans, region)
    print(f"scenario {number}'s pages are in {out}")


if __name__ == "__main__":
    main()
