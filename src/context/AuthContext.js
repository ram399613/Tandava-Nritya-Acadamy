'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/profile');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {

          const localUser = localStorage.getItem('dance_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          }
        }
      } catch (err) {
        const localUser = localStorage.getItem('dance_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    setUser(data.user);
    localStorage.setItem('dance_user', JSON.stringify(data.user));

    if (data.user.role === 'admin') router.push('/admin');
    else if (data.user.role === 'instructor') router.push('/instructor');
    else router.push('/student');

    return data;
  };

  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    setUser(data.user);
    localStorage.setItem('dance_user', JSON.stringify(data.user));

    if (data.user.role === 'admin') router.push('/admin');
    else if (data.user.role === 'instructor') router.push('/instructor');
    else router.push('/student');

    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    setUser(null);
    localStorage.removeItem('dance_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
