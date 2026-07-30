import { Text } from 'react-native';

import { formatFiled } from '../lib/time';
import { makeStyles } from '../theme';

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
  const styles = useStyles();

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

const useStyles = makeStyles((t) => ({
  // typography.wire already carries the brand's mono face.
  wire: {
    ...t.typography.wire,
    color: t.color.text.muted,
  },
  /** text.faint, not border.hairline — the old border tone was 1.32:1. */
  divider: {
    color: t.color.text.faint,
  },
}));
