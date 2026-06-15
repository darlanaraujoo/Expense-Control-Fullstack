import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authStorage, login as loginRequest, persistAuthSession } from '../services/api';
import type { AuthUser, LoginCredentials } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseStoredUser(): AuthUser | null {
  const raw = authStorage.getUser();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(parseStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(authStorage.isAuthenticated);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials);
    persistAuthSession(response);
    setUser(response.user ?? null);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
