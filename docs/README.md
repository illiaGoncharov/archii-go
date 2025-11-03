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

- **Дизайн-система** → [DESIGN_MANIFESTO.md](DESIGN_MANIFESTO.md)
- **Как создавать графику** → [ASSETS_GUIDE.md](ASSETS_GUIDE.md)
- **Откуда брать данные** → [DATA_STRATEGY.md](DATA_STRATEGY.md)
- **Веб-разработка** → [WEB_DEVELOPMENT.md](WEB_DEVELOPMENT.md)
- **Архитектура кода** → [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Начни с [SETUP.md](SETUP.md)**
