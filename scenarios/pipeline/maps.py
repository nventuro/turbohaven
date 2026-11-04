"""Reads the scenario maps printed in the books."""

import hashlib
import io
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw

from pages import (Panel, PlacedImage, Span, centre, image_hash, image_with_alpha, read_images,
                   write_if_changed)

# The soft blue glow painted behind every real tile. Faded previews of a
# neighbouring tile do not have one.
TILE_GLOW = (0.11, 0.34, 0.48)

RENDER_DPI = 300
MIN_TILE_PIXELS = 150


@dataclass
class Token:
    """A game piece printed on a map."""
    image: PlacedImage
    hash: str
    # What the piece is at 2, 3 and 4 characters, for monsters only.
    presence: list[str | None] | None = None
    # Where a monster's player-count markers sit on the token.
    strip: pymupdf.Rect | None = None
    # Printed on door tokens.
    door: str | None = None


@dataclass
class PrintedMap:
    rect: pymupdf.Rect
    tiles: list[PlacedImage]
    tokens: list[Token]
    # Images that only exist to be left out of the rendered map.
    hidden: list[PlacedImage]


def _is_glow(drawing: dict) -> bool:
    fill = drawing["fill"]
    return bool(fill) and drawing["type"] == "f" and drawing["rect"].width > 80 and all(
        abs(a - b) < 0.015 for a, b in zip(fill, TILE_GLOW)
    )


def _marker_state(doc: pymupdf.Document, image: PlacedImage) -> str | None:
    pixmap = pymupdf.Pixmap(doc, image.xref)
    if pixmap.colorspace.n != 3:
        pixmap = pymupdf.Pixmap(pymupdf.csRGB, pixmap)
    pixels = np.frombuffer(pixmap.samples, np.uint8).reshape(pixmap.height, pixmap.width, -1)[..., :3]
    red, green, blue = pixels.reshape(-1, 3).mean(0)
    if red - blue > 50:
        return "elite"
    return "normal" if (red + green + blue) / 3 > 170 else None


def read_map(doc: pymupdf.Document, page: pymupdf.Page, region: pymupdf.Rect,
             spans: list[Span]) -> PrintedMap | None:
    """Returns the map printed inside a region of a page, if it has one."""
    glows = [
        d["rect"] for d in page.get_drawings()
        if _is_glow(d) and region.contains(centre(d["rect"]))
    ]
    if not glows:
        return None
    area = pymupdf.Rect(glows[0])
    for glow in glows[1:]:
        area |= glow

    images = [
        i for i in read_images(page)
        if i.rect.intersects(area) and i.rect.width < page.rect.width
    ]
    # A tile rotated off the page axes overflows its glow; an upright one sits inside it.
    tiles = [
        i for i in images
        if i.width >= MIN_TILE_PIXELS and i.height >= MIN_TILE_PIXELS
        and any(
            pymupdf.Rect(g + (-3, -3, 3, 3)).contains(i.rect)
            or pymupdf.Rect(i.rect + (-3, -3, 3, 3)).contains(g)
            for g in glows
        )
    ]

    tokens, markers = [], []
    for image in images:
        if image in tiles:
            continue
        width, height = image.rect.width, image.rect.height
        if 6 < width < 7.5 and 8 < height < 10:
            markers.append(image)
        elif height > 30 and height < 90 and width > 30 and image.width < MIN_TILE_PIXELS * 2:
            if area.contains(centre(image.rect)):
                tokens.append(Token(image, image_hash(doc, image)))

    for token in tokens:
        # Neighbouring hexes overlap, so a token's bounds can also take in the
        # markers of the token next to it. Its own always hug its left edge.
        stack = sorted(
            (
                m for m in markers
                if token.image.rect.contains(centre(m.rect))
                and 0 <= m.rect.x0 - token.image.rect.x0 < 7
            ),
            key=lambda m: m.rect.y0,
        )
        if stack:
            if len(stack) != 3:
                raise ValueError(f"token at {token.image.rect} has {len(stack)} player-count markers")
            token.presence = [_marker_state(doc, m) for m in stack]
            token.strip = stack[0].rect | stack[1].rect | stack[2].rect
        doors = [
            s for s in spans
            if s.font.startswith("Type3") and s.size > 12
            and token.image.rect.contains(centre(s.rect))
        ]
        if doors:
            token.door = doors[0].text.strip()

    # Previews of the neighbouring tile would hint at what lies beyond a door.
    # The page can cut a preview down to a strip narrower than a tile on one side.
    pieces = [t.image for t in tokens]
    previews = [
        i for i in images
        if i not in tiles and i not in pieces
        and (i.width >= MIN_TILE_PIXELS or i.height >= MIN_TILE_PIXELS)
    ]
    hidden = markers + previews + [t.image for t in tokens if t.presence]

    rect = pymupdf.Rect(area)
    for token in tokens:
        rect |= token.image.rect
    # A map's glow can reach under the heading of the section it belongs to.
    return PrintedMap(rect & region, tiles, tokens, hidden)


