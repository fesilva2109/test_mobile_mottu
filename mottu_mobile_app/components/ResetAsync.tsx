import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';


export function useResetAsync() {
  const { resetApp } = useAuth();

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
          text: 'Apagar Tudo',
          onPress: async () => {
            const sucesso = await resetApp();
            if (sucesso) {
              Alert.alert('Sucesso', 'Dados locais apagados com sucesso');
            } else {
              Alert.alert('Erro', 'Não foi possível apagar os dados');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return { resetar };
}