import React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import { createRoot } from 'react-dom/client';
import AppRoot from '@/src/AppRoot';

function WebRoot() {
  return (
    <View style={styles.root}>
      <AppRoot />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    width: '100%',
  },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<WebRoot />);
}

AppRegistry.registerComponent('ResMan', () => AppRoot);
