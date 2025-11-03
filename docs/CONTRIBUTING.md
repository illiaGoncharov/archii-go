# Гайд для разработчика

## Структура проекта

```
archi-go/
├── app/                    # Экраны (Expo Router)
│   ├── (tabs)/            # Табы навигации
│   │   ├── map.tsx        # Карта
│   │   ├── camera.tsx     # Камера
│   │   ├── collection.tsx # Коллекция
│   │   └── profile.tsx    # Профиль
│   ├── builder.tsx        # Конструктор фасадов
│   ├── index.tsx          # Стартовая страница
│   └── _layout.tsx        # Root layout
├── components/            # Переиспользуемые компоненты
│   ├── map/              # Компоненты карты
│   ├── camera/           # Компоненты камеры (пока не используются)
│   ├── collection/       # Компоненты коллекции
│   └── builder/          # Компоненты конструктора
├── services/             # API и внешние сервисы
│   ├── firebase.ts       # Инициализация Firebase
│   ├── auth.ts           # Авторизация
│   ├── firestore.ts      # CRUD операции с Firestore
│   └── storage.ts        # Работа с Firebase Storage
├── stores/               # Zustand stores
│   ├── userStore.ts      # Пользователь
│   ├── collectionStore.ts # Коллекция элементов
│   ├── cameraStore.ts    # Состояние камеры
│   └── mapStore.ts       # Карта и POI
├── types/                # TypeScript типы
│   ├── user.ts
│   ├── element.ts
│   ├── finding.ts
│   ├── poi.ts
│   └── facade.ts
├── utils/                # Вспомогательные функции
│   ├── geolocation.ts    # Работа с геолокацией
│   ├── rarity.ts         # Расчёт редкости
│   └── points.ts         # Расчёт очков
└── scripts/              # Скрипты
    └── seed-data.ts      # Заполнение базы данных
```

## Архитектура

### Навигация
Используется **Expo Router** (file-based routing):
- `app/(tabs)/` — таб-навигация (карта, камера, коллекция, профиль)
- `app/builder.tsx` — отдельный экран конструктора

### Состояние
**Zustand** для управления глобальным состоянием:
- `userStore` — данные пользователя, авторизация
- `collectionStore` — коллекция элементов и находок
- `cameraStore` — состояние камеры и загрузки фото
- `mapStore` — карта, POI, геолокация

### Данные
**Firebase**:
- **Authentication** — авторизация (email/password)
- **Firestore** — база данных (users, elements, findings, poi, facades)
- **Storage** — хранение фотографий

## Добавление нового элемента

### 1. Добавить в Firestore вручную

Через Firebase Console → Firestore → Collection `elements`:

```json
{
  "name": "Акротерий",
  "description": "Декоративный элемент на углах фронтона",
  "style": "Классицизм",
  "rarity": "rare",
  "points": 25,
  "imageUrl": "https://your-storage-url/akroteriy.jpg",
  "totalFound": 0
}
```

### 2. Или через код

Добавь в `scripts/seed-data.ts` и запусти:

```bash
npx ts-node scripts/seed-data.ts
```

## Добавление нового POI

Через Firebase Console → Firestore → Collection `poi`:

```json
{
  "title": "Дворцовая площадь",
  "description": "Главная площадь города",
  "location": {
    "latitude": 59.9387,
    "longitude": 30.3162
  },
  "elementsNearby": ["Капитель", "Атлант"],
  "difficulty": "easy"
}
```

## Модерация находок

1. Пользователь фотографирует элемент
2. Создаётся запись в `findings` со статусом `pending`
3. Модератор:
   - Открывает Firebase Console → Firestore → `findings`
   - Находит запись со статусом `pending`
   - Смотрит фото (поле `photoUrl`)
   - Определяет элемент
   - Изменяет `status` на `approved` и добавляет `elementId`
4. Пользователь получает элемент в коллекцию

## Геймификация

### Очки
- **Common** элемент = 10 очков
- **Rare** элемент = 25 очков
- **Epic** элемент = 50 очков
- **Legendary** элемент = 100 очков

### Уровни
- 1 уровень = 0-99 очков
- 2 уровень = 100-199 очков
- 3 уровень = 200-299 очков
- И так далее (каждые 100 очков)

### Редкость
Определяется по количеству находок всеми пользователями:
- **Legendary** — найден 0-10 раз
- **Epic** — найден 11-50 раз
- **Rare** — найден 51-100 раз
- **Common** — найден более 100 раз

## Приватность репозитория

**Решение: Публичная репа**

Почему публичная:
- Portfolio для резюме
- Open Source философия (архитектурное наследие для всех)
- GitHub Actions без ограничений
- Можно получить контрибьюторов
- Firebase безопасность настраивается через Rules, а не через скрытие ключей

Firebase keys в публичной репе безопасны, если настроены Security Rules.

---

## Best Practices

### Типизация
Всегда используй TypeScript типы из `types/`:

```typescript
import { Element } from '../types/element';

const element: Element = {
  id: '123',
  name: 'Метопа',
  // ...
};
```

### Обработка ошибок
Всегда оборачивай асинхронные операции в try/catch:

```typescript
try {
  const elements = await getAllElements();
} catch (error) {
  console.error('Ошибка загрузки элементов:', error);
  Alert.alert('Ошибка', 'Не удалось загрузить элементы');
}
```

### Комментарии
Пиши комментарии на русском для неочевидных вещей:

```typescript
// Вычисляем редкость на основе общего количества находок
const rarity = calculateRarity(element.totalFound);
```

### Компоненты
Разделяй логику и UI:
- Логика (API calls, state) — в экранах или хуках
- UI — в компонентах

### Стили
Используй StyleSheet из React Native:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  }
});
```

## Тестирование

### На реальном устройстве (iPhone)
1. `npm start`
2. Отсканируй QR-код в Expo Go
3. Приложение обновляется автоматически при изменении кода

### Проверка геолокации
- В Expo Go на реальном iPhone геолокация работает как нативно
- Можно тестировать прогулки

### Проверка камеры
- Камера работает только на реальном устройстве
- В симуляторе камера недоступна

## Деплой

### Standalone приложение (TestFlight / App Store)

1. Установи EAS CLI:
```bash
npm install -g eas-cli
```

2. Логин:
```bash
eas login
```

3. Конфигурация:
```bash
eas build:configure
```

4. Сборка для iOS:
```bash
eas build --platform ios
```

5. Submit в App Store:
```bash
eas submit --platform ios
```

## Roadmap

### MVP (Текущий этап)
- [x] Карта с POI
- [x] Камера для съёмки
- [x] Коллекция элементов
- [x] Конструктор фасадов
- [x] Профиль
- [x] Базовая геймификация

### Фаза 2
- [ ] Автоматическая классификация элементов (AI)
- [ ] Экран входа/регистрации
- [ ] Социальные функции (лента, друзья)
- [ ] Пользовательские маршруты
- [ ] Push-уведомления

### Фаза 3
- [ ] Монетизация (подписка, in-app purchases)
- [ ] Коллаборации с музеями
- [ ] Локализация на другие языки
- [ ] Расширение на другие города

