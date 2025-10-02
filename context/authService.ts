import { API_BASE_URL} from '@/context/config';
import { User } from '@/types';
import { handleApiError } from '@/hooks/apiErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Serviço para autenticação de usuários via API. */

interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Valida formato de email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida força da senha
 */
const isPasswordStrong = (password: string): boolean => {
  // Requisito: mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo.
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Autentica um usuário via API.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
export const loginUser = async (
  email: string, 
  password: string,
  isOffline: boolean,
  setApiOffline: () => void
): Promise<AuthResponse> => {
  try {
    // Validações básicas antes de fazer a requisição
    if (!email || !password) {
      throw new Error('Por favor, preencha todos os campos.');
    }

    if (!isValidEmail(email)) {
      throw new Error('Por favor, insira um email válido.');
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
        throw new Error('Usuário não encontrado no modo offline.');
      }
    } else {
      // Lógica para a API Real
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw await handleApiError(response, setApiOffline, { 401: 'Email ou senha incorretos.' });
      }

      return response.json();
    }
  } catch (error) {
    // Centraliza todo o tratamento de erro, incluindo rede
    if (error instanceof Error && !isOffline) {
       return Promise.reject(await handleApiError(error, setApiOffline));
    }
    throw error;
  }
};

/**
 * Registra um novo usuário via API.
 * @param name O nome do usuário.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
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
      throw new Error('Por favor, preencha todos os campos.');
    }

    if (name.length < 2) {
      throw new Error('O nome deve ter pelo menos 2 caracteres.');
    }

    if (!isValidEmail(email)) {
      throw new Error('Por favor, insira um email válido.');
    }

    if (!isPasswordStrong(password)) {
      throw new Error('A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo ($*&@#).');
    }

    if (isOffline) {
      // Lógica de fallback para AsyncStorage
      console.log('Registro em modo OFFLINE');
      const newUser: User = { id: `local_${Date.now()}`, name, email };
      const storedUsers = await AsyncStorage.getItem('@mottu:users_local');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Verifica se o email já existe localmente
      if (users.some((u: User) => u.email === email)) {
        throw new Error('Este email já está cadastrado localmente.');
      }

      users.push(newUser);
      await AsyncStorage.setItem('@mottu:users_local', JSON.stringify(users));

      return {
        user: newUser,
        token: `local-token-for-${newUser.id}`,
      };
    } else {
      // Lógica para a API Real
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw await handleApiError(response, setApiOffline, { 409: 'Este email já está cadastrado.' });
      }

      return response.json();
    }
  } catch (error) {
    // Centraliza todo o tratamento de erro, incluindo rede
    if (error instanceof Error && !isOffline) {
      return Promise.reject(await handleApiError(error, setApiOffline));
    }
    throw error;
  }
};

/**
 * Encerra a sessão do usuário no servidor.
 * @param token O token de autenticação.
 */
export const logoutUser = async (
  token: string,
  isOffline: boolean,
  setApiOffline: () => void
): Promise<void> => {
  try {
    // Lógica para a API Real
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('Falha ao invalidar sessão no servidor, mas o logout local prosseguirá.');
    }
  } catch (error) {
    // Não lança erro para não impedir o logout local, mas registra o erro de rede
    if (!isOffline) {
      await handleApiError(error, setApiOffline);
    }
  }
};