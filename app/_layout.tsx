"use client"
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiStatusProvider } from '@/context/ApiStatusContext';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ApiStatusProvider>
      <ThemeProvider>
        <AuthProvider> 
          <RootComponent />
        </AuthProvider>
      </ThemeProvider>
    </ApiStatusProvider>
  );
}

function RootComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppLayout />;
}

function AppLayout() {
  const { colors } = useTheme();

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.primary.main }}
      edges={['top', 'left', 'right']}
    >
      <OfflineBanner />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style={colors.statusBar} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}