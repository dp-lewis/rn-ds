import { Platform } from 'react-native';

import type { Category } from '../types';

/**
 * Mode-independent tokens. Anything that changes between light and dark lives
 * in palettes.ts instead.
 */

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  /** Fully rounded — pills and circular buttons. */
  pill: 999,
} as const;

/** Fixed component dimensions, so they stop being magic numbers in styles. */
export const sizes = {
  thumb: 92,
  eyebrowDot: 6,
  backButton: 40,
} as const;

/** One pressed value for every interactive surface in the app. */
export const opacity = {
  pressed: 0.7,
} as const;

/**
 * Headlines intentionally ride the platform sans (SF on iOS, Roboto on
 * Android) — no `sans` token, because not setting fontFamily is what gets you
 * the native face. Only the wire metadata gets an explicit family.
 */
export const fonts = {
  /** The signature face: datelines, filed times, read length. */
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Menlo',
  }),
} as const;

/** Type ramp. Headlines are tight and heavy; the wire line is small and wide. */
export const typography = {
  wordmark: { fontSize: 20, fontWeight: '800', letterSpacing: 1.5 },
  leadHeadline: { fontSize: 27, fontWeight: '800', letterSpacing: -0.6, lineHeight: 32 },
  headline: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, lineHeight: 22 },
  summary: { fontSize: 14, lineHeight: 20 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  wire: { fontSize: 11, letterSpacing: 0.4 },

  // Article
  articleHeadline: { fontSize: 30, fontWeight: '800', letterSpacing: -0.7, lineHeight: 36 },
  standfirst: { fontSize: 17, lineHeight: 25 },
  byline: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  paragraph: { fontSize: 16, lineHeight: 26 },
} as const;

/** Gradients sit over photography, so they do not follow the theme. */
export const scrims = {
  /** Lead tile: keeps the headline legible over any photo. */
  lead: ['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)'],
  /** Article hero: just enough to hold the back button. */
  hero: ['rgba(0,0,0,0.45)', 'transparent'],
} as const;

/**
 * Pill eyebrows always sit on a dark scrim over imagery, so their colours are
 * fixed rather than themed. Every one clears 4.5:1 behind white text.
 */
export const categoryOnImage: Record<Category, string> = {
  World: '#2340C8',
  Business: '#0F7A6B',
  Science: '#6B3FA0',
  Climate: '#2E7D32',
  Culture: '#C2185B',
};

export const signalOnImage = '#C4231A';
