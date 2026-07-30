import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import StoryTile from './StoryTile';
import storiesData from '../data/stories.json';
import { spacing } from '../theme';
import type { Story } from '../types';

const [breakingStory, businessStory, scienceStory, climateStory, cultureStory] =
  storiesData as Story[];

const meta = {
  title: 'Components/StoryTile',
  component: StoryTile,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['lead', 'standard'],
      description: 'Top-of-page treatment, or the scannable row used below it.',
    },
    story: { control: 'object' },
  },
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof StoryTile>;

export default meta;

type SBStory = StoryObj<typeof meta>;

/** The hero treatment: headline set over the image, summary below. */
export const Lead: SBStory = {
  args: {
    story: breakingStory,
    variant: 'lead',
  },
};

/** The workhorse row that everything below the lead uses. */
export const Standard: SBStory = {
  args: {
    story: businessStory,
    variant: 'standard',
  },
};

/** Breaking overrides the desk colour even in the compact row. */
export const BreakingRow: SBStory = {
  args: {
    story: breakingStory,
    variant: 'standard',
  },
};

/** Headlines clamp at three lines rather than pushing the tile out of shape. */
export const OverlongHeadline: SBStory = {
  args: {
    variant: 'standard',
    story: {
      ...scienceStory,
      headline:
        'Engineers drilling beneath the Reykjanes peninsula report a supercritical zone far larger than any previous survey had suggested, prompting a rethink of the field',
    },
  },
};

/** Every desk colour side by side — the quickest check that the system holds. */
export const AllDesks: SBStory = {
  args: {
    story: businessStory,
    variant: 'standard',
  },
  parameters: {
    docs: {
      description: {
        story: 'One tile per category, to compare the eyebrow colours in place.',
      },
    },
  },
  render: (args) => (
    <View style={{ gap: spacing.md }}>
      {[breakingStory, businessStory, scienceStory, climateStory, cultureStory].map(
        (story) => (
          <StoryTile key={story.id} {...args} story={story} variant="standard" />
        ),
      )}
    </View>
  ),
};
