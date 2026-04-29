// ============================================================
//  TaskFlow – AuthContext.jsx
//  Manages logged-in user state and JWT token.
//  Wraps the whole app so any component can call useAuth().
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session
  const [error,   setError]   = useState(null);

  // ── On mount: restore session from saved token ─────────────
  useEffect(() => {
    const token = localStorage.getItem('tf_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.me()
      .then(data => setUser(data.user))
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem('tf_token');
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    const data = await authApi.login(email, password); // throws on error
    localStorage.setItem('tf_token', data.token);
    setUser(data.user);
  }, []);

  // ── Register ───────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setError(null);
    const data = await authApi.register(name, email, password);
    localStorage.setItem('tf_token', data.token);
    setUser(data.user);
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook — use this in any component: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
