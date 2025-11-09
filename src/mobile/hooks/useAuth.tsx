// FILE: src/mobile/hooks/useAuth.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getToken, storeToken, deleteToken } from '../lib/auth-storage';
import { jwtDecode } from 'jwt-decode';
import createClient from 'openapi-fetch';
import type { paths } from '../../lib/api-schema';

interface User {
  userId: string;
  email: string;
  tenantId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  api: ReturnType<typeof createClient<paths>>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = createClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
});

api.use({
    async onRequest(req) {
        const token = await getToken();
        if (token) {
            req.headers.set('Authorization', `Bearer ${token}`);
        }
        return req;
    }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          const decoded: any = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              userId: decoded.sub,
              email: decoded.email,
              tenantId: decoded.tenantId,
              role: decoded.role,
            });
            setToken(storedToken);
          } else {
            // Token expired
            await deleteToken();
          }
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
        await deleteToken();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (newToken: string) => {
    await storeToken(newToken);
    const decoded: any = jwtDecode(newToken);
    setUser({
      userId: decoded.sub,
      email: decoded.email,
      tenantId: decoded.tenantId,
      role: decoded.role,
    });
    setToken(newToken);
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
