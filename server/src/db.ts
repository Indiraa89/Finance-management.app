import fs from 'node:fs';
import path from 'node:path';
import type {
  AppNotification,
  Category,
  Goal,
  ID,
  NotificationSettings,
  Settings,
  SupportMessage,
  Transaction,
  User,
} from '@finwise/shared';
import { config } from './config.js';
import { createSeedDatabase } from './seed.js';

/**
 * Простейшая «база данных»: один JSON-файл server/data/db.json.
 * Данные держим в памяти и после каждого изменения записываем на диск.
 * Для учебного проекта этого достаточно: не нужно ставить PostgreSQL/MongoDB.
 */

export interface UserRecord extends Omit<User, 'hasPin'> {
  passwordHash: string;
  pinHash: string | null;
}

export type Owned<T> = T & { userId: ID };

export interface SettingsRecord extends Settings {
  userId: ID;
}

export interface ResetCode {
  email: string;
  code: string;
  expiresAt: number;
  resetToken: string | null;
}

export interface Database {
  version: number;
  users: UserRecord[];
  categories: Owned<Category>[];
  transactions: Owned<Transaction>[];
  goals: Owned<Goal>[];
  notifications: Owned<AppNotification>[];
  settings: SettingsRecord[];
  supportMessages: Owned<SupportMessage>[];
  resetCodes: ResetCode[];
}

export const DB_VERSION = 1;

let db: Database | null = null;

function load(): Database {
  if (fs.existsSync(config.dataFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(config.dataFile, 'utf8')) as Database;
      if (parsed.version === DB_VERSION) return parsed;
      console.warn('[db] Версия файла данных устарела — создаю заново.');
    } catch {
      console.warn('[db] Файл данных повреждён — создаю заново.');
    }
  }
  const fresh = createSeedDatabase();
  write(fresh);
  console.log(`[db] Создана демо-база: ${config.dataFile}`);
  return fresh;
}

function write(data: Database): void {
  fs.mkdirSync(path.dirname(config.dataFile), { recursive: true });
  // Атомарная запись: сначала во временный файл, потом переименование
  const tmp = `${config.dataFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, config.dataFile);
}

/** Доступ к данным */
export function getDb(): Database {
  if (!db) db = load();
  return db;
}

/** Сохранить изменения на диск */
export function saveDb(): void {
  if (db) write(db);
}

/** Удалить файл и пересоздать демо-данные */
export function resetDb(): Database {
  db = createSeedDatabase();
  write(db);
  return db;
}

/* ---------- Помощники ---------- */

export function toPublicUser(u: UserRecord): User {
  const { passwordHash: _p, pinHash, ...rest } = u;
  return { ...rest, hasPin: pinHash !== null };
}

export const defaultNotificationSettings = (): NotificationSettings => ({
  general: true,
  sound: true,
  soundCall: true,
  vibrate: true,
  transactionUpdates: true,
  expenseReminder: true,
  budgetNotifications: true,
  lowBalance: true,
});

export function getSettings(userId: ID): SettingsRecord {
  const data = getDb();
  let s = data.settings.find((x) => x.userId === userId);
  if (!s) {
    s = { userId, notifications: defaultNotificationSettings(), currency: 'KZT', fingerprints: [] };
    data.settings.push(s);
  }
  return s;
}
