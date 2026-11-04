/** The browser's saved storage, or nothing where the browser refuses access to it. */
export function browserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

/** Reads a saved value, or null if it's missing or unreadable. */
export function readStored(storage: Pick<Storage, 'getItem'> | undefined, key: string): unknown {
  try {
    return JSON.parse(storage?.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

/** Saves a value if the browser allows it; without storage it lasts only for this visit. */
export function writeStored(storage: Pick<Storage, 'setItem'> | undefined, key: string, value: unknown): void {
  try {
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // A full or blocked storage only costs what would have been remembered.
  }
}
