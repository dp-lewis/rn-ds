import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import Eyebrow from './Eyebrow';
import WireLine from './WireLine';
import { colors, radius, spacing, typography } from '../theme';
import type { Story } from '../types';

export type StoryTileVariant = 'lead' | 'standard';

type Props = {
  story: Story;
  /**
   * 'lead' is the top-of-page treatment: full-width image with the headline
   * set over it. 'standard' is the scannable row used for everything below.
   */
  variant?: StoryTileVariant;
  onPress?: (story: Story) => void;
};

export default function StoryTile({ story, variant = 'standard', onPress }: Props) {
  const accessibilityLabel = `${
    story.breaking ? 'Breaking. ' : ''
  }${story.category}. ${story.headline}. Filed from ${story.dateline}, ${
    story.readMinutes
  } minute read.`;

  return (
    <Pressable
      onPress={() => onPress?.(story)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      android_ripple={{ color: colors.rule }}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {variant === 'lead' ? (
        <>
          <View style={styles.leadImageWrap}>
            <Image
              source={{ uri: story.imageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              accessible={false}
            />
            {/* Scrim so the headline stays legible over any photo. */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)']}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.leadOverlay}>
              {/* Pill rather than inline: desk colours are tuned for white
                  surfaces and would not hold up over a photograph. */}
              <Eyebrow
                category={story.category}
                breaking={story.breaking}
                variant="pill"
              />
              <Text style={styles.leadHeadline}>{story.headline}</Text>
            </View>
          </View>

          <View style={styles.leadFooter}>
            <Text style={styles.summary} numberOfLines={2}>
              {story.summary}
            </Text>
            <WireLine
              dateline={story.dateline}
              filedAt={story.filedAt}
              readMinutes={story.readMinutes}
            />
          </View>
        </>
      ) : (
        <View style={styles.standardRow}>
          <View style={styles.standardText}>
            <Eyebrow category={story.category} breaking={story.breaking} />
            <Text style={styles.headline} numberOfLines={3}>
              {story.headline}
            </Text>
            <WireLine
              dateline={story.dateline}
              filedAt={story.filedAt}
              readMinutes={story.readMinutes}
            />
          </View>
          <Image
            source={{ uri: story.imageUrl }}
            style={styles.thumb}
            resizeMode="cover"
            accessible={false}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  cardPressed: {
    opacity: 0.72,
  },

  // Lead
  leadImageWrap: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.imagePlaceholder,
    justifyContent: 'flex-end',
  },
  leadOverlay: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  leadHeadline: {
    ...typography.leadHeadline,
    color: colors.inkInverse,
  },
  leadFooter: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  // Standard
  standardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
  },
  standardText: {
    flex: 1,
    gap: spacing.sm,
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.imagePlaceholder,
  },

  headline: {
    ...typography.headline,
    color: colors.ink,
  },
  summary: {
    ...typography.summary,
    color: colors.inkMuted,
  },
});
