import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import WireLine from './WireLine';
import storiesData from '../data/stories.json';
import type { Story } from '../types';

const [breakingStory] = storiesData as Story[];

/**
 * The design's signature element. Filed times render in the reader's local
 * timezone, so this will not match the UTC value in stories.json.
 */
const meta = {
  title: 'Components/WireLine',
  component: WireLine,
} satisfies Meta<typeof WireLine>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Default: SBStory = {
  args: { story: breakingStory },
};

/** Long datelines still hold on one line — the whole row truncates together. */
export const LongDateline: SBStory = {
  args: {
    story: {
      ...breakingStory,
      dateline: 'Dar es Salaam',
      readMinutes: 12,
    },
  },
};
