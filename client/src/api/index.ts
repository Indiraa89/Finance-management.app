import type {
  Analytics,
  AppNotification,
  AuthResponse,
  CalendarData,
  Category,
  ChangePasswordBody,
  ChangePinBody,
  DepositBody,
  FaqItem,
  ForgotPasswordResponse,
  Goal,
  LoginBody,
  NewCategoryBody,
  NewGoalBody,
  NewTransactionBody,
  Period,
  QuickAnalysis,
  RegisterBody,
  ResetPasswordBody,
  Settings,
  Summary,
  SupportMessage,
  Transaction,
  TransactionQuery,
  UpdateProfileBody,
  UpdateSettingsBody,
  User,
  VerifyCodeResponse,
} from '@finwise/shared';
import { qs, request } from './http';

/**
 * Все запросы к FinWise API в одном месте.
 * Каждая функция = один эндпоинт сервера (server/src/routes).
 */

export const authApi = {
  register: (body: RegisterBody) => request<AuthResponse>('POST', '/auth/register', body),
  login: (body: LoginBody) => request<AuthResponse>('POST', '/auth/login', body),
  me: () => request<User>('GET', '/auth/me'),
  forgotPassword: (email: string) =>
    request<ForgotPasswordResponse>('POST', '/auth/forgot-password', { email }),
  verifyCode: (email: string, code: string) =>
    request<VerifyCodeResponse>('POST', '/auth/verify-code', { email, code }),
  resetPassword: (body: ResetPasswordBody) =>
    request<{ message: string }>('POST', '/auth/reset-password', body),
  fingerprint: () => request<AuthResponse>('POST', '/auth/fingerprint'),
};

export const profileApi = {
  update: (body: UpdateProfileBody) => request<User>('PUT', '/profile', body),
  changePassword: (body: ChangePasswordBody) =>
    request<{ message: string }>('PUT', '/profile/password', body),
  changePin: (body: ChangePinBody) => request<{ message: string }>('PUT', '/profile/pin', body),
  verifyPin: (pin: string) => request<{ ok: true }>('POST', '/profile/verify-pin', { pin }),
  remove: (password: string) => request<{ message: string }>('DELETE', '/profile', { password }),
};

export const transactionsApi = {
  list: (query: TransactionQuery = {}) =>
    request<Transaction[]>('GET', `/transactions${qs({ ...query })}`),
  create: (body: NewTransactionBody) => request<Transaction>('POST', '/transactions', body),
  update: (id: string, body: Partial<NewTransactionBody>) =>
    request<Transaction>('PUT', `/transactions/${id}`, body),
  remove: (id: string) => request<void>('DELETE', `/transactions/${id}`),
};

export const categoriesApi = {
  list: () => request<Category[]>('GET', '/categories'),
  create: (body: NewCategoryBody) => request<Category>('POST', '/categories', body),
  remove: (id: string) => request<void>('DELETE', `/categories/${id}`),
};

export const analyticsApi = {
  summary: () => request<Summary>('GET', '/summary'),
  byPeriod: (period: Period) => request<Analytics>('GET', `/analytics${qs({ period })}`),
  quick: () => request<QuickAnalysis>('GET', '/analytics/quick'),
  calendar: (month: string) => request<CalendarData>('GET', `/analytics/calendar${qs({ month })}`),
};

export const goalsApi = {
  list: () => request<Goal[]>('GET', '/goals'),
  get: (id: string) => request<Goal>('GET', `/goals/${id}`),
  create: (body: NewGoalBody) => request<Goal>('POST', '/goals', body),
  deposit: (id: string, body: DepositBody) => request<Goal>('POST', `/goals/${id}/deposit`, body),
};

export const notificationsApi = {
  list: () => request<AppNotification[]>('GET', '/notifications'),
  markRead: (id: string) => request<{ ok: true }>('PATCH', `/notifications/${id}/read`),
  markAllRead: () => request<{ ok: true }>('POST', '/notifications/read-all'),
};

export const settingsApi = {
  get: () => request<Settings>('GET', '/settings'),
  update: (body: UpdateSettingsBody) =>
    request<{ settings: Settings; user: User }>('PUT', '/settings', body),
};

export const helpApi = {
  faq: () => request<FaqItem[]>('GET', '/help/faq'),
  messages: () => request<SupportMessage[]>('GET', '/help/messages'),
  send: (text: string) => request<SupportMessage[]>('POST', '/help/messages', { text }),
};
