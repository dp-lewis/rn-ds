import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Eyebrow from './Eyebrow';
import StoryImage from './StoryImage';
import WireLine from './WireLine';
import { makeStyles, useTheme } from '../theme';
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

function StoryTile({ story, variant = 'standard', onPress }: Props) {
  const theme = useTheme();
  const styles = useStyles();

  const content =
    variant === 'lead' ? (
      <>
        <View style={styles.leadImageWrap}>
          <StoryImage uri={story.imageUrl} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={theme.scrims.lead}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.leadOverlay}>
            {/* Pill rather than inline: desk colours are tuned for app
                surfaces and would not hold up over a photograph. */}
            <Eyebrow category={story.category} breaking={story.breaking} variant="pill" />
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
        <StoryImage uri={story.imageUrl} style={styles.thumb} />
      </View>
    );

  // Without a handler this is not a button, so it should not announce as one
  // or show press feedback.
  if (!onPress) {
    return <View style={styles.card}>{content}</View>;
  }

  const accessibilityLabel = `${
    story.breaking ? 'Breaking. ' : ''
  }${story.category}. ${story.headline}. Filed from ${story.dateline}, ${
    story.readMinutes
  } minute read.`;

  return (
    <Pressable
      onPress={() => onPress(story)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      android_ripple={{ color: theme.color.border.hairline }}
      style={({ pressed }) => [styles.card, pressed && { opacity: theme.opacity.pressed }]}
    >
      {content}
    </Pressable>
  );
}

/**
 * Memoised because the feed re-renders on every pull-to-refresh. Callers
 * should pass a stable onPress (useCallback) for this to bite.
 */
export default memo(StoryTile);

const useStyles = makeStyles((t) => ({
  card: {
    backgroundColor: t.color.surface.card,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.color.border.hairline,
  },

  // Lead
  leadImageWrap: {
    aspectRatio: 16 / 10,
    backgroundColor: t.color.surface.image,
    justifyContent: 'flex-end',
  },
  leadOverlay: {
    padding: t.spacing.lg,
    gap: t.spacing.sm,
  },
  leadHeadline: {
    ...t.typography.leadHeadline,
    color: t.color.text.inverse,
  },
  leadFooter: {
    padding: t.spacing.lg,
    gap: t.spacing.sm,
  },

  // Standard
  standardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: t.spacing.md,
    padding: t.spacing.md,
  },
  standardText: {
    flex: 1,
    gap: t.spacing.sm,
  },
  thumb: {
    width: t.sizes.thumb,
    height: t.sizes.thumb,
    borderRadius: t.radius.md,
  },

  headline: {
    ...t.typography.headline,
    color: t.color.text.primary,
  },
  summary: {
    ...t.typography.summary,
    color: t.color.text.muted,
  },
}));
