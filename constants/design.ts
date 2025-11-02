// Константы дизайна "Структурная эстетика"
// Философия: docs/DESIGN_MANIFESTO.md
// Детали: docs/DESIGN_GUIDE.md

// Палитра "Каменная кладка" — вдохновлена материалами архитектуры
export const Colors = {
  // Фон (как чертёжная бумага и камень)
  surface: '#FFFFFF',          // Белый холст
  background: '#F6F8FA',       // Светлый камень
  surfaceSecondary: '#F6F8FA', // Вторичный фон
  
  // Текст (графит и гранит)
  textPrimary: '#24292F',      // Чёрный графит
  textSecondary: '#57606A',    // Серый гранит
  textTertiary: '#8C959F',     // Светлый мрамор
  
  // Действия (синий сланец)
  primary: '#0969DA',          // Кликабельное
  primaryLight: '#54A3FF',     // Hover
  primaryDark: '#0550AE',      // Pressed
  
  // Редкость (приглушённые минералы)
  common: '#6E7781',           // Известняк
  rare: '#0969DA',             // Лазурит
  epic: '#8250DF',             // Аметист
  legendary: '#BF8700',        // Золото
  
  // Состояния
  success: '#1A7F37',          // Зелёный
  error: '#CF222E',            // Красный
  warning: '#9A6700',          // Оранжевый
  info: '#0969DA',             // Синий
  
  // Границы (тонкие линии)
  border: '#D0D7DE',           // Контур
  borderMuted: '#D8DEE4',      // Слабый контур
  divider: '#EAEEF2',          // Разделитель
  
  // Акценты архитектурных стилей
  styleBaroque: '#8250DF',     // Барокко
  styleClassicism: '#0969DA',  // Классицизм
  styleModern: '#1A7F37',      // Модерн
  styleEmpire: '#BF8700',      // Ампир
} as const;

// Типографика — IBM Plex + GitHub sizing
export const Typography = {
  // Шрифты (установи: npx expo install expo-font @expo-google-fonts/ibm-plex-sans @expo-google-fonts/ibm-plex-mono)
  fontFamily: {
    sans: 'IBMPlexSans-Regular',
    sansMedium: 'IBMPlexSans-Medium',
    sansBold: 'IBMPlexSans-SemiBold',
    mono: 'IBMPlexMono-Regular',
  },
  
  // Заголовки
  h1: {
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  
  // Основной текст (GitHub использует 14px)
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // Мелкий текст
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  
  // Кнопки
  button: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // Метки
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

// Border Radius — GitHub использует более скромные значения
export const BorderRadius = {
  sm: 4,   // Мелкие элементы
  base: 6, // Кнопки, inputs (GitHub использует 6px)
  md: 8,   // Карточки
  lg: 12,  // Модальные окна
  xl: 16,  // Крупные элементы
  full: 999, // Круглые (аватары)
} as const;

export const IconSizes = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

export const AnimationDurations = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;

// Тени
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

