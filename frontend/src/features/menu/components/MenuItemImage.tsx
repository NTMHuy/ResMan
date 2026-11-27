import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { resolveMenuImageUrl } from '@/src/constants/config';

interface MenuItemImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
}

export function MenuItemImage({ uri, style }: MenuItemImageProps) {
  const [failed, setFailed] = useState(false);
  const source = resolveMenuImageUrl(uri);

  useEffect(() => {
    setFailed(false);
  }, [source]);

  if (!source || failed) {
    return (
      <View style={[styles.fallback, style as StyleProp<ViewStyle>]}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.label}>Chưa có ảnh</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: source }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  emoji: { fontSize: 24 },
  label: { color: '#667085', fontSize: 10 },
});
