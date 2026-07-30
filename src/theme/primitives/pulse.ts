import type { BrandPrimitives } from './types';

/**
 * Pulse — the digital-native title. Near-neutral greys pushed to higher
 * contrast, electric hues, true-black dark mode.
 */
export const pulse: BrandPrimitives = {
  id: 'pulse',
  name: 'PULSE',
  fontFamily: {
    display: {},
    mono: { ios: 'Menlo', android: 'monospace', default: 'Menlo' },
  },
  color: {
    neutral: {
      0: '#FFFFFF',
      25: '#F5F5F7',
      50: '#F4F4F8',
      100: '#E8E8EC',
      150: '#DCDCE3',
      300: '#9C9CB0',
      400: '#86869A',
      500: '#6E6E82',
      550: '#5C5C6B',
      800: '#2A2A35',
      850: '#1E1E26',
      900: '#141419',
      925: '#0B0B0F',
      975: '#0A0A0C',
    },
    critical: { 400: '#FF7A96', 600: '#D0164A' },
    hue: {
      azure: { 400: '#8FA8FF', 600: '#2F5BEA' },
      // #00806B was 4.49:1 on the light page — a hair under AA.
      teal: { 400: '#4ED6BC', 600: '#007A66' },
      violet: { 400: '#C39BFF', 600: '#7A2FE0' },
      green: { 400: '#6FD98A', 600: '#1F7A3A' },
      magenta: { 400: '#FF8AC0', 600: '#C41E6B' },
    },
  },
};
