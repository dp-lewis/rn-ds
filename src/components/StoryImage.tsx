import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { makeStyles } from '../theme';

type Props = {
  uri: string;
  /** Sizing and radius live on the wrapper, so callers style it like a View. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Wraps expo-image for caching and a fade-in, over a placeholder ground so a
 * tile never flashes empty. A dead URL leaves the placeholder rather than a
 * broken-image glyph.
 */
export default function StoryImage({ uri, style }: Props) {
  const [failed, setFailed] = useState(false);
  const styles = useStyles();

  return (
    <View style={[styles.wrap, style]}>
      {!failed && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          onError={() => setFailed(true)}
          accessible={false}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrap: {
    backgroundColor: t.color.surface.image,
    overflow: 'hidden',
  },
}));
