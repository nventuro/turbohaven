"""Reads the structure out of a Frosthaven book page.

The books are page-layout exports, so everything on a page is a typed object:
text with fonts, images with transforms, and vector paths. Each kind of game
content has a consistent encoding, which is what the readers here rely on.
"""

import hashlib
import re
from dataclasses import dataclass
from pathlib import Path

import pymupdf

SECTION_REF = re.compile(r"(\d{1,3}\.\d{1,2})([.,;:]?)")
TILE_LABEL = re.compile(r"\d{2}-[A-Z]")

# Line spacing of body text. A larger gap between lines is a paragraph break.
LEADING = 12.0
PAGE_BOTTOM = 756.0
# Narrower than the gutter between columns, wider than any gap around an inline icon.
COLUMN_GAP = 8.0


@dataclass(frozen=True)
class Span:
    text: str
    font: str
    size: float
    rect: pymupdf.Rect


@dataclass(frozen=True)
class Icon:
    """An inline symbol; `file` is the name it was saved under."""
    file: str
    rect: pymupdf.Rect


@dataclass(frozen=True)
class Panel:
    label: str
    rect: pymupdf.Rect


@dataclass(frozen=True)
class PlacedImage:
    xref: int
    smask: int
    rect: pymupdf.Rect
    width: int
    height: int


def centre(rect: pymupdf.Rect) -> pymupdf.Point:
    return pymupdf.Point((rect.x0 + rect.x1) / 2, (rect.y0 + rect.y1) / 2)


def read_spans(page: pymupdf.Page) -> list[Span]:
    spans = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                if span["text"].strip():
                    spans.append(
                        Span(span["text"], span["font"], span["size"], pymupdf.Rect(span["bbox"]))
                    )
    return spans


def read_images(page: pymupdf.Page) -> list[PlacedImage]:
    """Returns the images placed on a page, in paint order."""
    smasks = {image[0]: image[1] for image in page.get_images(full=True)}
    return [
        PlacedImage(info["xref"], smasks.get(info["xref"], 0), pymupdf.Rect(info["bbox"]),
                    info["width"], info["height"])
        for info in page.get_image_info(xrefs=True)
        if info["xref"]
    ]


def is_panel_heading(span: Span) -> bool:
    return span.font.startswith("GermaniaOne") and 11.5 < span.size < 12.5


def is_body_text(span: Span) -> bool:
    return span.font.startswith("Tinos") or is_inline_scenario(span) or is_inline_door(span)


def is_inline_door(span: Span) -> bool:
    return span.font.startswith("Type3") and span.size < 11


def is_inline_scenario(span: Span) -> bool:
    return span.font.startswith("GermaniaOne") and span.size < 8.75


def read_panels(page: pymupdf.Page, spans: list[Span]) -> list[Panel]:
    """Finds the framed text panels, named after the heading on top of each.

    Their frames are the only large paths with this cut-corner outline.
    """
    frames = {}
    for drawing in page.get_drawings():
        rect = drawing["rect"]
        if drawing["fill"] and len(drawing["items"]) == 8 and rect.width > 100 and rect.height > 15:
            frames[tuple(round(v) for v in rect)] = rect

    panels = []
    for rect in frames.values():
        headings = [
            s for s in spans
            if is_panel_heading(s)
            and abs(s.rect.y1 - rect.y0) < 8
            and rect.x0 - 8 < s.rect.x0 < rect.x1
        ]
        if headings:
            panels.append(Panel(headings[0].text.strip(), rect))
    return panels


def _svg_path(drawing: dict, origin: pymupdf.Point) -> str:
    def point(p) -> str:
        return f"{p.x - origin.x:.3f} {p.y - origin.y:.3f}"

    commands = []
    pen = None
    for item in drawing["items"]:
        kind = item[0]
        if kind == "re":
            rect = item[1]
            commands.append(
                f"M{point(rect.tl)}L{point(rect.tr)}L{point(rect.br)}L{point(rect.bl)}Z"
            )
            pen = None
        elif kind == "qu":
            quad = item[1]
            commands.append(
                f"M{point(quad.ul)}L{point(quad.ur)}L{point(quad.lr)}L{point(quad.ll)}Z"
            )
            pen = None
        else:
            start = item[1]
            if pen is None or abs(pen.x - start.x) + abs(pen.y - start.y) > 1e-3:
                commands.append(f"M{point(start)}")
            if kind == "l":
                commands.append(f"L{point(item[2])}")
                pen = item[2]
            elif kind == "c":
                commands.append(f"C{point(item[2])} {point(item[3])} {point(item[4])}")
                pen = item[4]
    if drawing.get("closePath"):
        commands.append("Z")
    return "".join(commands)


