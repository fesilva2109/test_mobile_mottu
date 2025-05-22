import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';


export function useResetAsync() {
  const { resetApp } = useAuth();

  const resetar = async () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja fazer logout?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            const sucesso = await resetApp();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return { resetar };
}