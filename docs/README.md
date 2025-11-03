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

### Шаг 1: Установка
```bash
npm install
```

### Шаг 2: Первый запуск (без Firebase)

**Важно:** Firebase НЕ нужен для первичной проверки UI!

**Для разработки UI на десктопе:**
```bash
npm run web
```
Проверь: UI отрисовывается, навигация работает, нет критичных ошибок.

**Для тестирования на iPhone:**
```bash
npm start
```
- Установи Expo Go из App Store
- Отсканируй QR-код
- Проверь все экраны

Подробнее: [FIRST_RUN.md](FIRST_RUN.md)

### Шаг 3: Настройка Firebase (когда нужна функциональность)

Когда захочешь протестировать работу с данными (загрузка элементов, сохранение находок, авторизация) — тогда настрои Firebase.

См. детали: [SETUP.md](SETUP.md)

---

## Чеклист (по приоритетам)

### Для первичного запуска (без Firebase):
- [ ] Установлены зависимости (`npm install`)
- [ ] Приложение запущено (`npm run web` или `npm start`)
- [ ] UI проверен
- [ ] Навигация работает

### Для тестирования функциональности (нужен Firebase):
- [ ] Создан проект в Firebase Console
- [ ] Включены Auth, Firestore, Storage
- [ ] Конфиг скопирован в `firebase-config.ts`
- [ ] База заполнена (`npx ts-node scripts/seed-data.ts`)
- [ ] Expo Go установлен на iPhone
- [ ] QR-код отсканирован
- [ ] Протестированы все функции

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
