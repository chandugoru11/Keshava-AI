
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, AuthState, JWTPayload } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    let base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    const jsonPayload = decodeURIComponent(
      window.atob(paddedBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const normalizeRole = (payload: JWTPayload): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'ADMIN': UserRole.ADMIN,
    'ROLE_ADMIN': UserRole.ADMIN,
    'STUDENT': UserRole.STUDENT,
    'ROLE_STUDENT': UserRole.STUDENT,
    'HR': UserRole.HR,
    'ROLE_HR': UserRole.HR,
    'TRAINER': UserRole.TRAINER,
    'ROLE_TRAINER': UserRole.TRAINER
  };

  const extract = (val: any): UserRole | null => {
    if (typeof val === 'string') {
      const upper = val.toUpperCase();
      return roleMap[upper] || null;
    }
    if (val && typeof val === 'object' && val.authority) {
      return extract(val.authority);
    }
    return null;
  };

  // 1. Check authorities (Standard Spring Security format)
  if (payload.authorities && Array.isArray(payload.authorities)) {
    for (const auth of payload.authorities) {
      const found = extract(auth);
      if (found) return found;
    }
  }

  // 2. Check direct role/roles strings
  if (payload.role) {
    const found = extract(payload.role);
    if (found) return found;
  }

  if (payload.roles && Array.isArray(payload.roles)) {
    for (const r of payload.roles) {
      const found = extract(r);
      if (found) return found;
    }
  }

  return UserRole.USER;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const payload = decodeJWT(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        const role = normalizeRole(payload);
        setState({
          user: {
            id: payload.id || payload.sub,
            username: payload.sub,
            role,
            token,
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } else {
        localStorage.removeItem('jwt_token');
      }
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = (token: string) => {
    const payload = decodeJWT(token);
    if (!payload) return;

    localStorage.setItem('jwt_token', token);
    const role = normalizeRole(payload);
    
    setState({
      user: {
        id: payload.id || payload.sub,
        username: payload.sub,
        role,
        token,
      },
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
