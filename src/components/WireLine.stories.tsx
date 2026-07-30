import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import WireLine from './WireLine';

/**
 * The design's signature element. Filed times render in the reader's local
 * timezone, so they will not match the UTC values in stories.json.
 */
const meta = {
  title: 'Components/WireLine',
  component: WireLine,
  args: {
    dateline: 'Brussels',
    filedAt: '2026-07-31T06:12:00Z',
    readMinutes: 5,
  },
} satisfies Meta<typeof WireLine>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Default: SBStory = {};

/** Long datelines still hold one line — the whole row truncates together. */
export const LongDateline: SBStory = {
  args: {
    dateline: 'Dar es Salaam',
    readMinutes: 12,
  },
};
