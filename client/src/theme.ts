/**
 * Дизайн-токены из макета FinWise (Figma).
 * Все цвета, шрифты и радиусы берём только отсюда.
 */
export const colors = {
  primary: '#00D09E', // Caribbean Green — основной
  primaryDark: '#00B98C',
  honeydew: '#F1FFF3', // фон «шторки»
  lightGreen: '#DFF7E2', // поля ввода, вторичные кнопки, нижнее меню
  dark: '#093030', // Fence Green — основной текст
  void: '#052224', // почти чёрный, прогресс-бар
  oceanBlue: '#0068FF', // расходы
  lightBlue: '#6DB6FE', // иконки транзакций
  vividBlue: '#3299FF',
  white: '#FFFFFF',
  muted: '#5C7271',
  danger: '#E5484D',
  canvas: '#1E1E1E', // фон вокруг «телефона» на компьютере
} as const;

/**
 * В макете используется Poppins, но в нём нет кириллицы.
 * Montserrat — похожий геометрический шрифт с русскими буквами.
 */
export const fonts = {
  main: "'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif",
} as const;

export const radius = {
  sheet: '56px',
  card: '28px',
  pill: '999px',
  field: '18px',
} as const;

export const shadow = {
  phone: '0 30px 80px rgba(0, 0, 0, 0.45)',
  card: '0 4px 16px rgba(9, 48, 48, 0.08)',
} as const;

/** Ширина «телефона» на компьютере */
export const PHONE_WIDTH = 430;
export const PHONE_HEIGHT = 932;