def _rgb(colour) -> str:
    return "#" + "".join(f"{round(c * 255):02x}" for c in colour)


def _svg_of(drawings: list[dict], rect: pymupdf.Rect) -> str:
    paths = []
    for drawing in sorted(drawings, key=lambda d: d["seqno"]):
        attributes = [f'd="{_svg_path(drawing, rect.tl)}"']
        fill = drawing.get("fill")
        attributes.append(f'fill="{_rgb(fill)}"' if fill else 'fill="none"')
        if drawing.get("even_odd"):
            attributes.append('fill-rule="evenodd"')
        if drawing.get("fill_opacity") not in (None, 1):
            attributes.append(f'fill-opacity="{drawing["fill_opacity"]:.3f}"')
        stroke = drawing.get("color")
        if stroke and "s" in drawing["type"]:
            attributes.append(f'stroke="{_rgb(stroke)}" stroke-width="{drawing["width"] or 1:.3f}"')
        paths.append(f"<path {' '.join(attributes)}/>")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {rect.width:.3f} {rect.height:.3f}">{"".join(paths)}</svg>'
    )


def image_with_alpha(doc: pymupdf.Document, image: PlacedImage) -> pymupdf.Pixmap:
    """Returns a placed image as RGB, applying its transparency mask if it has one."""
    pixmap = pymupdf.Pixmap(doc, image.xref)
    if pixmap.alpha:
        pixmap = pymupdf.Pixmap(pixmap, 0)
    if pixmap.colorspace.n != 3:
        pixmap = pymupdf.Pixmap(pymupdf.csRGB, pixmap)
    if image.smask:
        pixmap = pymupdf.Pixmap(pixmap, pymupdf.Pixmap(doc, image.smask))
    return pixmap


def read_icons(doc: pymupdf.Document, page: pymupdf.Page, region: pymupdf.Rect,
               spans: list[Span], out_dir: Path) -> list[Icon]:
    """Saves the symbols set inline in a block of text and returns where they sit.

    The small book glyph that introduces every section reference and the disc
    behind every scenario number are left out, since those references are
    rendered from their text.
    """
    small = []
    for drawing in page.get_drawings():
        rect = drawing["rect"]
        if region.contains(rect) and max(rect.width, rect.height) <= 15:
            small.append(drawing)

    clusters: list[tuple[pymupdf.Rect, list[dict]]] = []
    for drawing in small:
        rect = pymupdf.Rect(drawing["rect"])
        merged = [drawing]
        remaining = []
        for cluster_rect, members in clusters:
            if (rect + (-0.5, -0.5, 0.5, 0.5)).intersects(cluster_rect):
                rect |= cluster_rect
                merged += members
            else:
                remaining.append((cluster_rect, members))
        clusters = remaining + [(rect, merged)]

    references = [
        s for s in spans if region.contains(centre(s.rect)) and SECTION_REF.fullmatch(s.text.strip())
    ]
    scenarios = [s for s in spans if is_inline_scenario(s)]

    icons = []
    for rect, members in clusters:
        if rect.width < 5 or rect.height < 5:
            continue
        if any(0 <= s.rect.x0 - rect.x1 < 6 and abs(centre(s.rect).y - centre(rect).y) < 6
               for s in references):
            continue
        svg = _svg_of(members, rect)
        file = hashlib.sha1(svg.encode()).hexdigest()[:12] + ".svg"
        write_if_changed(out_dir / file, svg.encode())
        icons.append(Icon(file, rect))

    for image in read_images(page):
        rect = image.rect
        if not (region.contains(centre(rect)) and 5 < rect.width <= 20 and 5 < rect.height <= 20):
            continue
        if any(s.rect.intersects(rect) for s in scenarios):
            continue
        pixmap = image_with_alpha(doc, image)
        file = hashlib.sha1(pixmap.samples).hexdigest()[:12] + ".png"
        write_if_changed(out_dir / file, pixmap.tobytes("png"))
        icons.append(Icon(file, rect))
    return icons


def write_if_changed(path: Path, data: bytes) -> None:
    """Writes a file in place, and only if its content changed.

    A running dev server stops serving a file it sees deleted, which saving a
    pixmap does before writing it again.
    """
    if not path.exists() or path.read_bytes() != data:
        path.write_bytes(data)


