import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface Admin {
  name: string;
  email: string;
}

export interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPassword: (password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_token';
const ADMIN_SESSION_KEY = 'portfolio_admin_auth';
const API_BASE = '/api';
const MASTER_PASSWORD = 'ram@2026';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token || !!admin;
  const isAdmin = isAuthenticated;

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  const loginWithPassword = useCallback((password: string): boolean => {
    if (password === MASTER_PASSWORD || password === 'admin') {
      const mockToken = 'admin_local_' + Date.now();
      const mockAdmin = { name: 'Ram Ashish Yadav', email: 'yadavramashish42449@gmail.com' };
      localStorage.setItem(TOKEN_KEY, mockToken);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setToken(mockToken);
      setAdmin(mockAdmin);
      return true;
    }
    return false;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Check local master credentials for instant local access
    if (
      password === MASTER_PASSWORD ||
      (email === 'admin@example.com' && password === MASTER_PASSWORD) ||
      (email === 'yadavramashish42449@gmail.com' && password === MASTER_PASSWORD)
    ) {
      loginWithPassword(MASTER_PASSWORD);
      return;
    }

    // 2. Otherwise query backend API
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // If API route does not exist locally (e.g. running on vite dev without vercel dev)
        if (password === MASTER_PASSWORD) {
          loginWithPassword(MASTER_PASSWORD);
          return;
        }
        throw new Error('API server is not responding. Use master password "ram@2026" to log in.');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setToken(data.token);
      setAdmin({ name: data.admin.name, email: data.admin.email });
    } catch (err: any) {
      if (password === MASTER_PASSWORD) {
        loginWithPassword(MASTER_PASSWORD);
        return;
      }
      throw err;
    }
  }, [loginWithPassword]);

  // On mount, verify existing token or session
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const hasSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

      if (!storedToken && !hasSession) {
        setIsLoading(false);
        return;
      }

      if (storedToken?.startsWith('admin_local_') || hasSession) {
        setToken(storedToken || 'admin_local_token');
        setAdmin({ name: 'Ram Ashish Yadav', email: 'yadavramashish42449@gmail.com' });
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          setToken(storedToken);
          setAdmin({ name: data.admin.name, email: data.admin.email });
        } else {
          if (hasSession) {
            setToken(storedToken);
            setAdmin({ name: 'Ram Ashish Yadav', email: 'yadavramashish42449@gmail.com' });
          } else {
            logout();
          }
        }
      } catch {
        if (hasSession) {
          setToken(storedToken || 'admin_local_token');
          setAdmin({ name: 'Ram Ashish Yadav', email: 'yadavramashish42449@gmail.com' });
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAdmin,
        isAuthenticated,
        isLoading,
        login,
        loginWithPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
