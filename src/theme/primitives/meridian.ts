import type { BrandPrimitives } from './types';

/**
 * Meridian — the wire service. Cool oyster greys, cobalt, a serious sans.
 */
export const meridian: BrandPrimitives = {
  id: 'meridian',
  name: 'MERIDIAN',
  fontFamily: {
    // Undefined on purpose: not setting fontFamily is what gets you the
    // native face (SF on iOS, Roboto on Android).
    display: {},
    mono: { ios: 'Menlo', android: 'monospace', default: 'Menlo' },
  },
  color: {
    neutral: {
      0: '#FFFFFF',
      25: '#F1F3F2',
      50: '#ECEFF1',
      100: '#E3E7E6',
      150: '#DDE1E0',
      300: '#9AA4AC',
      400: '#7F898F',
      500: '#6B757C',
      550: '#667077',
      800: '#2B3238',
      850: '#23282C',
      900: '#191D20',
      925: '#16191C',
      975: '#101315',
    },
    critical: { 400: '#FF6F61', 600: '#C4231A' },
    hue: {
      azure: { 400: '#8AA0FF', 600: '#2340C8' },
      teal: { 400: '#4FC9B0', 600: '#0F7A6B' },
      violet: { 400: '#C199F0', 600: '#6B3FA0' },
      green: { 400: '#74CC80', 600: '#2E7D32' },
      magenta: { 400: '#FF85AE', 600: '#C2185B' },
    },
  },
};
