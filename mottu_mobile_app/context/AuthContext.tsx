import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User } from '@/types';
import { loginUser, registerUser, logoutUser } from '@/context/authService';

// Define o formato dos dados do contexto de autenticação
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetApp: () => Promise<boolean>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Provedor que gerencia login, registro, logout e sessão do usuário
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Carrega dados salvos do usuário ao iniciar o app
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@mottu:user');
        const storedToken = await AsyncStorage.getItem('@mottu:token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Limpa mensagens de erro de autenticação
  const clearAuthError = () => {
    setAuthError(null);
  };

  // Faz login do usuário e salva dados no AsyncStorage
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!email || !password) {
        setAuthError('Email e senha são obrigatórios');
        return;
      }

      const { user: userData, token: authToken } = await loginUser(email, password);

      await AsyncStorage.setItem('@mottu:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@mottu:token', authToken);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  // Registra novo usuário e cria sessão automaticamente
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!name || !email || !password) {
        setAuthError('Nome, email e senha são obrigatórios');
        return;
      }

      const { user: newUser, token: authToken } = await registerUser(name, email, password);

      await AsyncStorage.multiSet([
        ['@mottu:user', JSON.stringify(newUser)],
        ['@mottu:token', authToken],
      ]);

      setUser(newUser);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  // Remove dados do usuário e volta para a tela de login
  const logout = async () => {
    try {
      // Tenta invalidar o token no servidor antes de limpar localmente
      if (token) {
        await logoutUser(token);
      }

      await AsyncStorage.removeItem('@mottu:user');
      await AsyncStorage.removeItem('@mottu:token');
      setUser(null);
      setToken(null);
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Apaga todos os dados do app e reinicia para tela de login
  const resetApp = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setToken(null);
      router.replace('/login');
      return true;
    } catch (error) {
      console.error('Erro ao resetar app:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, authError, login, register, logout, resetApp, clearAuthError}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar os dados e funções de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
