import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import Eyebrow from './Eyebrow';
import { categoryColors, colors, spacing } from '../theme';
import type { Category } from '../types';

const CATEGORIES = Object.keys(categoryColors) as Category[];

const meta = {
  title: 'Components/Eyebrow',
  component: Eyebrow,
  argTypes: {
    category: { control: 'select', options: CATEGORIES },
    variant: {
      control: 'inline-radio',
      options: ['inline', 'pill'],
      description: 'Tinted text for light surfaces, filled chip for imagery.',
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
  parameters: { backgrounds: { default: 'dark' } },
};

/** Signal red outranks the desk colour and relabels. */
export const Breaking: SBStory = {
  args: { breaking: true },
};

/** The full desk palette. Add a category to the domain and it appears here. */
export const AllCategories: SBStory = {
  render: (args) => (
    <View style={{ gap: spacing.md }}>
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </View>
  ),
};

/** Same palette as filled chips, checked against a dark ground. */
export const AllCategoriesAsPills: SBStory = {
  args: { variant: 'pill' },
  render: (args) => (
    <View style={{ gap: spacing.md, backgroundColor: colors.ink, padding: spacing.lg }}>
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </View>
  ),
};
