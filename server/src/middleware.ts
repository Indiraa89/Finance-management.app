import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError, type ZodType, type z } from 'zod';
import { config } from './config.js';
import { getDb, type UserRecord } from './db.js';
import { HttpError } from './utils.js';

/* ---------- JWT ---------- */

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: config.tokenTtl });
}

/** Текущий пользователь, которого положил middleware requireAuth */
export function currentUser(res: Response): UserRecord {
  return res.locals.user as UserRecord;
}

/** Пропускает запрос дальше только с правильным токеном в заголовке Authorization */
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return next(new HttpError(401, 'Нужно войти в аккаунт'));
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = getDb().users.find((u) => u.id === payload.sub);
    if (!user) return next(new HttpError(401, 'Пользователь не найден'));
    res.locals.user = user;
    next();
  } catch {
    next(new HttpError(401, 'Сессия истекла, войдите снова'));
  }
};

/* ---------- Валидация (zod) ---------- */

export function parseBody<S extends ZodType>(schema: S, req: Request): z.infer<S> {
  return schema.parse(req.body);
}

export function parseQuery<S extends ZodType>(schema: S, req: Request): z.infer<S> {
  return schema.parse(req.query);
}

/* ---------- Ошибки ---------- */

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(404, 'Такого адреса в API нет'));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    res.status(400).json({ error: first?.message ?? 'Неверные данные', details: err.issues });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Тело запроса должно быть корректным JSON' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};
