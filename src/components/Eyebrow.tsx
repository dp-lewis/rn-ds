import { Text, View } from 'react-native';

import { categoryOnImage, makeStyles, signalOnImage, useTheme } from '../theme';
import type { Category } from '../types';

export type EyebrowVariant = 'inline' | 'pill';

type Props = {
  category: Category;
  /** Signal red outranks the desk colour and relabels to BREAKING. */
  breaking?: boolean;
  /**
   * 'inline' tints the text itself — for app surfaces. 'pill' fills the chip
   * and reverses the text, which is what stays legible over imagery.
   */
  variant?: EyebrowVariant;
};

/** Desk label with its marker dot. */
export default function Eyebrow({
  category,
  breaking = false,
  variant = 'inline',
}: Props) {
  const theme = useTheme();
  const styles = useStyles();
  const isPill = variant === 'pill';

  // Pills always sit on a dark scrim, so they take the fixed on-image palette
  // rather than the themed one, which is tuned for app surfaces.
  const tint = isPill
    ? breaking
      ? signalOnImage
      : categoryOnImage[category]
    : breaking
      ? theme.color.signal
      : theme.color.category[category];

  const foreground = isPill ? theme.color.text.inverse : tint;

  return (
    <View style={[styles.row, isPill && [styles.pill, { backgroundColor: tint }]]}>
      <View style={[styles.dot, { backgroundColor: foreground }]} />
      <Text style={[styles.label, { color: foreground }]}>
        {breaking ? 'BREAKING' : category.toUpperCase()}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xxs + 1,
    borderRadius: t.radius.sm,
  },
  dot: {
    width: t.sizes.eyebrowDot,
    height: t.sizes.eyebrowDot,
    borderRadius: t.sizes.eyebrowDot / 2,
  },
  label: t.typography.eyebrow,
}));