def _segment(item: Span | Icon) -> list[dict]:
    if isinstance(item, Icon):
        return [{"icon": item.file}]
    text = item.text
    if is_inline_door(item):
        return [{"door": text.strip()}]
    if is_inline_scenario(item):
        return [{"scenario": text.strip()}]
    reference = SECTION_REF.fullmatch(text.strip())
    if "Bold" in item.font and reference:
        segments = [{"section": reference[1]}]
        return segments + ([{"text": reference[2]}] if reference[2] else [])
    segment = {"text": text.replace("\t", " ")}
    if "Bold" in item.font:
        segment["bold"] = True
    if "Italic" in item.font:
        segment["italic"] = True
    return [segment]


def _append(paragraph: list[dict], segment: dict) -> None:
    if paragraph and "text" in paragraph[-1] and "text" in segment:
        last = paragraph[-1]
        same_style = (
            last.get("bold") == segment.get("bold") and last.get("italic") == segment.get("italic")
        )
        if same_style or not segment["text"].strip():
            last["text"] += segment["text"]
            return
    # The book leaves the space beside an icon to the icon's own margin.
    if paragraph and "text" in segment and "icon" in paragraph[-1]:
        if segment["text"][:1].isalnum():
            segment = {**segment, "text": " " + segment["text"]}
    if paragraph and "icon" in segment and "text" in paragraph[-1]:
        if paragraph[-1]["text"][-1:].isalnum():
            paragraph[-1]["text"] += " "
    paragraph.append(dict(segment))


def _tidy(paragraph: list[dict]) -> list[dict]:
    for segment in paragraph:
        if "text" in segment:
            segment["text"] = re.sub(r"\s+", " ", segment["text"])
    if paragraph and "text" in paragraph[0]:
        paragraph[0]["text"] = paragraph[0]["text"].lstrip()
    if paragraph and "text" in paragraph[-1]:
        paragraph[-1]["text"] = paragraph[-1]["text"].rstrip()
    return [s for s in paragraph if s.get("text") != ""]


def _ends_sentence(paragraph: list[dict]) -> bool:
    text = next((s["text"] for s in reversed(paragraph) if s.get("text", "").strip()), "")
    return text.rstrip()[-1:] in ".!?”\"…"


def flow_text(items: list[Span | Icon]) -> list[list[dict]]:
    """Turns positioned text into paragraphs of segments, following its columns.

    A paragraph can run from the bottom of one column into the top of the next,
    which is only visible from the sentence being unfinished.
    """
    rows: list[list[Span | Icon]] = []
    for item in sorted(items, key=lambda i: centre(i.rect).y):
        for row in rows:
            if abs(centre(row[0].rect).y - centre(item.rect).y) < 5:
                row.append(item)
                break
        else:
            rows.append([item])

    fragments: list[list[Span | Icon]] = []
    for row in rows:
        row.sort(key=lambda i: i.rect.x0)
        current = [row[0]]
        for item in row[1:]:
            if item.rect.x0 - current[-1].rect.x1 > COLUMN_GAP:
                fragments.append(current)
                current = []
            current.append(item)
        fragments.append(current)

    columns: list[list[list[Span | Icon]]] = []
    for fragment in sorted(fragments, key=lambda f: f[0].rect.x0):
        for column in columns:
            if abs(column[0][0].rect.x0 - fragment[0].rect.x0) < 10:
                column.append(fragment)
                break
        else:
            columns.append([fragment])

    paragraphs: list[list[dict]] = []
    for index, column in enumerate(columns):
        column.sort(key=lambda f: centre(f[0].rect).y)
        previous_y = None
        for fragment in column:
            y = centre(fragment[0].rect).y
            starts_column = previous_y is None
            new_paragraph = (
                (starts_column and (index == 0 or _ends_sentence(paragraphs[-1])))
                or (not starts_column and y - previous_y > LEADING * 1.5)
            )
            if new_paragraph:
                paragraphs.append([])
            elif paragraphs[-1]:
                _append(paragraphs[-1], {"text": " "})
            previous_y = y
            for item in fragment:
                for segment in _segment(item):
                    _append(paragraphs[-1], segment)

    return [tidied for tidied in map(_tidy, paragraphs) if tidied]


def image_hash(doc: pymupdf.Document, image: PlacedImage) -> str:
    """Identifies an image's content, which stays the same across the book's volumes."""
    pixmap = pymupdf.Pixmap(doc, image.xref)
    digest = hashlib.sha1(f"{pixmap.width}x{pixmap.height}".encode())
    digest.update(pixmap.samples)
    return digest.hexdigest()[:16]
