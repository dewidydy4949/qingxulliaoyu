import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healing_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/login', { email, password });
  localStorage.setItem('healing_token', data.token);
  return data;
};

export const register = async (email: string, password: string) => {
  const { data } = await api.post('/register', { email, password });
  localStorage.setItem('healing_token', data.token);
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/history');
  return data;
};

export const saveHistory = async (messages: any[]) => {
  const { data } = await api.post('/history', { messages });
  return data;
};
