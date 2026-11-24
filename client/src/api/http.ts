import type { ApiError } from '@finwise/shared';

/**
 * Базовый HTTP-клиент для нашего API.
 * В режиме разработки Vite проксирует /api на http://localhost:4000 (см. vite.config.ts).
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const TOKEN_KEY = 'finwise.token';

export const tokenStorage = {
  get: (): string | null => safe(() => localStorage.getItem(TOKEN_KEY)),
  set: (token: string) => safe(() => localStorage.setItem(TOKEN_KEY, token)),
  clear: () => safe(() => localStorage.removeItem(TOKEN_KEY)),
};

function safe<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

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
    throw new HttpError(0, 'Нет связи с сервером. Запущен ли API (npm run dev)?');
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
  return `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`;
}
