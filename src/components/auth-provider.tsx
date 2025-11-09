// FILE: src/components/auth-provider.tsx
"use client";

import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect, ReactNode } from "react";

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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
      
      if (storedToken) {
        const decoded: any = jwtDecode(storedToken);
        setUser({
          userId: decoded.sub,
          email: decoded.email,
          tenantId: decoded.tenantId,
          role: decoded.role,
        });
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Auth provider error", e);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
