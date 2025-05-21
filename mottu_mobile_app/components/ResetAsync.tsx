import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const limparAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Erro ao limpar AsyncStorage:', error);
    return false;
  }
};

export function useResetAsync() {
  const resetar = async () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja apagar TODOS os dados locais?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          onPress: async () => {
            const sucesso = await limparAsyncStorage();
            if (sucesso) {
              Alert.alert('Sucesso', 'Dados locais apagados com sucesso');
            } else {
              Alert.alert('Erro', 'Não foi possível apagar os dados');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return { resetar };
}