import type { BrandPrimitives } from './types';

/**
 * Tribune — the old broadsheet title. Warm paper, brown-black ink, a serif
 * masthead, deeper and more muted desk colours.
 */
export const tribune: BrandPrimitives = {
  id: 'tribune',
  name: 'THE TRIBUNE',
  shortName: 'Tribune',
  fontFamily: {
    display: { ios: 'Georgia', android: 'serif', default: 'Georgia' },
    mono: { ios: 'Menlo', android: 'monospace', default: 'Menlo' },
  },
  color: {
    neutral: {
      0: '#FFFDF8',
      25: '#F6F1E8',
      50: '#F3EDE3',
      100: '#EBE3D6',
      150: '#DED3C2',
      300: '#A79C8C',
      400: '#8C8477',
      500: '#776E62',
      550: '#6B6154',
      800: '#3A322A',
      850: '#2B2520',
      900: '#211C18',
      925: '#1F1B16',
      975: '#171310',
    },
    critical: { 400: '#F08A7A', 600: '#B3261E' },
    hue: {
      azure: { 400: '#7FA8D9', 600: '#1D4E89' },
      teal: { 400: '#6FBFA8', 600: '#2F6F62' },
      violet: { 400: '#B695D8', 600: '#6A3E8F' },
      green: { 400: '#9CBF6E', 600: '#4A6B2A' },
      magenta: { 400: '#E58AB4', 600: '#A3286B' },
    },
  },
};
