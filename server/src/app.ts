import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { config } from './config.js';
import { errorHandler, notFound, requireAuth } from './middleware.js';
import { analyticsRouter } from './routes/analytics.js';
import { authRouter } from './routes/auth.js';
import { goalsRouter } from './routes/goals.js';
import { helpRouter, notificationsRouter, settingsRouter } from './routes/misc.js';
import { profileRouter } from './routes/profile.js';
import { categoriesRouter, transactionsRouter } from './routes/transactions.js';

// Сообщения валидации zod по умолчанию — на русском
z.config(z.locales.ru());

export function createApp(): express.Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Простой лог запросов в консоль
  app.use((req, _res, next) => {
    if (req.path.startsWith('/api')) console.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  /* ---------- API ---------- */
  const api = express.Router();

  api.get('/health', (_req, res) => {
    res.json({ status: 'ok', name: 'FinWise API', time: new Date().toISOString() });
  });

  api.use('/auth', authRouter);
  api.use('/profile', requireAuth, profileRouter);
  api.use('/transactions', requireAuth, transactionsRouter);
  api.use('/categories', requireAuth, categoriesRouter);
  api.use('/goals', requireAuth, goalsRouter);
  api.use('/notifications', requireAuth, notificationsRouter);
  api.use('/settings', requireAuth, settingsRouter);
  api.use('/help', helpRouter); // /help/faq открыт для всех, сообщения — только после входа
  api.use('/', analyticsRouter); // /summary, /analytics, /analytics/quick, /analytics/calendar
  api.use(notFound);

  app.use('/api', api);

  /* ---------- Собранный клиент (после npm run build) ---------- */
  if (fs.existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist));
    app.get('*', (_req, res) => res.sendFile(path.join(config.clientDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}
