import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';

// Register for Reanimated
import 'react-native-reanimated';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro/camera" options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Escanear QR Code',
          headerTitleStyle: { color: '#05AF31' }
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}