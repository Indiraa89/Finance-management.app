import { Router } from 'express';
import { z } from 'zod';
import type { IconKey, Transaction } from '@finwise/shared';
import { getDb, getSettings, saveDb, type Owned } from '../db.js';
import { currentUser, parseBody, parseQuery } from '../middleware.js';
import { HttpError, handle, newId, round2 } from '../utils.js';

export const transactionsRouter = Router();
export const categoriesRouter = Router();

const strip = ({ userId: _u, ...t }: Owned<Transaction>): Transaction => t;

/* ================= Транзакции ================= */

const listQuery = z.object({
  type: z.enum(['income', 'expense']).optional(),
  categoryId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

/** GET /api/transactions — список с фильтрами (новые сверху) */
transactionsRouter.get(
  '/',
  handle((req, res) => {
    const query = parseQuery(listQuery, req);
    const user = currentUser(res);
    const from = query.from ? new Date(query.from).getTime() : -Infinity;
    // «to» в формате даты включает весь день
    const to = query.to
      ? new Date(query.to.length === 10 ? `${query.to}T23:59:59.999` : query.to).getTime()
      : Infinity;
    const q = query.q?.trim().toLowerCase();

    let list = getDb()
      .transactions.filter((t) => t.userId === user.id)
      .filter((t) => !query.type || t.type === query.type)
      .filter((t) => !query.categoryId || t.categoryId === query.categoryId)
      .filter((t) => {
        const time = new Date(t.date).getTime();
        return time >= from && time <= to;
      })
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.note.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));

    if (query.limit) list = list.slice(0, query.limit);
    res.json(list.map(strip));
  }),
);

const txSchema = z.object({
  title: z.string().trim().min(1, 'Введите название'),
  amount: z.number({ error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Выберите категорию'),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Неверная дата'),
  note: z.string().optional(),
});

function checkCategory(userId: string, categoryId: string): void {
  if (!getDb().categories.some((c) => c.userId === userId && c.id === categoryId)) {
    throw new HttpError(400, 'Категория не найдена');
  }
}

/** POST /api/transactions — добавить операцию */
transactionsRouter.post(
  '/',
  handle((req, res) => {
    const body = parseBody(txSchema, req);
    const user = currentUser(res);
    checkCategory(user.id, body.categoryId);
    const data = getDb();
    const tx: Owned<Transaction> = {
      id: newId(),
      userId: user.id,
      title: body.title,
      amount: round2(body.amount),
      type: body.type,
      categoryId: body.categoryId,
      date: new Date(body.date).toISOString(),
      note: body.note ?? '',
    };
    data.transactions.push(tx);
    addTransactionNotifications(user.id, user.budgetLimit, tx);
    saveDb();
    res.status(201).json(strip(tx));
  }),
);

/** PUT /api/transactions/:id — изменить */
transactionsRouter.put(
  '/:id',
  handle((req, res) => {
    const body = parseBody(txSchema.partial(), req);
    const user = currentUser(res);
    const tx = getDb().transactions.find((t) => t.id === req.params.id && t.userId === user.id);
    if (!tx) throw new HttpError(404, 'Транзакция не найдена');
    if (body.categoryId) checkCategory(user.id, body.categoryId);
    Object.assign(tx, body);
    if (body.date) tx.date = new Date(body.date).toISOString();
    if (body.amount) tx.amount = round2(body.amount);
    saveDb();
    res.json(strip(tx));
  }),
);

/** DELETE /api/transactions/:id — удалить */
transactionsRouter.delete(
  '/:id',
  handle((req, res) => {
    const user = currentUser(res);
    const data = getDb();
    const before = data.transactions.length;
    data.transactions = data.transactions.filter(
      (t) => !(t.id === req.params.id && t.userId === user.id),
    );
    if (data.transactions.length === before) throw new HttpError(404, 'Транзакция не найдена');
    saveDb();
    res.status(204).end();
  }),
);

/** Уведомления после новой операции (если включены в настройках) */
function addTransactionNotifications(userId: string, budgetLimit: number, tx: Transaction): void {
  const data = getDb();
  const settings = getSettings(userId).notifications;
  const fmt = new Intl.NumberFormat('ru-RU').format(tx.amount);
  if (settings.transactionUpdates) {
    data.notifications.push({
      id: newId(),
      userId,
      kind: 'transaction',
      title: 'Транзакции',
      text: `Зарегистрирована новая транзакция: ${tx.title} — ${fmt} ₸.`,
      date: new Date().toISOString(),
      read: false,
    });
  }
  if (tx.type === 'expense' && settings.budgetNotifications) {
    const now = new Date();
    const monthExpense = data.transactions
      .filter((t) => t.userId === userId && t.type === 'expense')
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((s, t) => s + t.amount, 0);
    if (monthExpense > budgetLimit * 0.8) {
      data.notifications.push({
        id: newId(),
        userId,
        kind: 'expense',
        title: 'Отчёт о расходах',
        text: `Вы потратили ${Math.round((monthExpense / budgetLimit) * 100)}% месячного лимита.`,
        date: new Date().toISOString(),
        read: false,
      });
    }
  }
}

/* ================= Категории ================= */

/** GET /api/categories */
categoriesRouter.get(
  '/',
  handle((_req, res) => {
    const user = currentUser(res);
    res.json(
      getDb()
        .categories.filter((c) => c.userId === user.id)
        .map(({ userId: _u, ...c }) => c),
    );
  }),
);

const ICONS: [IconKey, ...IconKey[]] = [
  'salary', 'food', 'transport', 'medicine', 'groceries', 'rent', 'gifts', 'savings',
  'entertainment', 'travel', 'house', 'car', 'wedding', 'other', 'education', 'sport',
  'shopping', 'pets',
];

/** POST /api/categories — новая категория */
categoriesRouter.post(
  '/',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        name: z.string().trim().min(1, 'Введите название категории').max(24, 'Слишком длинное название'),
        icon: z.enum(ICONS).optional(),
        type: z.enum(['income', 'expense']).optional(),
      }),
      req,
    );
    const user = currentUser(res);
    const data = getDb();
    if (
      data.categories.some(
        (c) => c.userId === user.id && c.name.toLowerCase() === body.name.toLowerCase(),
      )
    ) {
      throw new HttpError(409, 'Такая категория уже есть');
    }
    const category = {
      id: newId(),
      userId: user.id,
      name: body.name,
      icon: body.icon ?? 'other',
      type: body.type ?? 'expense',
      custom: true,
    };
    data.categories.push(category);
    saveDb();
    const { userId: _u, ...pub } = category;
    res.status(201).json(pub);
  }),
);

/** DELETE /api/categories/:id — удалить свою категорию (вместе с её операциями) */
categoriesRouter.delete(
  '/:id',
  handle((req, res) => {
    const user = currentUser(res);
    const data = getDb();
    const category = data.categories.find((c) => c.id === req.params.id && c.userId === user.id);
    if (!category) throw new HttpError(404, 'Категория не найдена');
    if (!category.custom) throw new HttpError(400, 'Стандартные категории удалять нельзя');
    data.categories = data.categories.filter((c) => c !== category);
    data.transactions = data.transactions.filter((t) => t.categoryId !== category.id);
    saveDb();
    res.status(204).end();
  }),
);
