'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiFetch } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAccessToken(token);
        return true;
      }
    } catch {}
    return false;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored) {
      fetchMe(stored).then((ok) => {
        if (!ok) localStorage.removeItem('accessToken');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const data = await apiFetch<{ user: User; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setUser(data.user);
    setAccessToken(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
