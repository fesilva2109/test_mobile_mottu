import { User } from '@/types';
import { handleApiError } from '@/context/apiErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import axios from 'axios';
import i18n from '@/i18n';

interface AuthResponse {
  user: User;
  token: string;
}

// Normaliza diferentes formatos de resposta da API para { user, token } 
const normalizeAuthResponse = (data: any): AuthResponse => {
  if (!data) throw new Error('Resposta de autenticação vazia.');

  // Caso já venha no formato esperado
  if (data.user && data.token) {
    return { user: data.user as User, token: data.token };
  }

  if (data.token && (data.id || data.email)) {
    const user: any = {
      id: typeof data.id === 'number' ? String(data.id) : data.id ?? `remote_${Date.now()}`,
      email: data.email ?? '',
      name: data.name ?? data.email ?? '',
    };
    return { user, token: data.token };
  }

  // Fall back: se o objeto parece ser o user e contém token em outra propriedade
  if (data.token && typeof data === 'object') {
    // tenta mapear campos comuns
    const user: any = {
      id: data.id ?? data.userId ?? `remote_${Date.now()}`,
      email: data.email ?? data.username ?? '',
      name: data.name ?? data.fullName ?? '',
    };
    return { user, token: data.token };
  }

  throw new Error('Formato inesperado da resposta de autenticação.');
};

//Valida formato de email
 
const isValidEmail = (email: string): boolean => {
  // Valida a estrutura do email.
  const emailRegex = /^[^\s@]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

//Valida força da senha
const isPasswordStrong = (password: string): boolean => {
  // Requisito: mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo.
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
  return passwordRegex.test(password);
};

//Autentica um usuário via API.

export const loginUser = async (
  email: string, 
  password: string,
  isOffline: boolean,
  setApiOffline: () => void
): Promise<AuthResponse> => {
  try {
    // Validações básicas antes de fazer a requisição
    if (!email || !password) {
      throw new Error(i18n.t('common.allFieldsRequired'));
    }

    if (!isValidEmail(email)) {
      throw new Error(i18n.t('auth.invalidEmail'));
    }

    if (isOffline) {
      // Lógica de fallback para AsyncStorage
      console.log('Login em modo OFFLINE');
      const storedUsers = await AsyncStorage.getItem('@mottu:users_local');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const foundUser = users.find((u: User) => u.email === email);

      if (foundUser) { 
        return {
          user: foundUser,
          token: `local-token-for-${foundUser.id}`,
        };
      } else {
        throw new Error(i18n.t('auth.loginError'));
      }
    } else {
      const response = await api.post('/auth/login', { email, password });
      return normalizeAuthResponse(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return Promise.reject(new Error(i18n.t('auth.loginError')));
    // Centraliza todo o tratamento de erro, incluindo rede
    if (error instanceof Error && !isOffline) {
       return Promise.reject(await handleApiError(error, setApiOffline));
    }
    throw error;
  }
};

//Registra um novo usuário via API.

export const registerUser = async (
  name: string, 
  email: string, 
  password: string,
  isOffline: boolean,
  setApiOffline: () => void
): Promise<AuthResponse> => {
  try {
    // Validações antes da requisição
    if (!name || !email || !password) {
      throw new Error(i18n.t('common.allFieldsRequired'));
    }

    if (name.length < 2) {
      throw new Error(i18n.t('auth.nameTooShort'));
    }

    if (!isValidEmail(email)) {
      throw new Error(i18n.t('auth.invalidEmail'));
    }

    if (!isPasswordStrong(password)) {
      throw new Error(i18n.t('auth.passwordWeak'));
    }

    if (isOffline) {
      // Lógica de fallback para AsyncStorage
      console.log('Registro em modo OFFLINE');
      const newUser: User = { id: `local_${Date.now()}`, name, email };
      const storedUsers = await AsyncStorage.getItem('@mottu:users_local');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Verifica se o email já existe localmente
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        throw new Error(i18n.t('auth.registerConflict'));
      }

      users.push(newUser);
      await AsyncStorage.setItem('@mottu:users_local', JSON.stringify(users));
      return {
        user: newUser,
        token: `local-token-for-${newUser.id}`,
      };
    } else {
      const response = await api.post('/auth/register', { name, email, password });
      return normalizeAuthResponse(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) return Promise.reject(new Error(i18n.t('auth.registerConflict')));
    // Centraliza todo o tratamento de erro, incluindo rede
    if (error instanceof Error && !isOffline) {
      return Promise.reject(await handleApiError(error, setApiOffline));
    }
    throw error;
  }
};

//Encerra a sessão do usuário no servidor.
 
export const logoutUser = async (
  token: string,
  isOffline: boolean,
  setApiOffline: () => void
): Promise<void> => {
  try {
    await api.get('/auth/logout');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn(i18n.t('auth.logoutFromServerFail'));
      await handleApiError(error, setApiOffline);
    }
  }
};