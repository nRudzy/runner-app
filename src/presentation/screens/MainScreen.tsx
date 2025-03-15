import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

/**
 * Main screen component that serves as the container for the app's navigation
 */
export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 