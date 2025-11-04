import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Adiciona o token de autenticação a todas as requisições, se disponível.
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

//Centraliza o tratamento de erros da API chamando o `handleApiError`.
api.interceptors.response.use(
  (response: AxiosResponse) => response, 
  (error: AxiosError) => {
    return Promise.reject(error); 
  }
);

export default api;
