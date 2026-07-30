import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BRAND_OPTIONS, makeStyles, useBrand, useTheme } from '../theme';

/**
 * Segmented control for switching masthead. Every colour it uses comes from
 * the semantic layer, so it re-skins along with everything else.
 */
export default function BrandSwitcher() {
  const { brand, setBrand } = useBrand();
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel="Masthead">
      {BRAND_OPTIONS.map((option) => {
        const selected = option.id === brand;

        return (
          <Pressable
            key={option.id}
            onPress={() => setBrand(option.id)}
            accessibilityRole="radio"
            // aria-checked rather than accessibilityState: react-native-web
            // drops accessibilityState here, so the selected segment would
            // reach a screen reader with no state at all. The aria-* props map
            // to native accessibility state on iOS and Android.
            aria-checked={selected}
            accessibilityLabel={option.name}
            style={({ pressed }) => [
              styles.segment,
              selected && styles.segmentSelected,
              pressed && !selected && { opacity: theme.opacity.pressed },
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.shortName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  group: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: t.spacing.xxs,
    padding: t.spacing.xxs,
    borderRadius: t.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.color.border.hairline,
    backgroundColor: t.color.surface.card,
  },
  segment: {
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.pill,
  },
  segmentSelected: {
    backgroundColor: t.color.text.primary,
  },
  label: {
    ...t.typography.wire,
    color: t.color.text.muted,
  },
  labelSelected: {
    color: t.color.surface.card,
  },
}));
