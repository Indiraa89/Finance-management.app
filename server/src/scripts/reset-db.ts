import { config } from '../config.js';
import { resetDb } from '../db.js';

resetDb();
console.log(`База данных пересоздана с демо-данными: ${config.dataFile}`);
