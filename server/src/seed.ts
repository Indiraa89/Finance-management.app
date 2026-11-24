import bcrypt from 'bcryptjs';
import type { AppNotification, Category, Goal, IconKey, Transaction, TransactionType } from '@finwise/shared';
import type { Database, Owned, UserRecord } from './db.js';
import { addDays, newId, round2 } from './utils.js';

/**
 * Демо-данные. При первом запуске сервера создаётся пользователь:
 *   e-mail: demo@finwise.kz
 *   пароль: Demo1234
 *   PIN:    123456
 */
export const DEMO_EMAIL = 'demo@finwise.kz';
export const DEMO_PASSWORD = 'Demo1234';
export const DEMO_PIN = '123456';

const DEFAULT_CATEGORIES: { name: string; icon: IconKey; type: TransactionType }[] = [
  { name: 'Еда', icon: 'food', type: 'expense' },
  { name: 'Транспорт', icon: 'transport', type: 'expense' },
  { name: 'Лекарства', icon: 'medicine', type: 'expense' },
  { name: 'Продукты', icon: 'groceries', type: 'expense' },
  { name: 'Аренда', icon: 'rent', type: 'expense' },
  { name: 'Подарки', icon: 'gifts', type: 'expense' },
  { name: 'Накопления', icon: 'savings', type: 'expense' },
  { name: 'Развлечения', icon: 'entertainment', type: 'expense' },
  { name: 'Зарплата', icon: 'salary', type: 'income' },
  { name: 'Другое', icon: 'other', type: 'income' },
];

const DEFAULT_GOALS: { name: string; icon: IconKey; target: number }[] = [
  { name: 'Путешествие', icon: 'travel', target: 900_000 },
  { name: 'Новый дом', icon: 'house', target: 15_000_000 },
  { name: 'Машина', icon: 'car', target: 6_000_000 },
  { name: 'Свадьба', icon: 'wedding', target: 3_000_000 },
];

/** Категории, цели и приветственные уведомления для нового пользователя */
export function createStarterData(data: Database, userId: string): void {
  for (const c of DEFAULT_CATEGORIES) {
    data.categories.push({ id: newId(), userId, custom: false, ...c });
  }
  for (const g of DEFAULT_GOALS) {
    data.goals.push({ id: newId(), userId, saved: 0, deposits: [], ...g });
  }
  data.notifications.push({
    id: newId(),
    userId,
    kind: 'update',
    title: 'Добро пожаловать в FinWise!',
    text: 'Добавьте первую транзакцию, чтобы увидеть аналитику.',
    date: new Date().toISOString(),
    read: false,
  });
}

