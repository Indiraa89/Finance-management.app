/**
 * Общие типы FinWise.
 * Используются и сервером (server/), и клиентом (client/) — так API и интерфейс
 * всегда говорят на одном «языке». Здесь только типы, без кода, который выполняется.
 */

export type ID = string;

/** Тип операции: доход или расход */
export type TransactionType = 'income' | 'expense';

/** Ключ иконки. Клиент сопоставляет ключ с конкретной иконкой. */
export type IconKey =
  | 'salary'
  | 'food'
  | 'transport'
  | 'medicine'
  | 'groceries'
  | 'rent'
  | 'gifts'
  | 'savings'
  | 'entertainment'
  | 'travel'
  | 'house'
  | 'car'
  | 'wedding'
  | 'other'
  | 'education'
  | 'sport'
  | 'shopping'
  | 'pets';

export type Currency = 'KZT' | 'USD' | 'EUR' | 'RUB';

/* ---------- Пользователь ---------- */

export interface User {
  id: ID;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string; // YYYY-MM-DD
  budgetLimit: number; // месячный лимит расходов
  hasPin: boolean;
  fingerprintEnabled: boolean;
  avatarColor: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterBody {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ForgotPasswordResponse {
  message: string;
  /** Учебный режим: настоящей почты нет, поэтому код приходит прямо в ответе */
  demoCode: string;
}

export interface VerifyCodeResponse {
  resetToken: string;
}

export interface ResetPasswordBody {
  resetToken: string;
  password: string;
}

export interface UpdateProfileBody {
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  budgetLimit?: number;
  avatarColor?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

/* ---------- Категории и транзакции ---------- */

export interface Category {
  id: ID;
  name: string;
  icon: IconKey;
  type: TransactionType;
  /** true — категория создана пользователем */
  custom: boolean;
}

export interface NewCategoryBody {
  name: string;
  icon?: IconKey;
  type?: TransactionType;
}

export interface Transaction {
  id: ID;
  title: string;
  amount: number; // всегда положительное число
  type: TransactionType;
  categoryId: ID;
  date: string; // ISO
  note: string;
}

export interface NewTransactionBody {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: ID;
  date: string;
  note?: string;
}

export interface TransactionQuery {
  type?: TransactionType;
  categoryId?: ID;
  from?: string;
  to?: string;
  q?: string;
  limit?: number;
}

/* ---------- Аналитика ---------- */

export interface Summary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthIncome: number;
  monthExpense: number;
  budgetLimit: number;
  /** Процент расходов месяца от лимита (0–100+) */
  expensePercent: number;
  revenueLastWeek: number;
  foodLastWeek: number;
  /** Прогресс главной цели накоплений, 0–100 */
  savingsProgress: number;
  savingsGoalName: string;
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ChartPoint {
  label: string;
  income: number;
  expense: number;
}

export interface Analytics {
  period: Period;
  points: ChartPoint[];
  income: number;
  expense: number;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
}

export interface CategoryShare {
  categoryId: ID;
  name: string;
  icon: IconKey;
  amount: number;
  percent: number;
}

export interface CalendarData {
  month: string; // YYYY-MM
  days: CalendarDay[];
  byCategory: CategoryShare[];
}

export interface QuickAnalysis {
  title: string; // например «Расходы за апрель»
  points: ChartPoint[];
  savingsProgress: number;
  savingsGoalName: string;
  revenueLastWeek: number;
  foodLastWeek: number;
}

/* ---------- Цели накоплений ---------- */

export interface GoalDeposit {
  id: ID;
  amount: number;
  date: string;
}

export interface Goal {
  id: ID;
  name: string;
  icon: IconKey;
  target: number;
  saved: number;
  deposits: GoalDeposit[];
}

export interface NewGoalBody {
  name: string;
  icon?: IconKey;
  target: number;
}

export interface DepositBody {
  amount: number;
  date?: string;
}

/* ---------- Уведомления ---------- */

export type NotificationKind = 'reminder' | 'update' | 'transaction' | 'expense';

export interface AppNotification {
  id: ID;
  kind: NotificationKind;
  title: string;
  text: string;
  date: string;
  read: boolean;
}

/* ---------- Настройки ---------- */

export interface NotificationSettings {
  general: boolean;
  sound: boolean;
  soundCall: boolean;
  vibrate: boolean;
  transactionUpdates: boolean;
  expenseReminder: boolean;
  budgetNotifications: boolean;
  lowBalance: boolean;
}

export interface Settings {
  notifications: NotificationSettings;
  currency: Currency;
  fingerprints: { id: ID; name: string }[];
}

export interface UpdateSettingsBody {
  notifications?: Partial<NotificationSettings>;
  currency?: Currency;
  fingerprintEnabled?: boolean;
  addFingerprint?: string;
  removeFingerprintId?: ID;
}

export interface ChangePinBody {
  currentPin?: string;
  newPin: string;
}

/* ---------- Помощь ---------- */

export interface FaqItem {
  id: ID;
  group: 'general' | 'account' | 'services';
  question: string;
  answer: string;
}

export interface SupportMessage {
  id: ID;
  from: 'user' | 'support';
  text: string;
  date: string;
}

/* ---------- Ошибки ---------- */

export interface ApiError {
  error: string;
  details?: unknown;
}
