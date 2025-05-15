import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Manter a tela de splash visível enquanto inicializamos a aplicação
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Esconder a tela de splash após a inicialização
    SplashScreen.hideAsync();
  }, []);

  // Redirecionar para a tela principal que contém as tabs
  return <Redirect href="/(tabs)" />;
}