def render_map(pdf: Path, page_index: int, printed: PrintedMap, spans: list[Span],
               panels: list[Panel], out: Path) -> tuple[int, int]:
    """Saves a map on a transparent background, without its monsters.

    Monsters depend on the player count, so they are placed on top of this later.
    Text panels can sit over a map's soft edge, and are cut out of the result.
    Works on a throwaway copy of the document, since blanking images is global.
    """
    doc = pymupdf.open(pdf)
    page = doc[page_index]

    for image in read_images(page):
        if image.rect.width > 700 or image in printed.hidden:
            page.delete_image(image.xref)

    keep = [t.image.rect for t in printed.tokens]
    for span in spans:
        if span.rect.intersects(printed.rect) and not any(r.contains(centre(span.rect)) for r in keep):
            page.add_redact_annot(span.rect, fill=False)
    page.apply_redactions(
        images=pymupdf.PDF_REDACT_IMAGE_NONE,
        graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
        text=pymupdf.PDF_REDACT_TEXT_REMOVE,
    )

    pixmap = page.get_pixmap(dpi=RENDER_DPI, clip=printed.rect, alpha=True)
    image = Image.frombytes("RGBA", (pixmap.width, pixmap.height), pixmap.samples)
    scale = RENDER_DPI / 72
    for panel in panels:
        frame = panel.rect + (-4, -20, 4, 4)
        if frame.intersects(printed.rect):
            box = [(frame.x0 - printed.rect.x0) * scale, (frame.y0 - printed.rect.y0) * scale,
                   (frame.x1 - printed.rect.x0) * scale, (frame.y1 - printed.rect.y0) * scale]
            ImageDraw.Draw(image).rectangle(box, fill=(0, 0, 0, 0))
    png = io.BytesIO()
    image.save(png, "PNG")
    write_if_changed(out, png.getvalue())
    return pixmap.width, pixmap.height


def _comparable(image: Image.Image, size: int = 64) -> tuple[np.ndarray, np.ndarray]:
    image = image.convert("RGBA")
    box = image.getchannel("A").point(lambda a: 255 if a > 200 else 0).getbbox()
    pixels = np.asarray(image.crop(box).resize((size, size)), float)
    return pixels[..., :3].mean(2), pixels[..., 3] > 200


def _similarity(a: tuple[np.ndarray, np.ndarray], b: tuple[np.ndarray, np.ndarray]) -> float:
    mask = a[1] & b[1]
    if mask.sum() < 400:
        return -1.0
    x = a[0][mask] - a[0][mask].mean()
    y = b[0][mask] - b[0][mask].mean()
    return float((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-9))


def identify_tile(doc: pymupdf.Document, tile: PlacedImage, art: dict[str, Path]) -> str:
    """Works out which of the scenario's tiles a placed tile image shows.

    The book only prints a tile's name as part of its artwork, so it is told
    apart from the others by comparing that artwork, at any hex-grid rotation.
    """
    pixmap = image_with_alpha(doc, tile)
    mode = "RGBA" if pixmap.alpha else "RGB"
    placed = _comparable(Image.frombytes(mode, (pixmap.width, pixmap.height), pixmap.samples))

    scores = {}
    for label, path in art.items():
        source = Image.open(path).convert("RGBA")
        scores[label] = max(
            _similarity(placed, _comparable(source.rotate(angle, expand=True)))
            for angle in range(0, 360, 30)
        )
    ranked = sorted(scores, key=scores.get, reverse=True)
    best, runner_up = ranked[0], ranked[1] if len(ranked) > 1 else None
    if runner_up and scores[best] - scores[runner_up] < 0.08:
        raise ValueError(f"cannot tell tile apart: {scores}")
    return best


def save_token(doc: pymupdf.Document, token: Token, out_dir: Path) -> str:
    pixmap = image_with_alpha(doc, token.image)
    file = hashlib.sha1(token.hash.encode()).hexdigest()[:12] + ".png"
    write_if_changed(out_dir / file, pixmap.tobytes("png"))
    return file
