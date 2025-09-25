import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE = 'https://68cb62ef716562cf50734720.mockapi.io/api/v1';

interface User {
  id: string;
  email: string;
  name: string;
}

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
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

  const clearAuthError = () => {
    setAuthError(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!email || !password) {
        setAuthError('Email e senha são obrigatórios');
        return;
      }

      const response = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        if (response.status === 404) {
          setAuthError('Serviço temporariamente indisponível. Tente novamente mais tarde.');
          return;
        }
        setAuthError('Erro ao conectar com o servidor. Verifique sua conexão com a internet.');
        return;
      }

      const users = await response.json();
      const foundUser = users[0];

      if (!foundUser) {
        setAuthError('Email não encontrado. Verifique suas credenciais.');
        return;
      }

      if (foundUser.password !== password) {
        setAuthError('Senha incorreta. Tente novamente.');
        return;
      }

      const authToken = `mock_token_${foundUser.id}_${Date.now()}`;
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };

      await AsyncStorage.setItem('@mottu:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@mottu:token', authToken);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthError('Ocorreu um erro inesperado durante o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!name || !email || !password) {
        setAuthError('Nome, email e senha são obrigatórios');
        return;
      }

      const checkResponse = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
      if (!checkResponse.ok) {
        setAuthError('Erro ao verificar disponibilidade do email. Tente novamente.');
        return;
      }

      const exists = await checkResponse.json();
      if (exists.length > 0) {
        setAuthError('Este email já está cadastrado.');
        return;
      }

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          setAuthError('Dados inválidos. Verifique as informações e tente novamente.');
          return;
        }
        setAuthError('Erro ao criar conta. Verifique sua conexão com a internet e tente novamente.');
        return;
      }

      const newUser = await response.json();
      const authToken = `mock_token_${newUser.id}_${Date.now()}`;
      const userData = { id: newUser.id, email: newUser.email, name: newUser.name };

      await AsyncStorage.multiSet([
        ['@mottu:user', JSON.stringify(userData)],
        ['@mottu:token', authToken],
      ]);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthError('Ocorreu um erro inesperado durante o registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@mottu:user');
      await AsyncStorage.removeItem('@mottu:token');
      setUser(null);
      setToken(null);
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
    <AuthContext.Provider value={{ user, token, loading, authError, login, register, logout, resetApp, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
