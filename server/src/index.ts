import { createApp } from './app.js';
import { config } from './config.js';
import { getDb } from './db.js';
import { DEMO_EMAIL, DEMO_PASSWORD } from './seed.js';

getDb(); // создаём/загружаем базу при старте

createApp().listen(config.port, () => {
  console.log(`\n✅ FinWise API запущен: http://localhost:${config.port}/api/health`);
  console.log(`   Демо-вход: ${DEMO_EMAIL} / ${DEMO_PASSWORD}\n`);
});
