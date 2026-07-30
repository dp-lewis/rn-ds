import storiesJson from '../data/stories.json';
import type { Story } from '../types';

/**
 * Stand-in for a real news API. Everything the screen consumes goes through
 * here, so swapping in a live endpoint later means editing this file only —
 * `fetchTopStories` keeps its signature and the screen never changes.
 */

const LATENCY_MS = 600;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Returns today's wire, newest first. The lead story is the first item.
 */
export async function fetchTopStories(): Promise<Story[]> {
  await delay(LATENCY_MS);

  const stories = storiesJson as Story[];

  return [...stories].sort(
    (a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime(),
  );
}

/**
 * Looks up a single story. The article screen takes an id rather than the
 * whole story object, so the API layer stays the only place data comes from.
 */
export async function fetchStoryById(id: string): Promise<Story> {
  await delay(LATENCY_MS / 2);

  const story = (storiesJson as Story[]).find((s) => s.id === id);

  if (!story) {
    throw new Error(`No story filed under ${id}`);
  }

  return story;
}
