# Инструкция по настройке Archi-Go

## 1. Установка зависимостей

```bash
npm install
```

## 2. Настройка Firebase

### 2.1. Создай проект в Firebase

1. Зайди на [Firebase Console](https://console.firebase.google.com/)
2. Создай новый проект (или используй существующий)
3. Имя проекта: **archi-go** (или любое другое)

### 2.2. Добавь приложение

1. В настройках проекта добавь **iOS** и **Android** приложения
2. Bundle ID для iOS: `com.archigo.app`
3. Package name для Android: `com.archigo.app`

### 2.3. Включи необходимые сервисы

#### Authentication
1. В разделе **Authentication** → **Sign-in method**
2. Включи **Email/Password**

#### Firestore Database
1. В разделе **Firestore Database** нажми **Create database**
2. Выбери режим **Test mode** (для разработки)
3. Выбери регион (например, europe-west1)

**Правила безопасности для разработки:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Временные правила для разработки (разрешают всё)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Перед продакшеном** поменяй правила на:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать все элементы
    match /elements/{elementId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Пользователи могут читать все POI
    match /poi/{poiId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Пользователи могут создавать и читать свои находки
    match /findings/{findingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if false; // Только админ
    }
    
    // Пользователи могут управлять только своими данными
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Пользователи могут создавать и читать фасады
    match /facades/{facadeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

#### Storage
1. В разделе **Storage** нажми **Get started**
2. Выбери режим **Test mode**

**Правила для разработки:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**Перед продакшеном:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Только аутентифицированные пользователи могут загружать
    match /findings/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /facades/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2.4. Получи конфигурацию

1. В настройках проекта → **General** → **Your apps**
2. Найди секцию **SDK setup and configuration**
3. Выбери **Config**
4. Скопируй объект `firebaseConfig`

### 2.5. Добавь конфигурацию в проект

Открой файл `firebase-config.ts` и замени значения на свои:

```typescript
export const firebaseConfig = {
  apiKey: "твой_api_key",
  authDomain: "твой_проект.firebaseapp.com",
  projectId: "твой_проект",
  storageBucket: "твой_проект.appspot.com",
  messagingSenderId: "твой_id",
  appId: "твой_app_id"
};
```

## 3. Заполнение базы данных

### 3.1. Установи ts-node (если ещё не установлен)

```bash
npm install -g ts-node
```

### 3.2. Запусти скрипт для заполнения данных

```bash
npx ts-node scripts/seed-data.ts
```

Этот скрипт добавит в Firestore:
- 15 архитектурных элементов
- 5 точек интереса (POI) в районе Петроградской стороны

**Важно:** Замени placeholder изображения (`https://via.placeholder.com/...`) на настоящие фотографии элементов. Загрузи их в Firebase Storage и обнови поле `imageUrl` в коллекции `elements`.

## 4. Запуск приложения

```bash
npm start
```

## 5. Тестирование на iPhone

### 5.1. Установи Expo Go на iPhone
- Скачай из App Store: [Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### 5.2. Подключись к приложению
1. Убедись, что iPhone и компьютер в одной Wi-Fi сети
2. После `npm start` появится QR-код
3. Отсканируй QR-код камерой iPhone
4. Приложение откроется в Expo Go

### 5.3. Разрешения
При первом запуске разреши:
- Доступ к камере (для съёмки элементов)
- Доступ к геолокации (для карты)

## 6. Создание тестового пользователя

1. Запусти приложение
2. Зарегистрируйся с тестовым email (например, `test@test.com`)
3. Пароль: минимум 6 символов

## 7. Проверка функциональности

### Карта
- Открывается карта с твоей геолокацией
- Видны 5 POI (маркеры)
- При клике на маркер открывается информация о точке

### Камера
- Открывается камера
- Можно сделать снимок
- После снимка — превью и возможность отправить

### Коллекция
- Показывает 15 элементов
- Незайденные элементы — с замочком
- При клике — детальная информация

### Профиль
- Показывает информацию о пользователе
- Уровень, очки, статистика
- Кнопка "Конструктор фасадов"

### Конструктор
- Можно добавлять элементы из коллекции
- Изменять размер, поворачивать
- Сохранить фасад

## 8. Следующие шаги

### Добавить настоящие изображения элементов
1. Сфотографируй архитектурные элементы во время прогулки
2. Загрузи их в Firebase Storage
3. Обнови `imageUrl` в коллекции `elements`

### Модерация находок
Пока находки создаются со статусом `pending`. Для модерации:
1. Зайди в Firebase Console → Firestore
2. Открой коллекцию `findings`
3. Найди запись со статусом `pending`
4. Измени `status` на `approved` и добавь `elementId` (ID элемента из коллекции `elements`)

### Настроить CI/CD
После завершения разработки можно собрать standalone приложение:
```bash
npx eas build --platform ios
```

## Частые проблемы

### Ошибка "Firebase not configured"
- Проверь, что `firebase-config.ts` заполнен правильно
- Убедись, что включены Authentication, Firestore, Storage в Firebase Console

### Карта не показывает геолокацию
- Проверь разрешения на iPhone (Настройки → Expo Go → Геолокация)
- В симуляторе можно задать фейковую локацию

### Камера не работает
- Проверь разрешения на iPhone
- Камера не работает в симуляторе — только на реальном устройстве

### Не загружаются элементы
- Проверь, что запущен скрипт `seed-data.ts`
- Открой Firebase Console → Firestore и убедись, что данные там есть

## Полезные ссылки

- [Expo документация](https://docs.expo.dev/)
- [Firebase документация](https://firebase.google.com/docs)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Zustand документация](https://zustand-demo.pmnd.rs/)

