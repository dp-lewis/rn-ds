/**
 * LAYER 1 — PRIMITIVES (non-colour)
 *
 * Raw values with no meaning attached. Named for what they *are*, never for
 * what they are used for. Nothing outside the theme should import these.
 */

export const space = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
  10: 40,
} as const;

export const radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
} as const;

export const dimension = {
  dot: 6,
  thumb: 92,
  control: 40,
} as const;

export const opacities = {
  full: 1,
  pressed: 0.7,
  disabled: 0.4,
} as const;

export const fontSize = {
  100: 11,
  200: 12,
  300: 14,
  400: 16,
  500: 17,
  600: 20,
  700: 27,
  800: 30,
} as const;

export const fontWeight = {
  regular: '400',
  bold: '700',
  black: '800',
} as const;

export const lineHeight = {
  100: 20,
  200: 22,
  300: 25,
  400: 26,
  500: 32,
  600: 36,
} as const;

export const tracking = {
  tighter: -0.7,
  tight: -0.6,
  snug: -0.3,
  normal: 0,
  wide: 0.4,
  wider: 1.1,
  widest: 1.5,
} as const;

/** Overlay gradients. Fixed values — they sit on photography, not on a theme. */
export const scrims = {
  lead: ['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)'],
  hero: ['rgba(0,0,0,0.45)', 'transparent'],
} as const;
