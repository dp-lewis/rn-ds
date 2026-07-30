import type { Category } from './theme';

export type Story = {
  id: string;
  /** Desk the story was filed to. Drives the eyebrow colour. */
  category: Category;
  headline: string;
  summary: string;
  /** Where the correspondent filed from, e.g. "Brussels". */
  dateline: string;
  /** ISO 8601 timestamp of when the story hit the wire. */
  filedAt: string;
  readMinutes: number;
  imageUrl: string;
  /** Breaking stories get the signal colour and a live marker. */
  breaking: boolean;
  /** Byline shown on the article screen. */
  author: string;
  /** Article body, one string per paragraph. */
  body: string[];
};
