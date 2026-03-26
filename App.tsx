import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import MiniPlayer from './src/components/MiniPlayer';
import { useAudioManager } from './src/hooks/useAudioManager';

function AppContent() {
  // Global audio manager — syncs Zustand store ↔ expo-av
  useAudioManager();

  return (
    <View style={styles.container}>
      {/* Main navigation content */}
      <View style={styles.content}>
        <AppNavigator />
      </View>

      {/* Global MiniPlayer — always visible at bottom when song is loaded */}
      <MiniPlayer />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
});
