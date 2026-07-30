import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import { colors, spacing } from '../src/theme';

/**
 * Components are designed to sit on the app's paper ground inside a padded
 * list at phone width, so every story gets that context rather than a bare
 * white canvas stretched across a desktop viewport.
 */
const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: colors.paper, padding: spacing.lg }}>
        <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center' }}>
          <Story />
        </View>
      </View>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
