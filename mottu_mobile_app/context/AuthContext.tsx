import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE = 'http://192.168.0.183:3001'; // ajuste para seu IP + porta do JSON Server

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetApp: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/users?email=${email}&password=${password}`);
      if (!response.ok) {
        throw new Error('Erro ao conectar com o servidor');
      }

      const users = await response.json();
      const foundUser = users[0];

      if (!foundUser) {
        throw new Error('Email ou senha inválidos');
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // Verifica se já existe
      const checkResponse = await fetch(`${API_BASE}/users?email=${email}`);
      const exists = await checkResponse.json();
      if (exists.length > 0) {
        throw new Error('Usuário já cadastrado');
      }

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      const newUser = await response.json();
      const authToken = `mock_token_${newUser.id}_${Date.now()}`;
      const userData = { id: newUser.id, email: newUser.email, name: newUser.name };

      await AsyncStorage.setItem('@mottu:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@mottu:token', authToken);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
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
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, resetApp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
