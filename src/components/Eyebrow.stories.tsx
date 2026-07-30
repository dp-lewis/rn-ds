import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import Eyebrow from './Eyebrow';
import { DEFAULT_BRAND, themes, useTheme } from '../theme';
import { CATEGORIES } from '../types';

/** Stories read the theme too, rather than hard-coding gaps. */
function Stack({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={{
        gap: theme.spacing.md,
        ...(onDark && {
          backgroundColor: themes[DEFAULT_BRAND].dark.color.surface.page,
          padding: theme.spacing.lg,
          borderRadius: theme.radius.md,
        }),
      }}
    >
      {children}
    </View>
  );
}

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

/** Signal outranks the desk colour and relabels. */
export const Breaking: SBStory = {
  args: { breaking: true },
};

/**
 * The full desk palette. Switch brand or theme in the toolbar — these come
 * from the semantic layer, so they follow both.
 */
export const AllCategories: SBStory = {
  render: (args) => (
    <Stack>
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </Stack>
  ),
};

/** Pills always sit on a dark scrim, so they are checked against one. */
export const AllCategoriesAsPills: SBStory = {
  args: { variant: 'pill' },
  render: (args) => (
    <Stack onDark>
      {CATEGORIES.map((category) => (
        <Eyebrow key={category} {...args} category={category} />
      ))}
    </Stack>
  ),
};
