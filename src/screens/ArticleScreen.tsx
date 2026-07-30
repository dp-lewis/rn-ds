import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchStoryById } from '../api/newsApi';
import Eyebrow from '../components/Eyebrow';
import StoryImage from '../components/StoryImage';
import WireLine from '../components/WireLine';
import type { RootStackScreenProps } from '../navigation/types';
import { makeStyles, useTheme } from '../theme';
import type { Story } from '../types';

function BackButton({ onPress, top }: { onPress: () => void; top: number }) {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back to top stories"
      hitSlop={8}
      style={({ pressed }) => [
        styles.back,
        { top },
        pressed && { opacity: theme.opacity.pressed },
      ]}
    >
      <Text style={styles.backGlyph}>←</Text>
    </Pressable>
  );
}

export default function ArticleScreen({ route, navigation }: RootStackScreenProps<'Article'>) {
  const { storyId } = route.params;
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useStyles();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchStoryById(storyId)
      .then((result) => {
        if (active) setStory(result);
      })
      .catch(() => {
        if (active) setError('That story is no longer on the wire.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Guards against setting state after a fast back-navigation.
    return () => {
      active = false;
    };
  }, [storyId]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={theme.color.text.muted} />
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.stateText}>{error}</Text>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.retry,
            pressed && { opacity: theme.opacity.pressed },
          ]}
        >
          <Text style={styles.retryText}>BACK TO TOP STORIES</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <StoryImage uri={story.imageUrl} style={StyleSheet.absoluteFill} />
          {/* Keeps the back button readable whatever the photo is doing. */}
          <LinearGradient colors={theme.scrims.hero} style={styles.heroScrim} />
          {/* Lives inside the hero so it scrolls away rather than floating
              over the body copy. */}
          <BackButton onPress={goBack} top={insets.top + theme.spacing.sm} />
        </View>

        <View style={styles.body}>
          <Eyebrow category={story.category} breaking={story.breaking} />
          <Text style={styles.headline}>{story.headline}</Text>
          <Text style={styles.standfirst}>{story.summary}</Text>

          {/* Same wire line as the tiles, promoted into a rule-bound rail. */}
          <View style={styles.rail}>
            <Text style={styles.byline}>By {story.author}</Text>
            <WireLine
              dateline={story.dateline}
              filedAt={story.filedAt}
              readMinutes={story.readMinutes}
            />
          </View>

          {story.body.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}

          <Text style={styles.ends}>— ENDS —</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: {
    flex: 1,
    backgroundColor: t.color.surface.page,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.lg,
  },

  hero: {
    aspectRatio: 16 / 10,
    backgroundColor: t.color.surface.image,
  },
  heroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  back: {
    position: 'absolute',
    left: t.spacing.lg,
    width: t.sizes.backButton,
    height: t.sizes.backButton,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backGlyph: {
    fontSize: 20,
    lineHeight: 24,
    color: t.color.text.inverse,
  },

  body: {
    padding: t.spacing.xl,
    gap: t.spacing.lg,
  },
  headline: {
    ...t.typography.articleHeadline,
    color: t.color.text.primary,
  },
  standfirst: {
    ...t.typography.standfirst,
    color: t.color.text.muted,
  },
  rail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: t.spacing.sm,
    paddingVertical: t.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: t.color.border.hairline,
  },
  byline: {
    ...t.typography.byline,
    color: t.color.text.primary,
  },
  paragraph: {
    ...t.typography.paragraph,
    color: t.color.text.primary,
  },
  ends: {
    ...t.typography.wire,
    fontFamily: t.fonts.mono,
    color: t.color.text.muted,
    textAlign: 'center',
    marginTop: t.spacing.sm,
  },

  stateText: {
    ...t.typography.summary,
    color: t.color.text.muted,
  },
  retry: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.color.text.primary,
    borderRadius: t.radius.sm,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.sm,
  },
  retryText: {
    ...t.typography.eyebrow,
    fontFamily: t.fonts.mono,
    color: t.color.text.primary,
  },
}));
