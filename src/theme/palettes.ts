import type { Category } from '../types';
import { categoryOnImage } from './tokens';

export type ThemeMode = 'light' | 'dark';

/**
 * Colours are grouped by role, not by tone. That is deliberate: a flat
 * namespace let a border colour get used as a text colour, which is how the
 * wire dividers ended up at 1.32:1.
 */
export type Palette = {
  surface: {
    /** App ground. */
    page: string;
    /** Tile and article card. */
    card: string;
    /** Sits under an image while it loads, so tiles never flash empty. */
    image: string;
  };
  text: {
    primary: string;
    /** Wire lines, summaries. Clears 4.5:1 on both surfaces. */
    muted: string;
    /** Decorative separators only. Clears 3:1 — never use for content. */
    faint: string;
    /** On top of imagery, where the scrim guarantees a dark ground. */
    inverse: string;
  };
  border: {
    hairline: string;
  };
  /** Reserved for breaking news. Using it anywhere else spends its meaning. */
  signal: string;
  /** One colour per desk, for the inline eyebrow label and its marker dot. */
  category: Record<Category, string>;
};

export const palettes: Record<ThemeMode, Palette> = {
  light: {
    surface: { page: '#F1F3F2', card: '#FFFFFF', image: '#E3E7E6' },
    text: {
      primary: '#16191C',
      muted: '#667077',
      faint: '#7F898F',
      inverse: '#FFFFFF',
    },
    border: { hairline: '#DDE1E0' },
    signal: '#C4231A',
    // Light mode reads on white, which is exactly what the pill palette is
    // tuned for, so it reuses those values rather than duplicating them.
    category: categoryOnImage,
  },
  dark: {
    surface: { page: '#101315', card: '#191D20', image: '#23282C' },
    text: {
      primary: '#ECEFF1',
      muted: '#9AA4AC',
      faint: '#6B757C',
      inverse: '#FFFFFF',
    },
    border: { hairline: '#2B3238' },
    signal: '#FF6F61',
    category: {
      World: '#8AA0FF',
      Business: '#4FC9B0',
      Science: '#C199F0',
      Climate: '#74CC80',
      Culture: '#FF85AE',
    },
  },
};
