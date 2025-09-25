import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';


export function useLogout() {
  // Função de reset do contexto de autenticação (limpa dados do usuário e AsyncStorage)
  const { logout: authLogout } = useAuth();

  //Dispara o alerta de confirmação e executa o logout se confirmado

  const logout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair do aplicativo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Chama a função de logout do contexto de autenticação
            await authLogout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Retorna função para ser usada em botões ou menus
  return { logout };
}
