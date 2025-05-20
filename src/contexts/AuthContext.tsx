
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties if available from API
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email_form: string, password_form: string) => Promise<void>;
  register: (name_form: string, email_form: string, password_form: string, password_confirmation_form: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadAuthData = useCallback(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Gagal memuat data otentikasi dari localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const currentToken = localStorage.getItem('authToken'); // Always get fresh token
    const headers = new Headers(options.headers || {});
    if (currentToken) {
      headers.append('Authorization', `Bearer ${currentToken}`);
    }
    headers.append('Accept', 'application/json');

    // Do not set Content-Type if body is FormData, browser will do it with correct boundary
    if (!(options.body instanceof FormData)) {
      headers.append('Content-Type', 'application/json');
    }

    return fetch(url, { ...options, headers });
  }, []);


  const login = async (email_form: string, password_form: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email_form, password: password_form }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      toast({ title: 'Sukses', description: 'Login berhasil!' });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({ title: 'Error', description: error.message || 'Terjadi kesalahan.', variant: 'destructive' });
      throw error;
    }
  };

  const register = async (name_form: string, email_form: string, password_form: string, password_confirmation_form: string) => {
     try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name: name_form, email: email_form, password: password_form, password_confirmation: password_confirmation_form }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) { // Validation errors
          const errorMessages = Object.values(data.errors).flat().join(' ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Registrasi gagal');
      }
      
      toast({ title: 'Sukses', description: 'Registrasi berhasil! Silakan masuk.' });
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({ title: 'Error', description: error.message || 'Terjadi kesalahan.', variant: 'destructive' });
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
         await fetchWithAuth(`${API_BASE_URL}/logout`, { method: 'POST' });
      }
    } catch (error: any) {
      console.error('Logout API call failed, proceeding with client-side logout:', error);
      toast({ title: 'Info Logout', description: 'Tidak dapat menghubungi server, keluar secara lokal.', variant: 'default' });
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      toast({ title: 'Keluar', description: 'Anda telah berhasil keluar.' });
      router.push('/login');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
