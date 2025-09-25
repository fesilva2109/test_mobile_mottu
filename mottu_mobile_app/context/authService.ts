import { API_BASE_URL } from './config';
import { User } from '@/types';

// Funções para autenticação de usuários usando API mockada

// Faz login buscando usuário por email e validando senha
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error('Erro ao conectar com o servidor. Verifique sua conexão.');
  }

  const users = await response.json();
  const foundUser = users[0];

  if (!foundUser) {
    throw new Error('Email não encontrado. Verifique suas credenciais.');
  }

  if (foundUser.password !== password) {
    throw new Error('Senha incorreta. Tente novamente.');
  }

  // Retorna os dados do usuário sem a senha
  return { id: foundUser.id, email: foundUser.email, name: foundUser.name };
};

// Registra um novo usuário verificando se o email já existe
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  // Verifica se o email já está em uso
  const checkResponse = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);
  if (!checkResponse.ok) {
    throw new Error('Erro ao verificar disponibilidade do email.');
  }

  const existingUsers = await checkResponse.json();
  if (existingUsers.length > 0) {
    throw new Error('Este email já está cadastrado.');
  }

  // Cria o novo usuário na API mock
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar a conta. Tente novamente mais tarde.');
  }

  const newUser = await response.json();
  return { id: newUser.id, email: newUser.email, name: newUser.name };
};
