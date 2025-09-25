import { API_BASE_URL, USE_MOCK_API } from '@/context/config';
import { User } from '@/types';

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
  return password.length >= 6; // Requisito mínimo simplificado
};

/**
 * Autentica um usuário via API.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Validações básicas antes de fazer a requisição
    if (!email || !password) {
      throw new Error('Por favor, preencha todos os campos.');
    }

    if (!isValidEmail(email)) {
      throw new Error('Por favor, insira um email válido.');
    }

    if (USE_MOCK_API) {
      // Lógica para a API de Mock
      console.log('Mock API: Tentando login para:', email);
      
      const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // MockAPI pode retornar 404 quando não há usuários
          throw new Error('Email não encontrado. Verifique se digitou corretamente.');
        } else if (response.status >= 500) {
          throw new Error('Servidor indisponível. Tente novamente em alguns instantes.');
        } else {
          throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
        }
      }

      const users = await response.json();
      const foundUser = users.find((user: any) => user.email === email);

      if (!foundUser) {
        throw new Error('Email não encontrado. Verifique se digitou corretamente.');
      }

      if (foundUser.password !== password) {
        throw new Error('Senha incorreta. Tente novamente.');
      }

      const user: User = { 
        id: foundUser.id, 
        email: foundUser.email, 
        name: foundUser.name 
      };
      
      const token = `mock-token-for-${user.id}-${Date.now()}`;
      console.log('Mock API: Login realizado com sucesso para:', email);

      return { user, token };
    } else {
      // Lógica para a API Real
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Email ou senha incorretos.');
        } else if (response.status === 404) {
          throw new Error('Usuário não encontrado.');
        } else if (response.status >= 500) {
          throw new Error('Servidor indisponível. Tente novamente mais tarde.');
        } else {
          const errorData = await response.json().catch(() => ({ 
            message: 'Erro ao fazer login. Tente novamente.' 
          }));
          throw new Error(errorData.message);
        }
      }

      return response.json();
    }
  } catch (error) {
    if (error instanceof Error) {
      // Se já é um erro tratado, apenas propaga
      throw error;
    }
    
    // Erro de rede ou desconhecido
    console.error('Erro não tratado no login:', error);
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Registra um novo usuário via API.
 * @param name O nome do usuário.
 * @param email O email do usuário.
 * @param password A senha do usuário.
 */
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
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
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }

    if (USE_MOCK_API) {
      // Lógica para a API de Mock
      console.log('Mock API: Tentando registrar:', email);
      
      const checkEmailUrl = `${API_BASE_URL}/users?email=${encodeURIComponent(email)}`;
      const checkResponse = await fetch(checkEmailUrl);

      let existingUsers = [];
      if (checkResponse.ok) {
        existingUsers = await checkResponse.json();
      } else if (checkResponse.status === 404) {
        // Status 404 é normal quando não há usuários
        existingUsers = [];
      } else {
        throw new Error('Erro ao verificar email. Tente novamente.');
      }

      // Verifica se o email já existe
      if (existingUsers.length > 0) {
        throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.');
      }

      // Cria novo usuário
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Servidor indisponível. Tente novamente em alguns instantes.');
        } else {
          throw new Error('Erro ao criar conta. Tente novamente.');
        }
      }

      const newUser = await response.json();
      const token = `mock-token-for-${newUser.id}-${Date.now()}`;
      
      console.log('Mock API: Usuário registrado com sucesso:', email);

      return { 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name 
        }, 
        token 
      };

    } else {
      // Lógica para a API Real
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Este email já está cadastrado.');
        } else if (response.status >= 500) {
          throw new Error('Servidor indisponível. Tente novamente.');
        } else {
          const errorData = await response.json().catch(() => ({ 
            message: 'Erro ao criar conta. Tente novamente.' 
          }));
          throw new Error(errorData.message);
        }
      }

      return response.json();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    console.error('Erro não tratado no registro:', error);
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Encerra a sessão do usuário no servidor.
 * @param token O token de autenticação.
 */
export const logoutUser = async (token: string): Promise<void> => {
  try {
    if (USE_MOCK_API) {
      // Na API de mock, não há endpoint de logout
      console.log('Logout simulado (mock API).');
      return Promise.resolve();
    } else {
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
    }
  } catch (error) {
    console.error('Erro durante logout:', error);
    // Não lança erro para não impedir o logout local
  }
};