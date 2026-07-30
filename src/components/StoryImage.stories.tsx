import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import StoryImage from './StoryImage';

const meta = {
  title: 'Components/StoryImage',
  component: StoryImage,
  args: {
    uri: 'https://picsum.photos/seed/meridian-grid/900/560',
    style: { width: 260, height: 165, borderRadius: 10 },
  },
} satisfies Meta<typeof StoryImage>;

export default meta;

type SBStory = StoryObj<typeof meta>;

export const Default: SBStory = {};

/**
 * A dead URL settles on the placeholder ground rather than showing a broken
 * image glyph. Toggle the theme to see the placeholder follow it.
 */
export const BrokenUrl: SBStory = {
  args: {
    uri: 'https://example.invalid/not-a-real-image.jpg',
  },
};
