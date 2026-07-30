import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import Eyebrow from './Eyebrow';
import { palettes, spacing } from '../theme';
import { CATEGORIES } from '../types';

const meta = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  argTypes: {
    category: { control: 'select', options: CATEGORIES },
    variant: {
      control: 'inline-radio',
      options: ['inline', 'pill'],
      description: 'Tinted text for app surfaces, filled chip for imagery.',
    },
    breaking: { control: 'boolean' },
  },
  args: {
    category: 'Business',
    breaking: false,
    variant: 'inline',
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Inline: SBStory = {};

/** Used over photography, where a tinted desk colour would not survive. */
export const Pill: SBStory = {
  args: { variant: 'pill' },
};

/** Signal red outranks the desk colour and relabels. */
export const Breaking: SBStory = {
  args: { breaking: true },
};

/**
 * The full desk palette. Flip the toolbar theme to check both modes — the
 * inline colours differ between them, the pill colours deliberately do not.
 */
export const AllCategories: SBStory = {
  render: (args) => (
    <View style={{ gap: spacing.md }}>
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </View>
  ),
};

/** Pills always sit on a dark scrim, so they are checked against one. */
export const AllCategoriesAsPills: SBStory = {
  args: { variant: 'pill' },
  render: (args) => (
    <View
      style={{
        gap: spacing.md,
        backgroundColor: palettes.dark.surface.page,
        padding: spacing.lg,
        borderRadius: 8,
      }}
    >
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </View>
  ),
};
