# Дизайн-гайд Archi-Go

> **См. также:** [DESIGN_MANIFESTO.md](DESIGN_MANIFESTO.md) — философия "Структурной эстетики"

## Философия

Archi-Go следует принципам **"Структурной эстетики"** — дизайн-подходу, где интерфейс строится по тем же законам, что и архитектура: точность пропорций, модульность, чистота линий.

### Ключевые принципы:
- **Точность** — всё выверено, как архитектурный чертёж
- **Модульность** — система компонентов, а не коллекция
- **Чистота** — ничего лишнего, фокус на элементах
- **Контекст** — UI служит архитектуре, а не конкурирует с ней
- **Уважение** — серьёзное отношение к теме, без упрощения

Подробнее: [DESIGN_MANIFESTO.md](DESIGN_MANIFESTO.md)

## Цветовая палитра

### Основные цвета

**Палитра в стиле GitHub** — приглушённые, но выразительные тона.

```typescript
const Colors = {
  // Основной (Primary) — GitHub Blue
  primary: '#0969DA',        // GitHub blue — действия, ссылки
  primaryLight: '#54A3FF',   // Светло-синий
  primaryDark: '#0550AE',    // Тёмно-синий
  
  // Фон — GitHub Gray Scale
  background: '#F6F8FA',     // Основной фон (GitHub bg)
  surface: '#FFFFFF',        // Карточки, модальные окна
  surfaceSecondary: '#F6F8FA', // Вторичный фон
  
  // Текст — GitHub Text Scale
  textPrimary: '#24292F',    // Основной текст (GitHub fg-default)
  textSecondary: '#57606A',  // Вторичный текст (fg-muted)
  textTertiary: '#8C959F',   // Placeholder, disabled (fg-subtle)
  
  // Редкость (Rarity) — Приглушённые, но выразительные
  common: '#6E7781',         // Серый (GitHub fg-muted)
  rare: '#0969DA',           // Синий (GitHub blue)
  epic: '#8250DF',           // Фиолетовый (GitHub purple)
  legendary: '#BF8700',      // Золотой (GitHub yellow-dark)
  
  // Состояния — GitHub Primer Colors
  success: '#1A7F37',        // Зелёный (GitHub green)
  error: '#CF222E',          // Красный (GitHub red)
  warning: '#9A6700',        // Оранжевый (GitHub orange-dark)
  info: '#0969DA',           // Синий (GitHub blue)
  
  // Границы — GitHub Border Scale
  border: '#D0D7DE',         // border-default
  borderMuted: '#D8DEE4',    // border-muted
  divider: '#EAEEF2',        // Лёгкий разделитель
  
  // Акценты для архитектурных стилей
  styleBaroque: '#8250DF',   // Барокко — фиолетовый
  styleClassicism: '#0969DA', // Классицизм — синий
  styleModern: '#1A7F37',    // Модерн — зелёный
  styleEmpire: '#BF8700',    // Ампир — золотой
};
```

### Использование цветов

- **Основной синий** — кнопки действий, активные элементы, прогресс-бары
- **Серый** — фон, вторичные элементы, текст
- **Цвета редкости** — обводка элементов, бейджи, иконки
- **Зелёный** — успешное выполнение действия
- **Красный** — ошибки, удаление

## Типографика

### Шрифты

**IBM Plex** — основной шрифт (читабельность + техничность).

Установка:
```bash
npx expo install expo-font @expo-google-fonts/ibm-plex-sans @expo-google-fonts/ibm-plex-mono
```

Fallback: SF Pro (iOS), Roboto (Android) если IBM Plex не загружен.

```typescript
const Typography = {
  // Шрифты
  fontFamily: {
    sans: 'IBMPlexSans-Regular',      // Основной
    sansMedium: 'IBMPlexSans-Medium', // Средний
    sansBold: 'IBMPlexSans-SemiBold', // Жирный
    mono: 'IBMPlexMono-Regular',      // Моноширинный (для кода, цифр)
  },
  
  // Заголовки — крупнее, меньше line-height (как на GitHub)
  h1: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: 32,
    fontWeight: '600' as const, // GitHub использует 600, не 700
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: 'IBMPlexSans-SemiBold',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  
  // Основной текст
  body: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 14,  // GitHub использует 14px для body
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // Мелкий текст
  caption: {
    fontFamily: 'IBMPlexSans-Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionMono: {
    fontFamily: 'IBMPlexMono-Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  
  // Кнопки
  button: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  
  // Метки (labels, badges)
  label: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};
```

**Важно:** 
- GitHub использует меньшие размеры (14px вместо 16px для body)
- Меньше line-height для плотности
- IBM Plex добавляет техничности и читабельности

## Spacing (Отступы)

Используем систему 4px:

```typescript
const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};
```

### Правила отступов

