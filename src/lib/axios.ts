import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from './service/auth.service';

export const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
); 