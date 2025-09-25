import { API_BASE_URL } from '@/context/config';
import { User } from '@/types';

/** Serviço para autenticação de usuários via API. */

interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Autentica um usuário via API.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Credenciais inválidas ou erro no servidor.' }));
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * Registra um novo usuário via API.
 * @param name O nome do usuário.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Não foi possível criar a conta.' }));
    throw new Error(errorData.message);
  }

  return response.json();
};

/**
 * Encerra a sessão do usuário no servidor.
 * @param token O token de autenticação.
 */
export const logoutUser = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Mesmo que o logout na API falhe, o app deve prosseguir com o logout local.
      console.warn('Falha ao invalidar a sessão no servidor, mas o logout local prosseguirá.');
    }
  } catch (error) {
    // Se houver um erro de rede, o logout local também deve prosseguir.
    console.error('Erro de rede ao tentar fazer logout no servidor:', error);
  }
};
