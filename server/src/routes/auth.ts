import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import type { AuthResponse, ForgotPasswordResponse, VerifyCodeResponse } from '@finwise/shared';
import { getDb, saveDb, toPublicUser, type UserRecord } from '../db.js';
import { currentUser, parseBody, requireAuth, signToken } from '../middleware.js';
import { createStarterData } from '../seed.js';
import { HttpError, handle, newId } from '../utils.js';

export const authRouter = Router();

const email = z.string().trim().toLowerCase().email('Введите корректный e-mail');
const password = z
  .string()
  .min(8, 'Пароль должен быть не короче 8 символов')
  .regex(/\d/, 'В пароле должна быть хотя бы одна цифра');

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Введите имя и фамилию'),
  email,
  phone: z.string().trim().min(6, 'Введите номер телефона'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата рождения в формате ГГГГ-ММ-ДД'),
  password,
});

const AVATAR_COLORS = ['#6DB6FE', '#00D09E', '#3299FF', '#0068FF', '#F5A623'];

/** POST /api/auth/register — регистрация */
authRouter.post(
  '/register',
  handle((req, res) => {
    const body = parseBody(registerSchema, req);
    const data = getDb();
    if (data.users.some((u) => u.email === body.email)) {
      throw new HttpError(409, 'Пользователь с таким e-mail уже существует');
    }
    const user: UserRecord = {
      id: newId(),
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      birthDate: body.birthDate,
      budgetLimit: 300_000,
      fingerprintEnabled: false,
      avatarColor: AVATAR_COLORS[data.users.length % AVATAR_COLORS.length],
      createdAt: new Date().toISOString(),
      passwordHash: bcrypt.hashSync(body.password, 10),
      pinHash: null,
    };
    data.users.push(user);
    createStarterData(data, user.id);
    saveDb();
    const response: AuthResponse = { token: signToken(user.id), user: toPublicUser(user) };
    res.status(201).json(response);
  }),
);

/** POST /api/auth/login — вход */
authRouter.post(
  '/login',
  handle((req, res) => {
    const body = parseBody(z.object({ email, password: z.string().min(1, 'Введите пароль') }), req);
    const user = getDb().users.find((u) => u.email === body.email);
    if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
      throw new HttpError(401, 'Неверный e-mail или пароль');
    }
    const response: AuthResponse = { token: signToken(user.id), user: toPublicUser(user) };
    res.json(response);
  }),
);

/** GET /api/auth/me — кто я (проверка токена) */
authRouter.get(
  '/me',
  requireAuth,
  handle((_req, res) => {
    res.json(toPublicUser(currentUser(res)));
  }),
);

/** POST /api/auth/forgot-password — выдать 6-значный код для сброса пароля */
authRouter.post(
  '/forgot-password',
  handle((req, res) => {
    const body = parseBody(z.object({ email }), req);
    const data = getDb();
    const user = data.users.find((u) => u.email === body.email);
    if (!user) throw new HttpError(404, 'Пользователь с таким e-mail не найден');
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    data.resetCodes = data.resetCodes.filter((c) => c.email !== body.email);
    data.resetCodes.push({
      email: body.email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      resetToken: null,
    });
    saveDb();
    console.log(`[auth] Код для сброса пароля ${body.email}: ${code}`);
    const response: ForgotPasswordResponse = {
      message: 'Код отправлен. В учебном режиме он показан в приложении и в консоли сервера.',
      demoCode: code,
    };
    res.json(response);
  }),
);

/** POST /api/auth/verify-code — проверить код, получить токен сброса */
authRouter.post(
  '/verify-code',
  handle((req, res) => {
    const body = parseBody(
      z.object({ email, code: z.string().regex(/^\d{6}$/, 'Код состоит из 6 цифр') }),
      req,
    );
    const data = getDb();
    const entry = data.resetCodes.find((c) => c.email === body.email);
    if (!entry || entry.expiresAt < Date.now()) throw new HttpError(400, 'Код устарел, запросите новый');
    if (entry.code !== body.code) throw new HttpError(400, 'Неверный код');
    entry.resetToken = newId();
    saveDb();
    const response: VerifyCodeResponse = { resetToken: entry.resetToken };
    res.json(response);
  }),
);

/** POST /api/auth/reset-password — установить новый пароль */
authRouter.post(
  '/reset-password',
  handle((req, res) => {
    const body = parseBody(z.object({ resetToken: z.string().min(1), password }), req);
    const data = getDb();
    const entry = data.resetCodes.find((c) => c.resetToken === body.resetToken);
    if (!entry || entry.expiresAt < Date.now()) throw new HttpError(400, 'Ссылка для сброса устарела');
    const user = data.users.find((u) => u.email === entry.email);
    if (!user) throw new HttpError(404, 'Пользователь не найден');
    user.passwordHash = bcrypt.hashSync(body.password, 10);
    data.resetCodes = data.resetCodes.filter((c) => c !== entry);
    saveDb();
    res.json({ message: 'Пароль успешно изменён' });
  }),
);

/** POST /api/auth/fingerprint — «вход по отпечатку»: подтверждает текущую сессию */
authRouter.post(
  '/fingerprint',
  requireAuth,
  handle((_req, res) => {
    const user = currentUser(res);
    if (!user.fingerprintEnabled) throw new HttpError(400, 'Вход по отпечатку выключен в настройках');
    const response: AuthResponse = { token: signToken(user.id), user: toPublicUser(user) };
    res.json(response);
  }),
);
