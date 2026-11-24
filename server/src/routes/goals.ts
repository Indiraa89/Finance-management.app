import { Router } from 'express';
import { z } from 'zod';
import type { Goal, IconKey } from '@finwise/shared';
import { getDb, saveDb, type Owned } from '../db.js';
import { currentUser, parseBody } from '../middleware.js';
import { HttpError, handle, newId, round2 } from '../utils.js';

export const goalsRouter = Router();

const strip = ({ userId: _u, ...g }: Owned<Goal>): Goal => g;

/** GET /api/goals — цели накоплений */
goalsRouter.get(
  '/',
  handle((_req, res) => {
    const user = currentUser(res);
    res.json(getDb().goals.filter((g) => g.userId === user.id).map(strip));
  }),
);

/** GET /api/goals/:id */
goalsRouter.get(
  '/:id',
  handle((req, res) => {
    const user = currentUser(res);
    const goal = getDb().goals.find((g) => g.id === req.params.id && g.userId === user.id);
    if (!goal) throw new HttpError(404, 'Цель не найдена');
    res.json(strip(goal));
  }),
);

/** POST /api/goals — новая цель */
goalsRouter.post(
  '/',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        name: z.string().trim().min(1, 'Введите название цели'),
        icon: z.string().optional(),
        target: z.number().positive('Сумма цели должна быть больше нуля'),
      }),
      req,
    );
    const user = currentUser(res);
    const goal: Owned<Goal> = {
      id: newId(),
      userId: user.id,
      name: body.name,
      icon: (body.icon as IconKey | undefined) ?? 'savings',
      target: round2(body.target),
      saved: 0,
      deposits: [],
    };
    getDb().goals.push(goal);
    saveDb();
    res.status(201).json(strip(goal));
  }),
);

/** POST /api/goals/:id/deposit — пополнить цель (создаёт расход в категории «Накопления») */
goalsRouter.post(
  '/:id/deposit',
  handle((req, res) => {
    const body = parseBody(
      z.object({
        amount: z.number({ error: 'Введите сумму' }).positive('Сумма должна быть больше нуля'),
        date: z.string().optional(),
      }),
      req,
    );
    const user = currentUser(res);
    const data = getDb();
    const goal = data.goals.find((g) => g.id === req.params.id && g.userId === user.id);
    if (!goal) throw new HttpError(404, 'Цель не найдена');
    const date = body.date ? new Date(body.date).toISOString() : new Date().toISOString();
    const amount = round2(body.amount);
    goal.deposits.unshift({ id: newId(), amount, date });
    goal.saved = round2(goal.saved + amount);

    const savingsCategory = data.categories.find((c) => c.userId === user.id && c.icon === 'savings');
    if (savingsCategory) {
      data.transactions.push({
        id: newId(),
        userId: user.id,
        title: `Пополнение: ${goal.name}`,
        amount,
        type: 'expense',
        categoryId: savingsCategory.id,
        date,
        note: '',
      });
    }
    saveDb();
    res.status(201).json(strip(goal));
  }),
);
