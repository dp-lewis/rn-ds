import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchTopStories } from '../api/newsApi';
import StoryTile from '../components/StoryTile';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type { Story } from '../types';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "FRI 31 JUL" — matches the mono wire lines on the tiles. */
function formatToday(date: Date): string {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function Masthead() {
  return (
    <View style={styles.masthead}>
      <Text style={styles.wordmark}>MERIDIAN</Text>
      <Text style={styles.mastheadDate}>{formatToday(new Date())}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setStories(await fetchTopStories());
    } catch {
      setError('Could not load the wire.');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const onSelectStory = useCallback(
    (story: Story) => navigation.navigate('Article', { storyId: story.id }),
    [navigation],
  );

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={colors.inkMuted} />
        <Text style={styles.stateText}>Pulling today's wire</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <Text style={styles.stateText}>{error}</Text>
        <Pressable
          onPress={onRefresh}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryText}>TRY AGAIN</Text>
        </Pressable>
      </View>
    );
  }

  const [lead, ...rest] = stories;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={rest}
        keyExtractor={(story) => story.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xxxl },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.inkMuted}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Masthead />
            {lead && (
              <>
                <SectionLabel>TOP STORY</SectionLabel>
                <StoryTile story={lead} variant="lead" onPress={onSelectStory} />
              </>
            )}
            <SectionLabel>LATEST</SectionLabel>
          </View>
        }
        renderItem={({ item }) => <StoryTile story={item} onPress={onSelectStory} />}
      />
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
    gap: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    gap: spacing.md,
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  wordmark: {
    ...typography.wordmark,
    color: colors.ink,
  },
  mastheadDate: {
    ...typography.wire,
    fontFamily: fonts.mono,
    color: colors.inkMuted,
  },
  sectionLabel: {
    ...typography.eyebrow,
    fontFamily: fonts.mono,
    color: colors.inkMuted,
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
  retryPressed: {
    opacity: 0.6,
  },
  retryText: {
    ...typography.eyebrow,
    fontFamily: fonts.mono,
    color: colors.ink,
  },
});
