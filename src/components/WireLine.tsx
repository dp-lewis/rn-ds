import { StyleSheet, Text } from 'react-native';

import { formatFiled } from '../lib/time';
import { colors, fonts, typography } from '../theme';

type Props = {
  /** Where the correspondent filed from, e.g. "Brussels". */
  dateline: string;
  /** ISO 8601 timestamp. Rendered in the reader's local timezone. */
  filedAt: string;
  readMinutes: number;
};

/**
 * The design's signature element: real provenance, in mono, on tiles and
 * articles alike.
 * DATELINE · FILED 06:12 · 5 MIN
 */
export default function WireLine({ dateline, filedAt, readMinutes }: Props) {
  return (
    <Text style={styles.wire} numberOfLines={1}>
      {dateline.toUpperCase()}
      <Text style={styles.divider}> · </Text>
      FILED {formatFiled(filedAt)}
      <Text style={styles.divider}> · </Text>
      {readMinutes} MIN
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
