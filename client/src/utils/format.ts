const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const numberFmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

/** 1870860 → «1 870 860 ₸»; со знаком минус для расходов */
export function money(value: number, opts: { negative?: boolean; plus?: boolean } = {}): string {
  const sign = opts.negative ? '-' : opts.plus ? '+' : '';
  return `${sign}${numberFmt.format(Math.abs(value))} ₸`;
}

/** Сокращение для подписей графика: 15000 → «15к», 1200000 → «1,2м» */
export function shortMoney(value: number): string {
  if (value >= 1_000_000) return `${numberFmt.format(Math.round(value / 100_000) / 10)}м`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}к`;
  return String(Math.round(value));
}

/** «18:27 · 30 апр» */
export function timeAndDate(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} · ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** «30 апр 2026» */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** «Ноябрь 2026» или «Ноябрь», если год текущий */
export function monthTitle(iso: string): string {
  const d = new Date(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return sameYear ? MONTHS[d.getMonth()] : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** YYYY-MM-DD в локальном времени */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Группировка по месяцу: [{ title: 'Ноябрь', items: [...] }] */
export function groupByMonth<T extends { date: string }>(items: T[]): { key: string; title: string; items: T[] }[] {
  const groups: { key: string; title: string; items: T[] }[] = [];
  for (const item of items) {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, title: monthTitle(item.date), items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }
  return groups;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

/** Склонение: plural(5, ['день', 'дня', 'дней']) */
export function plural(n: number, forms: [string, string, string]): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
}
