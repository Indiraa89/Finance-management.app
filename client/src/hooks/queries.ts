import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  DepositBody,
  NewCategoryBody,
  NewGoalBody,
  NewTransactionBody,
  Period,
  TransactionQuery,
  UpdateSettingsBody,
} from '@finwise/shared';
import {
  analyticsApi,
  categoriesApi,
  goalsApi,
  helpApi,
  notificationsApi,
  settingsApi,
  transactionsApi,
} from '@/api';

/**
 * Хуки для загрузки данных через TanStack Query:
 * кэш, повторные запросы и автообновление экранов после изменений.
 */

export const keys = {
  summary: ['summary'] as const,
  transactions: (q: TransactionQuery = {}) => ['transactions', q] as const,
  categories: ['categories'] as const,
  analytics: (p: Period) => ['analytics', p] as const,
  quick: ['analytics', 'quick'] as const,
  calendar: (m: string) => ['analytics', 'calendar', m] as const,
  goals: ['goals'] as const,
  goal: (id: string) => ['goals', id] as const,
  notifications: ['notifications'] as const,
  settings: ['settings'] as const,
  faq: ['faq'] as const,
  messages: ['messages'] as const,
};

/* ---------- Чтение ---------- */

export const useSummary = () => useQuery({ queryKey: keys.summary, queryFn: analyticsApi.summary });

export const useTransactions = (q: TransactionQuery = {}) =>
  useQuery({ queryKey: keys.transactions(q), queryFn: () => transactionsApi.list(q) });

export const useCategories = () =>
  useQuery({ queryKey: keys.categories, queryFn: categoriesApi.list, staleTime: 60_000 });

export const useAnalytics = (period: Period) =>
  useQuery({ queryKey: keys.analytics(period), queryFn: () => analyticsApi.byPeriod(period) });

export const useQuickAnalysis = () => useQuery({ queryKey: keys.quick, queryFn: analyticsApi.quick });

export const useCalendar = (month: string) =>
  useQuery({ queryKey: keys.calendar(month), queryFn: () => analyticsApi.calendar(month) });

export const useGoals = () => useQuery({ queryKey: keys.goals, queryFn: goalsApi.list });

export const useGoal = (id: string) =>
  useQuery({ queryKey: keys.goal(id), queryFn: () => goalsApi.get(id), enabled: Boolean(id) });

export const useNotifications = () =>
  useQuery({ queryKey: keys.notifications, queryFn: notificationsApi.list });

export const useSettings = () => useQuery({ queryKey: keys.settings, queryFn: settingsApi.get });

export const useFaq = () => useQuery({ queryKey: keys.faq, queryFn: helpApi.faq, staleTime: Infinity });

export const useSupportMessages = () =>
  useQuery({ queryKey: keys.messages, queryFn: helpApi.messages });

/* ---------- Изменение ---------- */

/** После изменения денег обновляем всё, что от них зависит */
function useInvalidateMoney() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ['summary'] }),
      qc.invalidateQueries({ queryKey: ['transactions'] }),
      qc.invalidateQueries({ queryKey: ['analytics'] }),
      qc.invalidateQueries({ queryKey: ['goals'] }),
      qc.invalidateQueries({ queryKey: ['notifications'] }),
    ]);
}

export function useCreateTransaction() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (body: NewTransactionBody) => transactionsApi.create(body),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: invalidate,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NewCategoryBody) => categoriesApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.categories }),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NewGoalBody) => goalsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.goals }),
  });
}

export function useDeposit(goalId: string) {
  const invalidate = useInvalidateMoney();
  return useMutation({
    mutationFn: (body: DepositBody) => goalsApi.deposit(goalId, body),
    onSuccess: invalidate,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.notifications }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.notifications }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsBody) => settingsApi.update(body),
    onSuccess: (data) => qc.setQueryData(keys.settings, data.settings),
  });
}

export function useSendSupportMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => helpApi.send(text),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.messages }),
  });
}
