import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Корень папки server/ (работает и из src/ через tsx, и из dist/ после сборки) */
export const SERVER_ROOT = path.resolve(here, '..');

export const config = {
  port: Number(process.env.PORT ?? 4000),
  /** В настоящем проекте секрет задаётся переменной окружения JWT_SECRET */
  jwtSecret: process.env.JWT_SECRET ?? 'finwise-dev-secret-change-me',
  tokenTtl: '7d',
  dataFile: process.env.DATA_FILE ?? path.join(SERVER_ROOT, 'data', 'db.json'),
  clientDist: path.resolve(SERVER_ROOT, '..', 'client', 'dist'),
} as const;
