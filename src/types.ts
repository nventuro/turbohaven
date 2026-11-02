export interface Section {
  id: string;
  /** Title as plain text. */
  title: string;
  /** Title with its icons and links. */
  titleHtml: string;
  level: number;
  /** Printed page the section starts on. */
  page: number;
  /** Printed pages that start at this section's heading. */
  pageAnchors: number[];
  html: string;
  hasTreasureLookup: boolean;
  children: Section[];
}

/** A locked part of the rulebook the group opts into, such as a sticker. */
export interface Spoiler {
  id: string;
  /** Name that gives nothing away, such as "Sticker 4". */
  label: string;
  /** Short mark shown on the seal, such as "4". */
  seal: string;
  /** Sections holding this spoiler, outermost first. */
  sectionPath: string[];
}

export interface Rulebook {
  sections: Section[];
  spoilers: Spoiler[];
}

export interface SpoilerContent {
  id: string;
  title: string;
  html: string;
}

/** Treasure text by treasure number. */
export type Treasures = Record<string, string>;
