import React from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';

export const limparAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage limpo com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar AsyncStorage:', error);
  }
};
