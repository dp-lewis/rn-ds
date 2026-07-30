import { StyleSheet, Text, View } from 'react-native';

import { categoryColors, colors, spacing, typography } from '../theme';
import type { Story } from '../types';

/**
 * Desk label with its marker dot. Breaking overrides the desk colour — the
 * signal red is the one thing that outranks the category.
 */
export default function Eyebrow({ story }: { story: Story }) {
  const tint = story.breaking ? colors.signal : categoryColors[story.category];

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <Text style={[styles.label, { color: tint }]}>
        {story.breaking ? 'BREAKING' : story.category.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: typography.eyebrow,
});
