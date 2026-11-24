import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { getDb, saveDb, toPublicUser } from '../db.js';
import { currentUser, parseBody } from '../middleware.js';
import { HttpError, handle } from '../utils.js';

export const profileRouter = Router();

/** GET /api/profile */
profileRouter.get(
  '/',
  handle((_req, res) => {
    res.json(toPublicUser(currentUser(res)));
  }),
);

const updateSchema = z.object({
  fullName: z.string().trim().min(2, 'Введите имя').optional(),
  email: z.string().trim().toLowerCase().email('Введите корректный e-mail').optional(),
  phone: z.string().trim().min(6, 'Введите номер телефона').optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  budgetLimit: z.number().positive('Лимит должен быть больше нуля').optional(),
  avatarColor: z.string().optional(),
});

/** PUT /api/profile — изменить профиль */
profileRouter.put(
  '/',
  handle((req, res) => {
    const body = parseBody(updateSchema, req);
    const user = currentUser(res);
    if (body.email && body.email !== user.email && getDb().users.some((u) => u.email === body.email)) {
      throw new HttpError(409, 'Этот e-mail уже занят');
    }
    Object.assign(user, body);
    saveDb();
    res.json(toPublicUser(user));
  }),
);

/** PUT /api/profile/password — смена пароля */
profileRouter.put(
  '/password',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        currentPassword: z.string().min(1, 'Введите текущий пароль'),
        newPassword: z
          .string()
          .min(8, 'Пароль должен быть не короче 8 символов')
          .regex(/\d/, 'В пароле должна быть хотя бы одна цифра'),
      }),
      req,
    );
    const user = currentUser(res);
    if (!bcrypt.compareSync(body.currentPassword, user.passwordHash)) {
      throw new HttpError(400, 'Текущий пароль указан неверно');
    }
    user.passwordHash = bcrypt.hashSync(body.newPassword, 10);
    saveDb();
    res.json({ message: 'Пароль изменён' });
  }),
);

/** PUT /api/profile/pin — установить или сменить PIN */
profileRouter.put(
  '/pin',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        currentPin: z.string().optional(),
        newPin: z.string().regex(/^\d{6}$/, 'PIN состоит из 6 цифр'),
      }),
      req,
    );
    const user = currentUser(res);
    if (user.pinHash && !bcrypt.compareSync(body.currentPin ?? '', user.pinHash)) {
      throw new HttpError(400, 'Текущий PIN указан неверно');
    }
    user.pinHash = bcrypt.hashSync(body.newPin, 10);
    saveDb();
    res.json({ message: 'PIN изменён' });
  }),
);

/** POST /api/profile/verify-pin — проверить PIN */
profileRouter.post(
  '/verify-pin',
  handle((req, res) => {
    const body = parseBody(z.object({ pin: z.string() }), req);
    const user = currentUser(res);
    if (!user.pinHash) throw new HttpError(400, 'PIN ещё не установлен');
    if (!bcrypt.compareSync(body.pin, user.pinHash)) throw new HttpError(400, 'Неверный PIN');
    res.json({ ok: true });
  }),
);

/** DELETE /api/profile — удалить аккаунт и все данные */
profileRouter.delete(
  '/',
  handle((req, res) => {
    const body = parseBody(z.object({ password: z.string().min(1, 'Введите пароль') }), req);
    const user = currentUser(res);
    if (!bcrypt.compareSync(body.password, user.passwordHash)) {
      throw new HttpError(400, 'Неверный пароль');
    }
    const data = getDb();
    data.users = data.users.filter((u) => u.id !== user.id);
    data.categories = data.categories.filter((x) => x.userId !== user.id);
    data.transactions = data.transactions.filter((x) => x.userId !== user.id);
    data.goals = data.goals.filter((x) => x.userId !== user.id);
    data.notifications = data.notifications.filter((x) => x.userId !== user.id);
    data.settings = data.settings.filter((x) => x.userId !== user.id);
    data.supportMessages = data.supportMessages.filter((x) => x.userId !== user.id);
    saveDb();
    res.json({ message: 'Аккаунт удалён' });
  }),
);
