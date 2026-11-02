import { describe, expect, it } from 'vitest';
import { readSaved, shareLink, sharedSpoilers, writeSaved } from '../src/state.ts';

const memoryStorage = (initial: string | null = null) => {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_: string, next: string) => {
      value = next;
    },
  };
};

describe('saved choices', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    writeSaved(storage, { spoilers: ['sticker-1'], collapsed: ['camp'] });
    expect(readSaved(storage)).toEqual({ spoilers: ['sticker-1'], collapsed: ['camp'] });
  });

  it('starts empty with nothing saved, no storage or unreadable storage', () => {
    const empty = { spoilers: [], collapsed: [] };
    expect(readSaved(memoryStorage())).toEqual(empty);
    expect(readSaved(undefined)).toEqual(empty);
    expect(readSaved(memoryStorage('not json'))).toEqual(empty);
    expect(readSaved(memoryStorage('{"spoilers":3}'))).toEqual(empty);
  });

  it('survives storage that refuses writes', () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('full');
      },
    };
    expect(() => writeSaved(storage, { spoilers: [], collapsed: [] })).not.toThrow();
  });
});

describe('shared links', () => {
  it('round-trips a spoiler list', () => {
    const link = shareLink('https://example.test/rules/?x=1#camp', ['sticker-1', 'sticker-12', 'appendix-d']);
    expect(link).toBe('https://example.test/rules/?spoilers=1,12,appendix-d');
    expect(sharedSpoilers(new URL(link).search)).toEqual(['sticker-1', 'sticker-12', 'appendix-d']);
  });

  it('tells a link with no list apart from an empty list', () => {
    expect(sharedSpoilers('')).toBeNull();
    expect(sharedSpoilers('?spoilers=')).toEqual([]);
  });
});
