import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import Eyebrow from './Eyebrow';
import storiesData from '../data/stories.json';
import { categoryColors, spacing } from '../theme';
import type { Story } from '../types';

const [breakingStory, businessStory] = storiesData as Story[];

const meta = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
} satisfies Meta<typeof Eyebrow>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Desk: SBStory = {
  args: { story: businessStory },
};

/** Signal red outranks the desk colour whenever `breaking` is set. */
export const Breaking: SBStory = {
  args: { story: breakingStory },
};

/** The full desk palette. Add a category to the theme and it shows up here. */
export const AllCategories: SBStory = {
  args: { story: businessStory },
  render: () => (
    <View style={{ gap: spacing.md }}>
      {(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map(
        (category) => (
          <Eyebrow
            key={category}
            story={{ ...businessStory, category, breaking: false }}
          />
        ),
      )}
    </View>
  ),
};
