import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE = 'http://localhost:3001'; 

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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
      // Get all users from JSON Server
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) {
        throw new Error('Erro ao conectar com o servidor');
      }

      const users = await response.json();
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      // Mock token generation
      const authToken = `mock_token_${user.id}_${Date.now()}`;
      const userData = { id: user.id, email: user.email, name: user.name };

      await AsyncStorage.setItem('@mottu:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@mottu:token', authToken);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no registro');
      }

      const data = await response.json();
      const { token: authToken, user: userData } = data;

      await AsyncStorage.setItem('@mottu:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@mottu:token', authToken);

      setUser(userData);
      setToken(authToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      await AsyncStorage.removeItem('@mottu:user');
      await AsyncStorage.removeItem('@mottu:token');
      setUser(null);
      setToken(null);
      router.replace('/login');
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
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
