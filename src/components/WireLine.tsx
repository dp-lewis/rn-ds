import { StyleSheet, Text } from 'react-native';

import { colors, fonts, typography } from '../theme';
import type { Story } from '../types';

/** Local wall-clock time the story hit the wire, e.g. "06:12". */
export function formatFiled(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * The signature element: real provenance, in mono, on tiles and articles alike.
 * DATELINE · FILED 06:12 · 5 MIN
 */
export default function WireLine({ story }: { story: Story }) {
  return (
    <Text style={styles.wire} numberOfLines={1}>
      {story.dateline.toUpperCase()}
      <Text style={styles.divider}> · </Text>
      FILED {formatFiled(story.filedAt)}
      <Text style={styles.divider}> · </Text>
      {story.readMinutes} MIN
    </Text>
  );
}

const styles = StyleSheet.create({
  wire: {
    ...typography.wire,
    fontFamily: fonts.mono,
    color: colors.inkMuted,
  },
  divider: {
    color: colors.rule,
  },
});
