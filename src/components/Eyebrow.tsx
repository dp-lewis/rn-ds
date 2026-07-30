import { StyleSheet, Text, View } from 'react-native';

import { categoryColors, colors, radius, spacing, typography } from '../theme';
import type { Category } from '../types';

export type EyebrowVariant = 'inline' | 'pill';

type Props = {
  category: Category;
  /** Signal red outranks the desk colour and relabels to BREAKING. */
  breaking?: boolean;
  /**
   * 'inline' tints the text itself — for light surfaces. 'pill' fills the
   * chip and reverses the text, which is what stays legible over imagery.
   */
  variant?: EyebrowVariant;
};

/** Desk label with its marker dot. */
export default function Eyebrow({ category, breaking = false, variant = 'inline' }: Props) {
  const tint = breaking ? colors.signal : categoryColors[category];
  const label = breaking ? 'BREAKING' : category.toUpperCase();
  const isPill = variant === 'pill';

  return (
    <View style={[styles.row, isPill && [styles.pill, { backgroundColor: tint }]]}>
      <View
        style={[styles.dot, { backgroundColor: isPill ? colors.inkInverse : tint }]}
      />
      <Text style={[styles.label, { color: isPill ? colors.inkInverse : tint }]}>
        {label}
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
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: typography.eyebrow,
});
