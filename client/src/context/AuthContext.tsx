import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LoginBody, RegisterBody, User } from '@finwise/shared';
import { authApi } from '@/api';
import { onUnauthorized, tokenStorage } from '@/api/http';

/** Токен, сохранённый для входа по отпечатку после выхода */
const FINGERPRINT_KEY = 'finwise.fingerprintToken';
const ONBOARDING_KEY = 'finwise.onboardingDone';

interface AuthState {
  user: User | null;
  /** true, пока при запуске проверяем сохранённый токен */
  loading: boolean;
  onboardingDone: boolean;
  finishOnboarding: () => void;
  /** Есть ли сохранённая сессия для входа по отпечатку */
  fingerprintAvailable: boolean;
  login: (body: LoginBody) => Promise<User>;
  register: (body: RegisterBody) => Promise<User>;
  loginWithFingerprint: () => Promise<User>;
  logout: (opts?: { forget?: boolean }) => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthState | null>(null);

async function safeGet(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function safeSet(key: string, value: string | null): Promise<void> {
  try {
    if (value === null) await AsyncStorage.removeItem(key);
    else await AsyncStorage.setItem(key, value);
  } catch {
    /* хранилище недоступно */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);

  // При запуске: читаем сохранённый токен и узнаём, кто вошёл
  useEffect(() => {
    (async () => {
      setOnboardingDone((await safeGet(ONBOARDING_KEY)) === '1');
      setFingerprintAvailable(Boolean(await safeGet(FINGERPRINT_KEY)));
      const token = await tokenStorage.load();
      if (token) {
        try {
          setUser(await authApi.me());
        } catch {
          await tokenStorage.clear();
        }
      }
      setLoading(false);
    })();
  }, []);

  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Сервер ответил 401 — сессия закончилась
  useEffect(() => onUnauthorized(() => void clearSession()), [clearSession]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      onboardingDone,
      fingerprintAvailable,
      setUser,
      finishOnboarding() {
        setOnboardingDone(true);
        void safeSet(ONBOARDING_KEY, '1');
      },
      async login(body) {
        const res = await authApi.login(body);
        await tokenStorage.set(res.token);
        setUser(res.user);
        return res.user;
      },
      async register(body) {
        const res = await authApi.register(body);
        await tokenStorage.set(res.token);
        setUser(res.user);
        return res.user;
      },
      async loginWithFingerprint() {
        const saved = await safeGet(FINGERPRINT_KEY);
        if (!saved) throw new Error('Сначала войдите с паролем и включите отпечаток в настройках');
        await tokenStorage.set(saved);
        try {
          const res = await authApi.fingerprint();
          await tokenStorage.set(res.token);
          setUser(res.user);
          return res.user;
        } catch (e) {
          await tokenStorage.clear();
          await safeSet(FINGERPRINT_KEY, null);
          setFingerprintAvailable(false);
          throw e;
        }
      },
      async logout(opts) {
        // Если включён отпечаток — запоминаем токен, чтобы войти без пароля
        const token = tokenStorage.get();
        const keep = !opts?.forget && user?.fingerprintEnabled && token;
        await safeSet(FINGERPRINT_KEY, keep ? token : null);
        setFingerprintAvailable(Boolean(keep));
        await clearSession();
      },
    }),
    [user, loading, onboardingDone, fingerprintAvailable, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth нужно использовать внутри <AuthProvider>');
  return ctx;
}