- **Карточки**: padding 16px (base)
- **Между элементами**: 8-12px (sm-md)
- **Между секциями**: 20-24px (lg-xl)
- **Края экрана**: 20px (lg)

## Border Radius (Скругление углов)

```typescript
const BorderRadius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999, // Полностью круглый
};
```

- **Кнопки**: 8px (base)
- **Карточки**: 12px (md)
- **Модальные окна**: 20px (xl) сверху
- **Аватары, иконки**: full

## Компоненты

### Кнопки

```typescript
const ButtonStyles = {
  // Основная кнопка
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.base,
  },
  
  // Вторичная кнопка
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.base,
  },
  
  // Иконка-кнопка
  icon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
```

### Карточки

```typescript
const CardStyles = {
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Для Android
  },
};
```

### Модальные окна

- Затемнение фона: `rgba(0,0,0,0.5)`
- Скругление сверху: 20px
- Максимальная высота: 80% экрана
- Анимация: slide вверх

### Input / TextInput

```typescript
const InputStyles = {
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.base,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  error: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
};
```

## Иконки

Используем `@expo/vector-icons` (Ionicons):

```typescript
const IconSizes = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
};
```

### Правила использования иконок

- **Tab bar**: 24px
- **В кнопках**: 20-24px
- **Заголовки**: 28-32px
- **Hero**: 48-60px

## Анимации

### Timing

```typescript
const AnimationDurations = {
  fast: 150,      // Быстрая реакция (hover, press)
  base: 250,      // Стандартная (модальные окна)
  slow: 400,      // Медленная (сложные переходы)
};
```

### Easing

- **Появление**: easeOut
- **Исчезновение**: easeIn
- **Переходы**: easeInOut

## Сетка / Layout

### Карточки элементов (Collection)

- **Колонки**: 2
- **Отступ между**: 10px
- **Отступы от краёв**: 10px
- **Aspect ratio**: 1:1.2 (ширина:высота)

### Экран карты

- **Full screen**: занимает весь экран
- **Модальное окно POI**: 60% высоты экрана снизу

## Состояния UI

### Loading

- **Spinner**: `<ActivityIndicator color={Colors.primary} />`
- **Skeleton**: светло-серый прямоугольник с пульсацией

### Empty State

```
[Иконка 48px]
Заголовок (h3)
Описание (caption)
[Кнопка действия]
```

### Error State

```
[Иконка ошибки 48px, красная]
Заголовок ошибки (h3)
Описание (caption)
[Кнопка "Попробовать снова"]
```

## Специфика элементов

### Карточка элемента (ElementCard)

```
╔═══════════════╗
║   [Image]     ║ ← Фото элемента
║               ║
╠═══════════════╣
║ Название      ║
║ [Rarity]      ║ ← Цветной бейдж редкости
╚═══════════════╝
```

**Locked state** (не найден):
- Opacity: 0.5
- Изображение: иконка замочка 40px
- Фон: светло-серый

### Экран профиля

```
┌─────────────────────────┐
│  [Avatar 100px]         │
│  Имя пользователя       │
│  email@example.com      │
├─────────────────────────┤
│  Уровень 3     150 очков│
│  [Прогресс-бар]         │
│  До уровня 4: 50 очков  │
├─────────────────────────┤
│  [Статистика 3 карточки]│
└─────────────────────────┘
```

## Accessibility

- **Минимальный размер тач-области**: 44x44px
- **Контрастность текста**: минимум 4.5:1
- **Не только цвет**: используй иконки + текст
- **accessibilityLabel**: для всех интерактивных элементов

## Dark Mode (в будущем)

Пока не реализован, но заложить возможность:

```typescript
const ColorsDark = {
  background: '#111827',
  surface: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  // ...
};
```

## Референсы

### Вдохновение
- [Duolingo](https://www.duolingo.com/) — геймификация
- [Google Maps](https://maps.google.com/) — карты
- [Pokemon GO](https://pokemongolive.com/) — сбор элементов
- [Instagram](https://instagram.com/) — карточки, коллекция

### UI Kit
Опирае
мся на:
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design) (частично для Android)

## Константы в коде

Создай файл `constants/design.ts`:

```typescript
export const Colors = { ... };
export const Typography = { ... };
export const Spacing = { ... };
export const BorderRadius = { ... };
export const AnimationDurations = { ... };
```

Используй везде:

```typescript
import { Colors, Spacing } from '../constants/design';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
  },
});
```

## Чеклист перед добавлением нового экрана

- [ ] Используешь цвета из палитры
- [ ] Используешь типографику из гайда
- [ ] Отступы кратны 4px
- [ ] Тач-области >= 44px
- [ ] Есть loading/error states
- [ ] Добавлены accessibilityLabel
- [ ] Проверено на iPhone SE (маленький экран) и iPhone Pro Max (большой)

---

**Этот гайд — living document. Обновляй по мере развития проекта.**

