"""Reads the official Frosthaven FAQ, for the entries that bear on a scenario."""

import hashlib
import html
import json
import re
from dataclasses import dataclass

import sources


@dataclass
class Entry:
    """One answer or erratum in the FAQ."""
    # The FAQ's headings it sits under, which tell an erratum from a clarification.
    source: str
    paragraphs: list[list[dict]]
    # The entry as the FAQ writes it, which still tells its links apart from its text.
    markup: str

    @property
    def text(self) -> str:
        return "\n".join("".join(s["text"] for s in p) for p in self.paragraphs)

    @property
    def id(self) -> str:
        """Identifies an entry by its content, so a decision about it lapses when the FAQ rewords it."""
        content = json.dumps([self.source, self.paragraphs], sort_keys=True)
        return hashlib.sha1(content.encode()).hexdigest()[:12]


# The FAQ numbers its own parts like sections, and links to them by those numbers.
FAQ_LINK = re.compile(r'<a href="#[^"]*">.*?</a>')
SECTION = re.compile(r"(?<![\d.])(\d{1,3}\.\d{1,2})(?!\d)")
NUMBER = r"\d+(?!\d|\.\d)"
# A run of scenario numbers after the word, as in "Scenarios 25 and 26", "Scenario 36/37"
# or "Scenario 17 (needs 5 pressure plates), Scenario 45 (...), 52 (...)".
SCENARIO_RUN = re.compile(
    rf"\bscenarios?\s+{NUMBER}(?:(?:\s*\([^)]*\))?\s*(?:,\s*(?:and\b|or\b|&)?|\band\b|\bor\b|&|/)\s*"
    rf"(?:scenarios?\s+)?{NUMBER})*",
    re.IGNORECASE,
)


def _segments(markup: str) -> list[dict]:
    """Turns a line of the FAQ's Markdown and HTML into text segments, keeping bold and italic."""
    markup = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", markup)
    markup = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", markup)
    segments: list[dict] = []
    bold = italic = False
    for token in re.split(r"(\*\*|\*|<[^>]+>)", markup):
        if token == "**":
            bold = not bold
        elif token == "*":
            italic = not italic
        elif re.fullmatch(r"</?(b|strong)>", token):
            bold = not token.startswith("</")
        elif re.fullmatch(r"</?(i|em)>", token):
            italic = not token.startswith("</")
        elif token.startswith("<") and token.endswith(">"):
            continue
        elif token:
            style = {key: True for key, on in (("bold", bold), ("italic", italic)) if on}
            if segments and {k: v for k, v in segments[-1].items() if k != "text"} == style:
                segments[-1]["text"] += html.unescape(token)
            else:
                segments.append({"text": html.unescape(token), **style})
    for segment in segments:
        segment["text"] = re.sub(r"\s+", " ", segment["text"])
    if segments:
        segments[0]["text"] = segments[0]["text"].lstrip()
        segments[-1]["text"] = segments[-1]["text"].rstrip()
    return [s for s in segments if s["text"]]


def _heading(markup: str) -> tuple[bool, str]:
    """Returns whether a heading is numbered, and its title without the number."""
    title = "".join(s["text"] for s in _segments(markup.lstrip("#"))).strip()
    number = re.match(r"\d+(\.\d+)*\s+", title)
    return bool(number), title[number.end():] if number else title


def entries() -> list[Entry]:
    """Returns every entry in the FAQ, in its order."""
    chapter = topic = summary = ""
    block: list[str] = []
    found: list[Entry] = []

    def close() -> None:
        paragraphs = [p for p in map(_segments, block) if p]
        if paragraphs and chapter != "Table of Contents":
            source = " · ".join(part for part in (chapter, topic, summary) if part)
            found.append(Entry(source, paragraphs, "\n".join(block)))
        block.clear()

    in_script = False
    for line in sources.faq().read_text().split("\n"):
        stripped = line.strip()
        if stripped.startswith("<script"):
            in_script = True
        if in_script:
            in_script = not stripped.startswith("</script")
            continue
        if line.startswith(("## ", "### ")) or stripped.startswith(("<h4", "<summary")):
            close()
            numbered, title = _heading(stripped)
            if line.startswith("## "):
                chapter, topic, summary = title, "", ""
            elif line.startswith("### ") and numbered:
                # A numbered heading is a part of the FAQ of its own; an unnumbered one, such as
                # a monster's name, is a topic within the part above it.
                chapter, topic, summary = title, "", ""
            elif stripped.startswith("<summary"):
                summary = title
            else:
                topic, summary = title, ""
        elif stripped.startswith("</details"):
            close()
            summary = ""
        elif not stripped or stripped.startswith(("<details", "<br", "<link", "![", "[![")):
            close()
        elif stripped.startswith("<p"):
            # Each paragraph in a spoiler box is an answer of its own.
            close()
            block.append(stripped)
            close()
        elif re.match(r"(- |\d+\. )", line):
            close()
            block.append(re.sub(r"^(- |\d+\. )", "", line))
        elif re.match(r"\s+([-*] |\d+\. )", line):
            # A nested list item is a line of the item above it.
            block.append(re.sub(r"^\s+([-*] |\d+\. )", "", line))
        elif block:
            block[-1] += " " + stripped
        else:
            block.append(stripped)
    close()
    return found


def references(entry: Entry) -> tuple[set[str], set[str]]:
    """Returns the scenario numbers and the section numbers an entry names."""
    text = entry.source + "\n" + entry.text
    scenarios = set()
    for run in SCENARIO_RUN.finditer(text):
        scenarios |= set(re.findall(NUMBER, re.sub(r"\([^)]*\)", "", run[0])))
    plain = "".join(s["text"] for s in _segments(FAQ_LINK.sub("", entry.markup)))
    return scenarios, set(SECTION.findall(plain))


def names_monster(entry: Entry, monster: str) -> bool:
    """Whether an entry, or a heading it sits under, names a monster, in the singular or plural."""
    pattern = rf"\b{re.escape(monster)}(e?s)?\b"
    return re.search(pattern, entry.source + "\n" + entry.text, re.IGNORECASE) is not None
