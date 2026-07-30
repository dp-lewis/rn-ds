import { CATEGORIES, type Category, type Story } from '../types';

/**
 * Validates raw JSON into a Story.
 *
 * The previous `storiesJson as Story[]` cast meant a typo'd category compiled
 * fine and then silently rendered an eyebrow with no colour at runtime. A real
 * API would need this check anyway, so the mock does it too — better to fail
 * loudly at the boundary than to degrade quietly in the UI.
 */

function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function parseStory(raw: unknown, index: number): Story {
  const fail = (reason: string): never => {
    throw new Error(`stories.json[${index}]: ${reason}`);
  };

  if (typeof raw !== 'object' || raw === null) return fail('expected an object');

  const s = raw as Record<string, unknown>;

  for (const key of ['id', 'headline', 'summary', 'dateline', 'filedAt', 'imageUrl', 'author']) {
    if (typeof s[key] !== 'string' || s[key] === '') fail(`${key} must be a non-empty string`);
  }

  if (!isCategory(s.category)) {
    fail(
      `category ${JSON.stringify(s.category)} is not a known desk ` +
        `(expected one of: ${CATEGORIES.join(', ')})`,
    );
  }

  if (Number.isNaN(Date.parse(s.filedAt as string))) {
    fail(`filedAt ${JSON.stringify(s.filedAt)} is not a valid ISO 8601 date`);
  }

  if (typeof s.readMinutes !== 'number' || s.readMinutes <= 0) {
    fail('readMinutes must be a positive number');
  }

  if (typeof s.breaking !== 'boolean') fail('breaking must be a boolean');
  if (!isStringArray(s.body) || s.body.length === 0) {
    fail('body must be a non-empty array of strings');
  }

  return s as unknown as Story;
}
