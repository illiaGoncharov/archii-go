# Документация Archi-Go

## Структура документации

### Основные документы

| Документ | Описание |
|----------|----------|
| [**SETUP.md**](SETUP.md) | Полная инструкция по настройке Firebase и запуску |
| [**DESIGN_MANIFESTO.md**](DESIGN_MANIFESTO.md) | Философия дизайна "Структурная эстетика" |
| [**DESIGN_GUIDE.md**](DESIGN_GUIDE.md) | Технические детали дизайн-системы |
| [**DATA_STRATEGY.md**](DATA_STRATEGY.md) | Источники данных и монетизация |
| [**ASSETS_GUIDE.md**](ASSETS_GUIDE.md) | Как создавать графику элементов |
| [**WEB_DEVELOPMENT.md**](WEB_DEVELOPMENT.md) | Разработка на десктопе (веб-версия) |
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | Гайд для разработчиков |
| [**TODO.md**](TODO.md) | Roadmap и следующие шаги |

### Бизнес и стратегия

| Документ | Описание |
|----------|----------|
| [**MONETIZATION_RUSSIA.md**](MONETIZATION_RUSSIA.md) | Модель монетизации для российского рынка |
| [**PITCH_CULTURAL.md**](PITCH_CULTURAL.md) | Pitch для музеев и культурных институций |
| [**GRANT_APPLICATION.md**](GRANT_APPLICATION.md) | Структура грантовых заявок (ПФКИ, Потанин) |
| [**PARTNER_PROGRAM.md**](PARTNER_PROGRAM.md) | Партнёрская программа для гидов, краеведов, блогеров |
| [**CONTENT_ROADMAP.md**](CONTENT_ROADMAP.md) | Roadmap развития контента (элементы, POI, маршруты) |
| [**EVENT_STRATEGY.md**](EVENT_STRATEGY.md) | Стратегия мероприятий с партнёрами |
| [**COMMUNICATION_STRATEGY.md**](COMMUNICATION_STRATEGY.md) | Коммуникационная стратегия для разных аудиторий |

---

## Быстрый старт

### 1. Установка
```bash
npm install
```

### 2. Настройка Firebase
См. детали в [SETUP.md](SETUP.md):
- Создать проект в Firebase Console
- Включить Auth, Firestore, Storage
- Скопировать конфиг в `firebase-config.ts`

### 3. Заполнение данных
```bash
npx ts-node scripts/seed-data.ts
```

### 4. Запуск
```bash
npm start     # На iPhone через Expo Go
npm run web   # На десктопе для разработки UI
```

---

## Чеклист настройки

- [ ] Установлены зависимости (`npm install`)
- [ ] Создан проект в Firebase Console
- [ ] Включены Auth, Firestore, Storage
- [ ] Конфиг скопирован в `firebase-config.ts`
- [ ] База заполнена (`npx ts-node scripts/seed-data.ts`)
- [ ] Приложение запущено (`npm start`)
- [ ] Expo Go установлен на iPhone
- [ ] QR-код отсканирован

---

## Разработка

### Проверка кода
```bash
npm run typecheck   # Проверка TypeScript
npm run lint        # Проверка ESLint
npm run lint:fix    # Авто-исправление
```

### Workflow
1. Разрабатывай UI на веб (`npm run web`)
2. Проверяй типы и линтер
3. Тестируй на iPhone (`npm start`)
4. Коммить по Conventional Commits (см. `.cursorrules`)

---

## Вопросы?

### Разработка
- **Дизайн-система** → [DESIGN_MANIFESTO.md](DESIGN_MANIFESTO.md)
- **Как создавать графику** → [ASSETS_GUIDE.md](ASSETS_GUIDE.md)
- **Откуда брать данные** → [DATA_STRATEGY.md](DATA_STRATEGY.md)
- **Веб-разработка** → [WEB_DEVELOPMENT.md](WEB_DEVELOPMENT.md)
- **Архитектура кода** → [CONTRIBUTING.md](CONTRIBUTING.md)

### Бизнес и стратегия
- **Как монетизировать в России** → [MONETIZATION_RUSSIA.md](MONETIZATION_RUSSIA.md)
- **Как питчить музеям** → [PITCH_CULTURAL.md](PITCH_CULTURAL.md)
- **Как получить грант** → [GRANT_APPLICATION.md](GRANT_APPLICATION.md)
- **Партнёрская программа** → [PARTNER_PROGRAM.md](PARTNER_PROGRAM.md)
- **Что добавлять в контент** → [CONTENT_ROADMAP.md](CONTENT_ROADMAP.md)
- **Как проводить мероприятия** → [EVENT_STRATEGY.md](EVENT_STRATEGY.md)
- **Как рассказывать о проекте** → [COMMUNICATION_STRATEGY.md](COMMUNICATION_STRATEGY.md)

---

**Начни с [SETUP.md](SETUP.md)** (для разработки) или [MONETIZATION_RUSSIA.md](MONETIZATION_RUSSIA.md) (для бизнеса)