/** Детерминированный генератор случайных чисел — демо-данные всегда одинаковые */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function createSeedDatabase(): Database {
  const data: Database = {
    version: 1,
    users: [],
    categories: [],
    transactions: [],
    goals: [],
    notifications: [],
    settings: [],
    supportMessages: [],
    resetCodes: [],
  };

  const now = new Date();
  const userId = newId();
  const demo: UserRecord = {
    id: userId,
    fullName: 'Индира Сапарова',
    email: DEMO_EMAIL,
    phone: '+7 701 234 56 78',
    birthDate: '2004-04-01',
    budgetLimit: 400_000,
    fingerprintEnabled: true,
    avatarColor: '#6DB6FE',
    createdAt: addDays(now, -420).toISOString(),
    passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
    pinHash: bcrypt.hashSync(DEMO_PIN, 10),
  };
  data.users.push(demo);
  createStarterData(data, userId);

  data.settings.push({
    userId,
    currency: 'KZT',
    fingerprints: [{ id: newId(), name: 'Отпечаток Индиры' }],
    notifications: {
      general: true,
      sound: true,
      soundCall: true,
      vibrate: true,
      transactionUpdates: false,
      expenseReminder: false,
      budgetNotifications: false,
      lowBalance: true,
    },
  });

  const cat = (icon: IconKey): Category =>
    data.categories.find((c) => c.userId === userId && c.icon === icon)!;

  const random = rng(42);
  const between = (min: number, max: number) => Math.round(min + random() * (max - min));
  const tx: Owned<Transaction>[] = [];
  const add = (
    date: Date,
    title: string,
    amount: number,
    icon: IconKey,
    type: TransactionType = 'expense',
  ) => {
    if (date > now) return;
    tx.push({
      id: newId(),
      userId,
      title,
      amount: round2(amount),
      type,
      categoryId: cat(icon).id,
      date: date.toISOString(),
      note: '',
    });
  };

  const foodTitles = ['Обед', 'Ужин', 'Кофе', 'Завтрак', 'Доставка еды'];
  const transportTitles = ['Такси', 'Автобус', 'Бензин', 'Каршеринг'];
  const funTitles = ['Кино', 'Концерт', 'Подписка', 'Боулинг'];

  // 14 месяцев истории, включая текущий
  for (let back = 13; back >= 0; back--) {
    const y = now.getFullYear();
    const m = now.getMonth() - back;
    const at = (day: number, hour = 12) => new Date(y, m, day, hour, between(0, 59));

    add(at(1, 10), 'Зарплата', 400_000, 'salary', 'income');
    if (random() > 0.5) add(at(between(10, 25), 15), 'Фриланс', between(40, 120) * 1000, 'other', 'income');
    add(at(5, 9), 'Аренда квартиры', 120_000, 'rent');
    for (let w = 0; w < 4; w++) add(at(3 + w * 7, 18), 'Продукты', between(9, 22) * 1000, 'groceries');
    for (let i = 0; i < 6; i++)
      add(at(between(1, 28), between(8, 22)), transportTitles[between(0, 3)], between(6, 40) * 100, 'transport');
    for (let i = 0; i < 6; i++)
      add(at(between(1, 28), between(9, 21)), foodTitles[between(0, 4)], between(15, 90) * 100, 'food');
    for (let i = 0; i < 2; i++)
      add(at(between(1, 28), 20), funTitles[between(0, 3)], between(3, 15) * 1000, 'entertainment');
    if (random() > 0.6) add(at(between(1, 28), 14), 'Аптека', between(2, 12) * 1000, 'medicine');
    if (random() > 0.7) add(at(between(1, 28), 17), 'Подарок другу', between(5, 25) * 1000, 'gifts');
  }

  // Несколько операций в последние дни, чтобы «Сегодня» и «Неделя» не были пустыми
  add(addDays(now, 0), 'Кофе', 1_200, 'food');
  add(addDays(now, -1), 'Такси', 2_400, 'transport');
  add(addDays(now, -2), 'Продукты', 14_500, 'groceries');
  add(addDays(now, -3), 'Ужин', 7_040, 'food');

  // Пополнения целей
  const goals = data.goals.filter((g) => g.userId === userId) as Owned<Goal>[];
  const savedPlan: Record<string, number[]> = {
    travel: [150_000, 120_000, 130_000],
    house: [80_000, 80_000],
    car: [60_000, 60_000, 60_000],
    wedding: [100_000, 100_000],
  };
  goals.forEach((g, goalIndex) => {
    (savedPlan[g.icon] ?? []).forEach((amount, i) => {
      // пополнения разнесены по прошлым месяцам
      const date = addDays(now, -now.getDate() - 2 - goalIndex * 7 - i * 30);
      g.deposits.push({ id: newId(), amount, date: date.toISOString() });
      g.saved += amount;
      add(date, `Пополнение: ${g.name}`, amount, 'savings');
    });
  });

  tx.sort((a, b) => b.date.localeCompare(a.date));
  data.transactions.push(...tx);

  const n = (
    kind: AppNotification['kind'],
    title: string,
    text: string,
    daysAgo: number,
    read = false,
  ) =>
    data.notifications.push({
      id: newId(),
      userId,
      kind,
      title,
      text,
      date: addDays(now, -daysAgo).toISOString(),
      read,
    });

  n('reminder', 'Напоминание!', 'Настройте автоматические накопления, чтобы быстрее достичь цели.', 0);
  n('update', 'Новое обновление', 'Мы добавили календарь расходов и поиск по транзакциям.', 0);
  n('transaction', 'Транзакции', 'Зарегистрирована новая транзакция: Продукты — 14 500 ₸.', 1);
  n('reminder', 'Напоминание!', 'До конца месяца осталось потратить меньше 30% лимита.', 1, true);
  n('expense', 'Отчёт о расходах', 'Мы заметили, что вы тратите много на еду. Загляните в аналитику.', 4, true);
  n('transaction', 'Транзакции', 'Зарегистрирована новая транзакция: Ужин — 7 040 ₸.', 5, true);

  // Убираем приветственное уведомление у демо-пользователя
  data.notifications = data.notifications.filter(
    (x) => !(x.userId === userId && x.title.startsWith('Добро пожаловать')),
  );

  data.supportMessages.push({
    id: newId(),
    userId,
    from: 'support',
    text: 'Здравствуйте! Я помощник FinWise. Чем могу помочь?',
    date: addDays(now, -1).toISOString(),
  });

  return data;
}
