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
  overlay: 'rgba(9, 48, 48, 0.45)',
  canvas: '#1E1E1E',
} as const;

/**
 * В макете используется Poppins, но в нём нет кириллицы.
 * Montserrat — похожий геометрический шрифт с русскими буквами.
 * В React Native у каждого начертания своё имя шрифта.
 */
export const fonts = {
  light: 'Montserrat_300Light',
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

export type FontWeight = keyof typeof fonts;

export const radius = {
  sheet: 56,
  card: 28,
  field: 18,
  pill: 999,
} as const;
