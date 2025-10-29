import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Requisição:
 * Adiciona o token de autenticação a todas as requisições, se disponível.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('@mottu:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta:
 * Centraliza o tratamento de erros da API.
 * O `handleApiError` será chamado a partir daqui.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Retorna a resposta em caso de sucesso
  (error: AxiosError) => {
    return Promise.reject(error); // Rejeita a promise para que o erro seja tratado no `catch` da chamada
  }
);

export default api;
