'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: { github?: string; linkedin?: string; twitter?: string };
}

type Result = { success: boolean; message: string };
interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<Result>;
  signup: (name: string, email: string, password: string) => Promise<Result>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<Result>;
  changePassword: (oldPass: string, newPass: string) => Promise<Result>;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';

function csrfToken() {
  const value = document.cookie.split('; ').find((item) => item.startsWith('draveon_csrf='))?.split('=')[1];
  return value ? decodeURIComponent(value) : undefined;
}

async function api(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(init.method || 'GET')) {
    const token = csrfToken();
    if (token) headers.set('X-CSRF-Token', token);
  }
  return fetch(`${apiBase}${path}`, { ...init, headers, credentials: 'same-origin' });
}

async function message(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null);
  return payload?.detail || fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('draveon_theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    api('/v1/auth/me').then(async (response) => {
      if (response.ok) setUser((await response.json()).user);
    }).catch(() => undefined).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('draveon_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const login = async (email: string, password: string, rememberMe = false): Promise<Result> => {
    const response = await api('/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password, remember_me: rememberMe }) });
    if (!response.ok) return { success: false, message: await message(response, 'Unable to sign in.') };
    setUser((await response.json()).user);
    return { success: true, message: 'Signed in.' };
  };

  const signup = async (name: string, email: string, password: string): Promise<Result> => {
    const response = await api('/v1/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    if (!response.ok) return { success: false, message: await message(response, 'Unable to create your account.') };
    setUser((await response.json()).user);
    return { success: true, message: 'Account created.' };
  };

  const logout = async () => {
    await api('/v1/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<Result> => {
    const response = await api('/v1/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({
        ...data,
        phone: data.phone || undefined,
        company: data.company || undefined,
        role: data.role || undefined,
        bio: data.bio || undefined,
        github: data.socialLinks?.github,
        linkedin: data.socialLinks?.linkedin,
        twitter: data.socialLinks?.twitter,
        socialLinks: undefined,
      }),
    });
    if (!response.ok) return { success: false, message: await message(response, 'Unable to save profile.') };
    setUser((await response.json()).user);
    return { success: true, message: 'Profile saved.' };
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<Result> => {
    const response = await api('/v1/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password: oldPass, new_password: newPass }) });
    return response.ok ? { success: true, message: 'Password updated.' } : { success: false, message: await message(response, 'Unable to change password.') };
  };

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, changePassword, isDarkMode, setIsDarkMode }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
