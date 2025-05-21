import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '@/context/AuthContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  );
}

function RootComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('RootComponent - User:', user);
    console.log('RootComponent - Loading:', loading);
    if (!loading) {
      if (!user) {
        console.log('RootComponent - Redirecionando para /login');
        router.replace('/login');
      } else {
        console.log('RootComponent - Redirecionando para /(tabs)');
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="cadastro/camera" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}