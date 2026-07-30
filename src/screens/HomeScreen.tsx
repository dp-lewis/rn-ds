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
import { makeStyles, useTheme } from '../theme';
import type { Story } from '../types';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "FRI 31 JUL" — matches the mono wire lines on the tiles. */
function formatToday(date: Date): string {
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function Masthead() {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.masthead}>
      <Text style={styles.wordmark}>{theme.brandName}</Text>
      <Text style={styles.mastheadDate}>{formatToday(new Date())}</Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  const styles = useStyles();
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useStyles();

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
        <ActivityIndicator color={theme.color.text.muted} />
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
          style={({ pressed }) => [
            styles.retry,
            pressed && { opacity: theme.opacity.pressed },
          ]}
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
          { paddingBottom: insets.bottom + theme.spacing.xxxl },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.md }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.color.text.muted}
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

const useStyles = makeStyles((t) => ({
  screen: {
    flex: 1,
    backgroundColor: t.color.surface.page,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.md,
  },
  listContent: {
    paddingHorizontal: t.spacing.lg,
  },
  header: {
    gap: t.spacing.md,
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: t.spacing.lg,
    paddingBottom: t.spacing.sm,
  },
  wordmark: {
    ...t.typography.wordmark,
    color: t.color.text.primary,
  },
  mastheadDate: {
    ...t.typography.wire,
    fontFamily: t.fonts.mono,
    color: t.color.text.muted,
  },
  sectionLabel: {
    ...t.typography.eyebrow,
    fontFamily: t.fonts.mono,
    color: t.color.text.muted,
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
