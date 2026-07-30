import { Platform } from 'react-native';

/**
 * Design tokens. Components should never hard-code a hex value or a raw
 * pixel gap — pull it from here so the whole app moves together.
 */

export const colors = {
  /** App ground. Cool oyster grey, deliberately not a warm newsprint cream. */
  paper: '#F1F3F2',
  /** Tile surface. */
  card: '#FFFFFF',
  ink: '#16191C',
  inkMuted: '#667077',
  /** Text on top of imagery. */
  inkInverse: '#FFFFFF',
  rule: '#DDE1E0',
  /** Sits under an image while it loads, so tiles never flash empty. */
  imagePlaceholder: '#E3E7E6',
  /** Reserved for breaking news. Using it anywhere else spends its meaning. */
  signal: '#D92B1F',
} as const;

/** One colour per desk, used for the eyebrow label and its marker dot. */
export const categoryColors = {
  World: '#2340C8',
  Business: '#0F7A6B',
  Science: '#6B3FA0',
  Climate: '#2E7D32',
  Culture: '#C2185B',
} as const;

export type Category = keyof typeof categoryColors;

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

export const spacing = {
  xs: 4,
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
