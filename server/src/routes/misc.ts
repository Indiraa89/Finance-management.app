import { Router } from 'express';
import { z } from 'zod';
import type { AppNotification, FaqItem, Settings, SupportMessage } from '@finwise/shared';
import { getDb, getSettings, saveDb, toPublicUser } from '../db.js';
import { currentUser, parseBody, requireAuth } from '../middleware.js';
import { HttpError, handle, newId } from '../utils.js';

export const notificationsRouter = Router();
export const settingsRouter = Router();
export const helpRouter = Router();

/* ================= Уведомления ================= */

/** GET /api/notifications — новые сверху */
notificationsRouter.get(
  '/',
  handle((_req, res) => {
    const user = currentUser(res);
    const list: AppNotification[] = getDb()
      .notifications.filter((n) => n.userId === user.id)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(({ userId: _u, ...n }) => n);
    res.json(list);
  }),
);

/** PATCH /api/notifications/:id/read — отметить прочитанным */
notificationsRouter.patch(
  '/:id/read',
  handle((req, res) => {
    const user = currentUser(res);
    const n = getDb().notifications.find((x) => x.id === req.params.id && x.userId === user.id);
    if (!n) throw new HttpError(404, 'Уведомление не найдено');
    n.read = true;
    saveDb();
    res.json({ ok: true });
  }),
);

/** POST /api/notifications/read-all — отметить все прочитанными */
notificationsRouter.post(
  '/read-all',
  handle((_req, res) => {
    const user = currentUser(res);
    getDb()
      .notifications.filter((x) => x.userId === user.id)
      .forEach((x) => (x.read = true));
    saveDb();
    res.json({ ok: true });
  }),
);

/* ================= Настройки ================= */

const toSettings = (userId: string): Settings => {
  const { userId: _u, ...s } = getSettings(userId);
  return s;
};

/** GET /api/settings */
settingsRouter.get(
  '/',
  handle((_req, res) => {
    res.json(toSettings(currentUser(res).id));
  }),
);

/** PUT /api/settings — уведомления, валюта, отпечатки */
settingsRouter.put(
  '/',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        notifications: z.record(z.string(), z.boolean()).optional(),
        currency: z.enum(['KZT', 'USD', 'EUR', 'RUB']).optional(),
        fingerprintEnabled: z.boolean().optional(),
        addFingerprint: z.string().trim().min(1).optional(),
        removeFingerprintId: z.string().optional(),
      }),
      req,
    );
    const user = currentUser(res);
    const s = getSettings(user.id);
    if (body.notifications) {
      for (const [key, value] of Object.entries(body.notifications)) {
        if (key in s.notifications) (s.notifications as unknown as Record<string, boolean>)[key] = value;
      }
    }
    if (body.currency) s.currency = body.currency;
    if (body.addFingerprint) {
      s.fingerprints.push({ id: newId(), name: body.addFingerprint });
      user.fingerprintEnabled = true;
    }
    if (body.removeFingerprintId) {
      s.fingerprints = s.fingerprints.filter((f) => f.id !== body.removeFingerprintId);
      if (s.fingerprints.length === 0) user.fingerprintEnabled = false;
    }
    if (body.fingerprintEnabled !== undefined) user.fingerprintEnabled = body.fingerprintEnabled;
    saveDb();
    res.json({ settings: toSettings(user.id), user: toPublicUser(user) });
  }),
);

/* ================= Помощь ================= */

const FAQ: FaqItem[] = [
  {
    id: 'f1',
    group: 'general',
    question: 'Как пользоваться FinWise?',
    answer:
      'Добавляйте доходы и расходы на вкладке «Категории» или «Транзакции». Главная и «Анализ» сами посчитают баланс и построят графики.',
  },
  {
    id: 'f2',
    group: 'general',
    question: 'Сколько стоит приложение?',
    answer: 'FinWise полностью бесплатный — это учебный проект.',
  },
  {
    id: 'f3',
    group: 'account',
    question: 'Как связаться с поддержкой?',
    answer: 'Откройте «Профиль → Помощь → Онлайн-поддержка» и напишите сообщение.',
  },
  {
    id: 'f4',
    group: 'account',
    question: 'Как сбросить пароль, если я его забыл?',
    answer: 'На экране входа нажмите «Забыли пароль?», введите e-mail и 6-значный код.',
  },
  {
    id: 'f5',
    group: 'services',
    question: 'Есть ли защита данных?',
    answer: 'Пароли и PIN хранятся в виде хешей bcrypt, а доступ к API защищён JWT-токеном.',
  },
  {
    id: 'f6',
    group: 'services',
    question: 'Как настроить уведомления?',
    answer: 'Зайдите в «Профиль → Настройки → Уведомления» и включите нужные переключатели.',
  },
  {
    id: 'f7',
    group: 'services',
    question: 'Как задать месячный лимит расходов?',
    answer: 'В «Профиль → Редактировать профиль» укажите сумму лимита — от неё считается процент расходов.',
  },
  {
    id: 'f8',
    group: 'account',
    question: 'Как удалить аккаунт?',
    answer: 'В «Профиль → Настройки → Удалить аккаунт». Все данные будут удалены без возможности восстановления.',
  },
];

/** GET /api/help/faq */
helpRouter.get(
  '/faq',
  handle((_req, res) => {
    res.json(FAQ);
  }),
);

/** GET /api/help/messages — переписка с поддержкой */
helpRouter.get(
  '/messages',
  requireAuth,
  handle((_req, res) => {
    const user = currentUser(res);
    const list: SupportMessage[] = getDb()
      .supportMessages.filter((m) => m.userId === user.id)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(({ userId: _u, ...m }) => m);
    res.json(list);
  }),
);

/** Простой «бот» поддержки: отвечает по ключевым словам */
function botReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('пароль')) return 'Сменить пароль можно в «Профиль → Настройки → Сменить пароль».';
  if (t.includes('pin') || t.includes('пин')) return 'PIN меняется в «Профиль → Безопасность → Сменить PIN».';
  if (t.includes('лимит') || t.includes('бюджет'))
    return 'Месячный лимит задаётся в «Редактировать профиль». Процент расходов на главной считается от него.';
  if (t.includes('категор')) return 'Новую категорию можно добавить кнопкой «Ещё» на вкладке «Категории».';
  if (t.includes('спасибо')) return 'Всегда рады помочь! 😊';
  return 'Спасибо за сообщение! Специалист ответит в ближайшее время. Пока можно заглянуть в раздел «Вопросы и ответы».';
}

/** POST /api/help/messages — отправить сообщение в поддержку */
helpRouter.post(
  '/messages',
  requireAuth,
  handle((req, res) => {
    const body = parseBody(z.object({ text: z.string().trim().min(1, 'Введите сообщение') }), req);
    const user = currentUser(res);
    const data = getDb();
    const now = Date.now();
    const mine = { id: newId(), userId: user.id, from: 'user' as const, text: body.text, date: new Date(now).toISOString() };
    const reply = {
      id: newId(),
      userId: user.id,
      from: 'support' as const,
      text: botReply(body.text),
      date: new Date(now + 1000).toISOString(),
    };
    data.supportMessages.push(mine, reply);
    saveDb();
    res.status(201).json([mine, reply].map(({ userId: _u, ...m }) => m));
  }),
);
