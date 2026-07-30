import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchStoryById } from '../api/newsApi';
import Eyebrow from '../components/Eyebrow';
import WireLine from '../components/WireLine';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { Story } from '../types';

function BackButton({ onPress, top }: { onPress: () => void; top: number }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back to top stories"
      hitSlop={8}
      style={({ pressed }) => [styles.back, { top }, pressed && styles.backPressed]}
    >
      <Text style={styles.backGlyph}>←</Text>
    </Pressable>
  );
}

export default function ArticleScreen({ route, navigation }: RootStackScreenProps<'Article'>) {
  const { storyId } = route.params;
  const insets = useSafeAreaInsets();

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
        <ActivityIndicator color={colors.inkMuted} />
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
          style={({ pressed }) => [styles.retry, pressed && styles.backPressed]}
        >
          <Text style={styles.retryText}>BACK TO TOP STORIES</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: story.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessible={false}
          />
          {/* Keeps the back button readable whatever the photo is doing. */}
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'transparent']}
            style={styles.heroScrim}
          />
          {/* Lives inside the hero so it scrolls away rather than floating
              over the body copy. */}
          <BackButton onPress={goBack} top={insets.top + spacing.sm} />
        </View>

        <View style={styles.body}>
          <Eyebrow story={story} />
          <Text style={styles.headline}>{story.headline}</Text>
          <Text style={styles.standfirst}>{story.summary}</Text>

          {/* Same wire line as the tiles, promoted into a rule-bound rail. */}
          <View style={styles.rail}>
            <Text style={styles.byline}>By {story.author}</Text>
            <WireLine story={story} />
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },

  hero: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.imagePlaceholder,
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
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backPressed: {
    opacity: 0.6,
  },
  backGlyph: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.inkInverse,
  },

  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headline: {
    ...typography.articleHeadline,
    color: colors.ink,
  },
  standfirst: {
    ...typography.standfirst,
    color: colors.inkMuted,
  },
  rail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  byline: {
    ...typography.byline,
    color: colors.ink,
  },
  paragraph: {
    ...typography.paragraph,
    color: colors.ink,
  },
  ends: {
    ...typography.wire,
    fontFamily: fonts.mono,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  stateText: {
    ...typography.summary,
    color: colors.inkMuted,
  },
  retry: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    ...typography.eyebrow,
    fontFamily: fonts.mono,
    color: colors.ink,
  },
});
