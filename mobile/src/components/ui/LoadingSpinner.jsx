import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const COLORS = {
  bg: '#0f172a',
  primary: '#6366f1',
  textMuted: '#94a3b8',
};

export default function LoadingSpinner({ message = 'Loading...', size = 'large', fullScreen = false }) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={COLORS.primary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  message: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
