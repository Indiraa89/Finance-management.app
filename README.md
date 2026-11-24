# FinWise — мобильное приложение для учёта финансов

Учебный проект по практике. Мобильное веб-приложение по макету Figma
«Finance Management Mobile App UI Kit (FinWise)». Есть собственный REST API.

- **Клиент:** React 18 + TypeScript + Vite, styled-components, TanStack Query, React Router
- **Сервер (API):** Node.js + Express + TypeScript, JWT-авторизация, валидация zod
- **База данных:** JSON-файл `server/data/db.json`. Создаётся сам при первом запуске, ничего устанавливать не нужно.
- Весь код на **TypeScript** (на GitHub язык репозитория — 100% TypeScript).

---

## Быстрый старт

Нужен **Node.js 18 или новее** (https://nodejs.org).

```bash
# 1. Установить зависимости (один раз)
npm install

# 2. Запустить сервер API и приложение одной командой
npm run dev
```

Откройте в браузере **http://localhost:5173**.

Демо-аккаунт уже заполнен операциями за последние 14 месяцев:

| E-mail | Пароль | PIN |
|---|---|---|
| `demo@finwise.kz` | `Demo1234` | `123456` |

Можно и зарегистрировать свой аккаунт. Ему автоматически создадутся категории и цели.

> На компьютере приложение показывается в «рамке телефона». Чтобы увидеть, как оно
> выглядит на телефоне, откройте DevTools (F12) → режим устройства (Ctrl+Shift+M).

## Как открыть в VS Code

1. `File → Open Folder…` → выберите папку проекта.
2. VS Code предложит поставить рекомендуемые расширения (`.vscode/extensions.json`). Согласитесь.
3. Откройте терминал (`` Ctrl+` ``) и выполните `npm install`, затем `npm run dev`.
4. Отладка сервера: вкладка **Run and Debug** → «Сервер API (отладка)».

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | сервер API (порт 4000) + приложение (порт 5173) в режиме разработки |
| `npm run typecheck` | проверка типов TypeScript во всех частях проекта |
| `npm run build` | сборка сервера (`server/dist`) и клиента (`client/dist`) |
| `npm start` | запуск собранной версии: API и приложение на http://localhost:4000 |
| `npm run reset-db` | пересоздать базу с демо-данными |

## Структура проекта

```
├─ shared/            общие типы TypeScript (клиент и сервер используют одни и те же)
├─ server/            REST API на Express
│  └─ src/
│     ├─ routes/      эндпоинты: auth, profile, transactions, analytics, goals, misc
│     ├─ db.ts        «база данных» в JSON-файле
│     ├─ seed.ts      демо-данные
│     └─ middleware.ts JWT, валидация, обработка ошибок
└─ client/            React-приложение
   └─ src/
      ├─ api/         все запросы к API (fetch + JWT)
      ├─ hooks/       хуки загрузки данных (TanStack Query)
      ├─ context/     авторизация (AuthContext)
      ├─ components/  общие компоненты: шапка, нижнее меню, графики, поля ввода…
      ├─ screens/     экраны по разделам макета
      └─ theme.ts     цвета и шрифты из Figma
```

## Экраны (по разделам макета)

1. **Запуск:** сплэш, стартовый экран
2. **Онбординг:** 2 слайда
3. **Вход и регистрация:** вход, создание аккаунта, «Забыли пароль», код безопасности, новый пароль, «Пароль изменён», вход по отпечатку
4. **Главная:** баланс, лимит, накопления, операции за день, неделю или месяц
5. **Уведомления**
6. **Баланс счёта**
7. **Быстрый анализ**
8. **Транзакции:** все, только доходы, только расходы; добавление, просмотр, удаление
9. **Нижнее меню:**
   - **Анализ:** день, неделя, месяц, год; поиск; календарь с круговой диаграммой
   - **Категории:** сетка категорий, экран категории, добавление расхода, новая категория, накопления и цели, пополнение цели
   - **Профиль:** редактирование, безопасность (PIN, отпечатки, условия), настройки (уведомления, смена пароля, удаление аккаунта), помощь (FAQ, чат поддержки), выход

## API

Базовый адрес: `http://localhost:4000/api`. Почти все запросы требуют заголовок
`Authorization: Bearer <token>`. Токен возвращают `/auth/login` и `/auth/register`.

| Метод | Путь | Описание |
|---|---|---|
| GET | `/health` | проверка, что сервер работает |
| POST | `/auth/register` | регистрация |
| POST | `/auth/login` | вход, возвращает JWT |
| GET | `/auth/me` | текущий пользователь |
| POST | `/auth/forgot-password` | выдать 6-значный код (в учебном режиме код приходит в ответе) |
| POST | `/auth/verify-code` | проверить код, получить `resetToken` |
| POST | `/auth/reset-password` | установить новый пароль |
| POST | `/auth/fingerprint` | вход по отпечатку (подтверждение сохранённой сессии) |
| GET / PUT / DELETE | `/profile` | профиль: получить, изменить, удалить аккаунт |
| PUT | `/profile/password` | сменить пароль |
| PUT | `/profile/pin` | сменить PIN |
| GET | `/transactions?type&categoryId&from&to&q&limit` | список операций с фильтрами |
| POST / PUT / DELETE | `/transactions[/:id]` | добавить, изменить, удалить операцию |
| GET / POST / DELETE | `/categories[/:id]` | категории |
| GET | `/summary` | баланс, расходы за месяц, % от лимита |
| GET | `/analytics?period=daily\|weekly\|monthly\|yearly` | данные для графика |
| GET | `/analytics/quick` | «Быстрый анализ» |
| GET | `/analytics/calendar?month=YYYY-MM` | суммы по дням и доли категорий |
| GET / POST | `/goals` | цели накоплений |
| POST | `/goals/:id/deposit` | пополнить цель |
| GET | `/notifications` | уведомления |
| PATCH | `/notifications/:id/read` | отметить прочитанным |
| GET / PUT | `/settings` | настройки уведомлений и отпечатков |
| GET | `/help/faq` | вопросы и ответы |
| GET / POST | `/help/messages` | чат с поддержкой |

Пример проверки из терминала:

```bash
curl http://localhost:4000/api/health
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@finwise.kz\",\"password\":\"Demo1234\"}"
```

## Как выложить на GitHub

```bash
git init
git add .
git commit -m "FinWise: приложение для учёта финансов"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/finwise.git
git push -u origin main
```

Папки `node_modules`, `dist` и файл базы `server/data/db.json` в репозиторий не попадают (см. `.gitignore`).

## Что упрощено (учебный проект)

- Письмо со сбросом пароля не отправляется: код показывается в приложении и в консоли сервера.
- Отпечаток пальца в браузере имитируется кнопкой.
- В макете шрифт Poppins, но в нём нет русских букв, поэтому используется похожий Montserrat.
- Иллюстрации нарисованы в SVG по мотивам макета, иконки взяты из lucide-react.
