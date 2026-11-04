// The books write hit points and similar values as sums like "(L+2)xC". An
// operand is a number or a single capital standing for a value, in any brackets.
const OPERAND = String.raw`\(*(?:\d+|[A-Z])`;
// "x" means times. A space before it is only written after a bracket, as in
// "(L+3) xC"; otherwise "C x11" is a count in a list.
const SIGN = String.raw`(?:\)*\s?[×+−–-]\s?|\)*x\s?|\)+\s?x\s?)`;
const FORMULA = new RegExp(`${OPERAND}(?:${SIGN}${OPERAND})+\\)*`, 'g');
// Tiles are labelled like "11-C", which reads like a sum.
const TILE = /^\d+-[A-Z]$/;

/** The letters the rulebook defines for formulas, in the order it explains them. */
export const FORMULA_LETTERS = ['C', 'L', 'H'] as const;
export type FormulaLetter = (typeof FORMULA_LETTERS)[number];

/**
 * Returns which of the rulebook's formula letters some text uses. Letters a
 * scenario defines for itself are left to its own text.
 */
export function formulaLetters(text: string): FormulaLetter[] {
  const used = new Set<string>();
  for (const match of text.matchAll(FORMULA)) {
    const before = text[match.index - 1] ?? '';
    const after = text[match.index + match[0].length] ?? '';
    if (/[A-Za-z’']/.test(before + after) || TILE.test(match[0])) continue;
    for (const letter of match[0].match(/[A-Z]/g) ?? []) used.add(letter);
  }
  return FORMULA_LETTERS.filter((letter) => used.has(letter));
}
