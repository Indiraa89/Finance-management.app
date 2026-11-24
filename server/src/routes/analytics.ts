import { Router } from 'express';
import { z } from 'zod';
import type {
  Analytics,
  CalendarData,
  ChartPoint,
  Period,
  QuickAnalysis,
  Summary,
  Transaction,
} from '@finwise/shared';
import { getDb, type Owned } from '../db.js';
import { currentUser, parseQuery, requireAuth } from '../middleware.js';
import {
  MONTHS_FULL,
  MONTHS_SHORT,
  WEEKDAYS_SHORT,
  addDays,
  handle,
  round2,
  startOfDay,
  ymd,
} from '../utils.js';

export const analyticsRouter = Router();

type Tx = Owned<Transaction>;

const userTx = (userId: string): Tx[] => getDb().transactions.filter((t) => t.userId === userId);

const sum = (list: Tx[], type: Transaction['type']): number =>
  round2(list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0));

const inRange = (list: Tx[], from: Date, to: Date): Tx[] =>
  list.filter((t) => {
    const d = new Date(t.date);
    return d >= from && d < to;
  });

const point = (label: string, list: Tx[]): ChartPoint => ({
  label,
  income: sum(list, 'income'),
  expense: sum(list, 'expense'),
});

/** Главная цель накоплений — с наибольшим прогрессом */
function topGoal(userId: string): { name: string; progress: number } {
  const goals = getDb().goals.filter((g) => g.userId === userId);
  if (goals.length === 0) return { name: 'Цели', progress: 0 };
  const best = goals.reduce((a, b) => (b.saved / b.target > a.saved / a.target ? b : a));
  return { name: best.name, progress: Math.min(100, Math.round((best.saved / best.target) * 100)) };
}

/** Точки по неделям текущего месяца */
function monthWeeks(list: Tx[], now: Date): ChartPoint[] {
  const y = now.getFullYear();
  const m = now.getMonth();
  const starts = [1, 8, 15, 22];
  return starts.map((startDay, i) => {
    // последняя «неделя» тянется до конца месяца
    const end = i === 3 ? new Date(y, m + 1, 1) : new Date(y, m, starts[i + 1]);
    return point(`${i + 1} нед`, inRange(list, new Date(y, m, startDay), end));
  });
}

/** GET /api/summary — данные для шапки «Общий баланс / Общие расходы» */
analyticsRouter.get(
  '/summary',
  requireAuth,
  handle((_req, res) => {
    const user = currentUser(res);
    const list = userTx(user.id);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const month = inRange(list, monthStart, nextMonth);
    const weekAgo = addDays(startOfDay(now), -6);
    const lastWeek = inRange(list, weekAgo, addDays(startOfDay(now), 1));
    const foodIds = new Set(
      getDb()
        .categories.filter((c) => c.userId === user.id && c.icon === 'food')
        .map((c) => c.id),
    );
    const totalIncome = sum(list, 'income');
    const totalExpense = sum(list, 'expense');
    const monthExpense = sum(month, 'expense');
    const goal = topGoal(user.id);

    const summary: Summary = {
      totalBalance: round2(totalIncome - totalExpense),
      totalIncome,
      totalExpense,
      monthIncome: sum(month, 'income'),
      monthExpense,
      budgetLimit: user.budgetLimit,
      expensePercent: Math.round((monthExpense / user.budgetLimit) * 100),
      revenueLastWeek: sum(lastWeek, 'income'),
      foodLastWeek: sum(
        lastWeek.filter((t) => foodIds.has(t.categoryId)),
        'expense',
      ),
      savingsProgress: goal.progress,
      savingsGoalName: goal.name,
    };
    res.json(summary);
  }),
);

/** GET /api/analytics?period=daily|weekly|monthly|yearly — данные для графика */
analyticsRouter.get(
  '/analytics',
  requireAuth,
  handle((req, res) => {
    const { period } = parseQuery(
      z.object({ period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('daily') }),
      req,
    );
    const list = userTx(currentUser(res).id);
    const now = new Date();
    const today = startOfDay(now);
    let points: ChartPoint[] = [];

    if (period === 'daily') {
      // последние 7 дней
      points = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(today, i - 6);
        const label = WEEKDAYS_SHORT[(day.getDay() + 6) % 7];
        return point(label, inRange(list, day, addDays(day, 1)));
      });
    } else if (period === 'weekly') {
      points = monthWeeks(list, now);
    } else if (period === 'monthly') {
      // последние 6 месяцев
      points = Array.from({ length: 6 }, (_, i) => {
        const start = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        return point(MONTHS_SHORT[start.getMonth()], inRange(list, start, end));
      });
    } else {
      // последние 5 лет
      points = Array.from({ length: 5 }, (_, i) => {
        const year = now.getFullYear() - 4 + i;
        return point(String(year), inRange(list, new Date(year, 0, 1), new Date(year + 1, 0, 1)));
      });
    }

    const result: Analytics = {
      period: period as Period,
      points,
      income: round2(points.reduce((s, p) => s + p.income, 0)),
      expense: round2(points.reduce((s, p) => s + p.expense, 0)),
    };
    res.json(result);
  }),
);

/** GET /api/analytics/quick — «Быстрый анализ» */
analyticsRouter.get(
  '/analytics/quick',
  requireAuth,
  handle((_req, res) => {
    const user = currentUser(res);
    const list = userTx(user.id);
    const now = new Date();
    const today = startOfDay(now);
    const lastWeek = inRange(list, addDays(today, -6), addDays(today, 1));
    const foodIds = new Set(
      getDb()
        .categories.filter((c) => c.userId === user.id && c.icon === 'food')
        .map((c) => c.id),
    );
    const goal = topGoal(user.id);
    const result: QuickAnalysis = {
      title: `Расходы за ${MONTHS_FULL[now.getMonth()]}`,
      points: monthWeeks(list, now),
      savingsProgress: goal.progress,
      savingsGoalName: goal.name,
      revenueLastWeek: sum(lastWeek, 'income'),
      foodLastWeek: sum(
        lastWeek.filter((t) => foodIds.has(t.categoryId)),
        'expense',
      ),
    };
    res.json(result);
  }),
);

/** GET /api/analytics/calendar?month=YYYY-MM — суммы по дням и доли категорий */
analyticsRouter.get(
  '/analytics/calendar',
  requireAuth,
  handle((req, res) => {
    const { month } = parseQuery(
      z.object({
        month: z
          .string()
          .regex(/^\d{4}-\d{2}$/, 'Месяц в формате ГГГГ-ММ')
          .optional(),
      }),
      req,
    );
    const user = currentUser(res);
    const now = new Date();
    const [y, m] = month ? month.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    const list = inRange(userTx(user.id), start, end);

    const days = [];
    for (let d = start; d < end; d = addDays(d, 1)) {
      const p = point('', inRange(list, d, addDays(d, 1)));
      days.push({ date: ymd(d), income: p.income, expense: p.expense });
    }

    const expenses = list.filter((t) => t.type === 'expense');
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const categories = getDb().categories.filter((c) => c.userId === user.id);
    const byCategory = categories
      .map((c) => {
        const amount = round2(
          expenses.filter((t) => t.categoryId === c.id).reduce((s, t) => s + t.amount, 0),
        );
        return {
          categoryId: c.id,
          name: c.name,
          icon: c.icon,
          amount,
          percent: total ? Math.round((amount / total) * 100) : 0,
        };
      })
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const result: CalendarData = {
      month: `${y}-${String(m).padStart(2, '0')}`,
      days,
      byCategory,
    };
    res.json(result);
  }),
);
