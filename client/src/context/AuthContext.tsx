import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LoginBody, RegisterBody, User } from '@finwise/shared';
import { authApi } from '@/api';
import { onUnauthorized, tokenStorage } from '@/api/http';

/** Токен, сохранённый для входа по отпечатку после выхода */
const FINGERPRINT_KEY = 'finwise.fingerprintToken';

interface AuthState {
  user: User | null;
  /** true, пока при запуске проверяем сохранённый токен */
  loading: boolean;
  login: (body: LoginBody) => Promise<User>;
  register: (body: RegisterBody) => Promise<User>;
  loginWithFingerprint: () => Promise<User>;
  canUseFingerprint: () => boolean;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function readFingerprintToken(): string | null {
  try {
    return localStorage.getItem(FINGERPRINT_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(tokenStorage.get()));

  // При запуске: если есть токен — узнаём, кто вошёл
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Сервер ответил 401 — сессия закончилась
  useEffect(() => onUnauthorized(clearSession), [clearSession]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      setUser,
      async login(body) {
        const res = await authApi.login(body);
        tokenStorage.set(res.token);
        setUser(res.user);
        return res.user;
      },
      async register(body) {
        const res = await authApi.register(body);
        tokenStorage.set(res.token);
        setUser(res.user);
        return res.user;
      },
      canUseFingerprint: () => Boolean(readFingerprintToken()),
      async loginWithFingerprint() {
        const saved = readFingerprintToken();
        if (!saved) throw new Error('Сначала войдите с паролем и включите отпечаток в настройках');
        tokenStorage.set(saved);
        try {
          const res = await authApi.fingerprint();
          tokenStorage.set(res.token);
          setUser(res.user);
          return res.user;
        } catch (e) {
          tokenStorage.clear();
          try {
            localStorage.removeItem(FINGERPRINT_KEY);
          } catch {
            /* хранилище недоступно */
          }
          throw e;
        }
      },
      logout() {
        // Если включён отпечаток — запоминаем токен, чтобы войти без пароля
        const token = tokenStorage.get();
        try {
          if (user?.fingerprintEnabled && token) localStorage.setItem(FINGERPRINT_KEY, token);
          else localStorage.removeItem(FINGERPRINT_KEY);
        } catch {
          /* хранилище недоступно */
        }
        clearSession();
      },
    }),
    [user, loading, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно использовать внутри <AuthProvider>');
  return ctx;
}
