import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { ApiError } from '@finwise/shared';

/**
 * Адрес нашего API (папка server/, порт 4000).
 * - В браузере (expo web) — localhost.
 * - На телефоне в Expo Go — IP компьютера, на котором запущен `npm run dev`
 *   (Expo сам знает этот адрес: hostUri).
 * - Можно задать вручную переменной EXPO_PUBLIC_API_URL.
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;
  if (Platform.OS === 'web') return 'http://localhost:4000/api';
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:4000/api`;
  return Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';
}

export const BASE_URL = resolveBaseUrl();

const TOKEN_KEY = 'finwise.token';

/** Токен держим в памяти и в AsyncStorage (хранилище телефона) */
let tokenCache: string | null = null;

export const tokenStorage = {
  get: (): string | null => tokenCache,
  async load(): Promise<string | null> {
    try {
      tokenCache = await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      tokenCache = null;
    }
    return tokenCache;
  },
  async set(token: string) {
    tokenCache = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* хранилище недоступно — токен останется только в памяти */
    }
  },
  async clear() {
    tokenCache = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ничего страшного */
    }
  },
};

/** Ошибка, которую вернул сервер, с понятным текстом на русском */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Слушатели «сессия закончилась» (401) — их подключает AuthContext */
const unauthorizedListeners = new Set<() => void>();
export const onUnauthorized = (fn: () => void) => {
  unauthorizedListeners.add(fn);
  return () => {
    unauthorizedListeners.delete(fn);
  };
};

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new HttpError(
      0,
      `Нет связи с сервером (${BASE_URL}). Запущен ли API командой npm run dev и подключён ли телефон к той же Wi-Fi сети?`,
    );
  }

  if (response.status === 204) return undefined as T;

  const data = (await response.json().catch(() => null)) as T | ApiError | null;

  if (!response.ok) {
    if (response.status === 401 && token) unauthorizedListeners.forEach((fn) => fn());
    const message = (data as ApiError | null)?.error ?? `Ошибка ${response.status}`;
    throw new HttpError(response.status, message);
  }
  return data as T;
}

/** Собрать query-строку, пропуская пустые значения */
export function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return `?${entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')}`;
}
