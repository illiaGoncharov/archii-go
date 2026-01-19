# Тестовые изображения для проверки детекции

## Как использовать

1. Скачай изображения по ссылкам ниже
2. Положи в папку `assets/test-images/`
3. В экране детекции нажми кнопку 🖼️ (справа внизу камеры)
4. Проверяй анимации bounding boxes и sidebar

---

## Барокко — Петербург

### 1. Зимний дворец (Эрмитаж)
- **Стиль:** Елизаветинское барокко
- **Архитектор:** Растрелли
- **Элементы:** Колонны, пилястры, картуши, маскароны, фронтоны, волюты
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Winter_Palace_SPB_from_Palace_Square.jpg/1280px-Winter_Palace_SPB_from_Palace_Square.jpg

### 2. Строгановский дворец
- **Стиль:** Барокко
- **Архитектор:** Растрелли
- **Элементы:** Пилястры, сандрики, карниз, маскароны
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Stroganov_palace_in_Saint_Petersburg.jpg/1280px-Stroganov_palace_in_Saint_Petersburg.jpg

### 3. Смольный собор
- **Стиль:** Елизаветинское барокко
- **Архитектор:** Растрелли
- **Элементы:** Колонны, пилястры, волюты, фронтоны
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Smolny_Cathedral_SPB.jpg/1024px-Smolny_Cathedral_SPB.jpg

---

## Классицизм

### 4. Казанский собор
- **Стиль:** Классицизм / Ампир
- **Архитектор:** Воронихин
- **Элементы:** Колонны (коринфский ордер), капители, фронтон, балюстрада
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kazan_Cathedral_Saint_Petersburg.jpg/1280px-Kazan_Cathedral_Saint_Petersburg.jpg

### 5. Михайловский дворец (Русский музей)
- **Стиль:** Классицизм
- **Архитектор:** Росси
- **Элементы:** Колонны, фронтон, руст, карниз
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mikhailovsky_Palace.jpg/1280px-Mikhailovsky_Palace.jpg

---

## Модерн

### 6. Дом компании «Зингер»
- **Стиль:** Модерн
- **Архитектор:** Сюзор
- **Элементы:** Балконы, маскароны, декоративные элементы
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Singer_House_SPB.jpg/800px-Singer_House_SPB.jpg

### 7. Доходный дом Лидваля (Каменноостровский, 1-3)
- **Стиль:** Северный модерн
- **Архитектор:** Лидваль
- **Элементы:** Маскароны, балконы, эркеры
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lidval_house_SPB.jpg/800px-Lidval_house_SPB.jpg

---

## Москва — Барокко

### 8. Меншикова башня (Церковь Архангела Гавриила)
- **Стиль:** Московское барокко / Петровское барокко
- **Элементы:** Волюты, пилястры, картуши
- **URL:** https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Church_of_the_Archangel_Gabriel_%28Menshikov_Tower%29_01.jpg/800px-Church_of_the_Archangel_Gabriel_%28Menshikov_Tower%29_01.jpg

---

## Скрипт для скачивания

```bash
#!/bin/bash
mkdir -p assets/test-images

curl -o assets/test-images/winter-palace.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Winter_Palace_SPB_from_Palace_Square.jpg/1280px-Winter_Palace_SPB_from_Palace_Square.jpg"

curl -o assets/test-images/stroganov-palace.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Stroganov_palace_in_Saint_Petersburg.jpg/1280px-Stroganov_palace_in_Saint_Petersburg.jpg"

curl -o assets/test-images/smolny.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Smolny_Cathedral_SPB.jpg/1024px-Smolny_Cathedral_SPB.jpg"

curl -o assets/test-images/kazan-cathedral.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kazan_Cathedral_Saint_Petersburg.jpg/1280px-Kazan_Cathedral_Saint_Petersburg.jpg"

curl -o assets/test-images/mikhailovsky.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Mikhailovsky_Palace.jpg/1280px-Mikhailovsky_Palace.jpg"

curl -o assets/test-images/singer-house.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Singer_House_SPB.jpg/800px-Singer_House_SPB.jpg"

curl -o assets/test-images/lidval-house.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lidval_house_SPB.jpg/800px-Lidval_house_SPB.jpg"

curl -o assets/test-images/menshikov-tower.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Church_of_the_Archangel_Gabriel_%28Menshikov_Tower%29_01.jpg/800px-Church_of_the_Archangel_Gabriel_%28Menshikov_Tower%29_01.jpg"

echo "Готово! Скачано 8 изображений."
```

---

## Альтернативные источники (если Wikimedia не работает)

### Unsplash (бесплатно, высокое качество)
- Поиск: "baroque architecture", "neoclassical building", "Saint Petersburg"
- https://unsplash.com/s/photos/baroque-architecture

### Pexels
- https://www.pexels.com/search/baroque%20architecture/

### Google Arts & Culture
- https://artsandculture.google.com/search?q=baroque%20architecture
