import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const newId = (): string => randomUUID();

/** Ошибка с HTTP-статусом — её перехватывает общий обработчик ошибок */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

/** Обёртка, чтобы ошибки из обработчиков (в том числе async) попадали в errorHandler */
export const handle =
  (fn: Handler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next);
  };

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, days: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
};

/** YYYY-MM-DD в локальном времени */
export const ymd = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const MONTHS_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

/** Полные названия месяцев: «Расходы за апрель» */
export const MONTHS_FULL = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
