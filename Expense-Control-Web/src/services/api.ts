import axios from 'axios';
import type { AuthResponse, LoginCredentials } from '../types';

export const TOKEN_KEY = 'ec_token';
export const USER_KEY = 'ec_user';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      authStorage.clear();
    }
    return Promise.reject(error);
  },
);

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser: (): string | null => localStorage.getItem(USER_KEY),

  setUser: (user: AuthResponse['user']): void => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/Users/login', credentials);
  return data;
}

export function persistAuthSession(response: AuthResponse): void {
  authStorage.setToken(response.token);
  if (response.user) {
    authStorage.setUser(response.user);
  }
}
