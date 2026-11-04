export type Segment =
  | { text: string; bold?: boolean; italic?: boolean }
  | { icon: string }
  | { door: string }
  | { scenario: string }
  | { section: string };

export type Paragraph = Segment[];

/** A language the story can be read in. Everything else is in English, as the game is. */
export type Language = 'en' | 'es-AR';

/** A scenario's story text in another language. */
export interface Translation {
  intro: Paragraph[];
  /** Each section's story, by section id. */
  story: Record<string, Paragraph[]>;
}

export type MonsterType = 'normal' | 'elite' | 'boss' | 'named';

/** A rectangle as fractions of whatever contains it. */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Placement extends Box {
  monster: string;
  token: string;
  /** Where the token shows whether the monster is normal or elite. */
  strip: Box;
  /** What this monster is at 2, 3 and 4 characters; null when it is left out. */
  presence: (MonsterType | null)[];
}

export interface RoomMap {
  file: string;
  width: number;
  height: number;
  monsters: Placement[];
}

export interface Monster {
  name: string;
  token: string;
  /** Art of the monster's standee, which is what players look for in the box. */
  standee: string | null;
  counts: Record<string, Partial<Record<MonsterType, number>>>;
}

export interface Piece {
  name: string;
  token: string;
  count: number;
}

export interface Room {
  tiles: string[];
  monsters: Monster[];
  pieces: Piece[];
  map: RoomMap;
}

export interface LootCard {
  name: string;
  count: number;
  icon: string | null;
}

export interface Section {
  id: string;
  isConclusion: boolean;
  story: Paragraph[];
  rules: Paragraph[];
  effects: Paragraph[];
  goals: Paragraph[];
  links: Paragraph[];
  rewards: Paragraph[];
  room: Room | null;
}

/** Something the party needs before it can play a scenario. */
export interface Requirement {
  name: string;
  icon: string | null;
}

export interface Scenario {
  number: string;
  title: string;
  location: string;
  /** The region of the world map the book names for the scenario, if any. */
  region: string | null;
  requirements: Requirement[];
  complexity: number;
  intro: Paragraph[];
  goals: Paragraph[];
  effects: Paragraph[];
  rules: Paragraph[];
  links: Paragraph[];
  loot: LootCard[];
  room: Room;
  sections: Record<string, Section>;
  /** The story text in each language it has been translated into. */
  translations: Partial<Record<Language, Translation>>;
}

export type PlayerCount = 2 | 3 | 4;

/** A scenario in progress. */
export interface Run {
  number: string;
  players: PlayerCount;
  setupStep: number;
  /** Whether the party has finished setting up. */
  started: boolean;
  playing: boolean;
  /** Sections read so far, oldest first. */
  read: string[];
  /** The section on screen. */
  open: string | null;
  /** How far through the open section the party is. */
  sectionStep: number;
}

/** Choices that last across scenarios, kept in this browser only. */
export interface Settings {
  /** Leaves the loot deck out of setup, for groups whose app builds it. */
  skipLoot: boolean;
  /** The language the story is read in. */
  language: Language;
}
