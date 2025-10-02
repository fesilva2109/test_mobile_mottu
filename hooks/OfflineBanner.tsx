import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApiStatus } from '@/context/ApiStatusContext';

/**
 * Banner que aparece no topo da tela quando o aplicativo está em modo offline.
 */
export const OfflineBanner = () => {
  const { isOffline } = useApiStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>Modo Offline Ativado</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ffc107',
    padding: 8,
    alignItems: 'center',
  },
  bannerText: {
    color: '#000',
    fontWeight: 'bold',
  },
});