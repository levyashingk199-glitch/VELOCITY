# VELOCITY — React + Node.js API

Каталог содержит **56 товаров**. Вся информация о товарах загружается с Node.js/Express API; frontend не использует локальный mock-каталог.

## Запуск

Нужен Node.js 20 или новее.

### 1. Установка frontend
В корне проекта:
```bash
npm install
```

### 2. Установка backend
```bash
cd server
npm install
```

### 3. Запуск сервера
В терминале из папки `server`:
```bash
npm run dev
```
API: http://localhost:5000/api
Проверка: http://localhost:5000/api/health

### 4. Запуск React frontend
Во втором терминале, из корня проекта:
```bash
npm run dev
```
Откройте адрес Vite, обычно http://localhost:5173.

Vite перенаправляет `/api` на Node.js сервер `localhost:5000`. Для другого адреса API создайте `.env` на основе `.env.example` и задайте `VITE_API_URL`.

## API
- `GET /api/health` — состояние сервера и количество товаров
- `GET /api/products` — каталог, поиск, фильтры и сортировка
- `GET /api/products/:id` — товар по ID
- `GET /api/products/featured` — рекомендуемые товары
- `GET /api/products/new?limit=8` — новинки
- `GET /api/products/:id/similar?limit=4` — похожие товары

Каталог находится в `server/data/products.json`. Изменения в этом JSON будут возвращаться frontend после перезапуска сервера.

## Структура
- `src/` — React frontend (Vite)
- `server/src/server.js` — Node.js + Express API
- `server/data/products.json` — серверный каталог из 56 товаров

## PWA — установка как приложение

Проект настроен как Progressive Web App:
- `public/manifest.webmanifest` — название, цвета, режим приложения и иконки;
- `public/sw.js` — service worker: кеширует оболочку сайта, изображения и последние успешные ответы GET `/api/*`;
- `src/registerPWA.js` — регистрация service worker;
- кнопка **INSTALL APP** появляется в Chrome/Edge, когда браузер сообщает, что сайт можно установить.

### Проверка PWA локально

1. Запустите backend (`cd server && npm install && npm run dev`).
2. В корне установите зависимости (`npm install`).
3. Соберите сайт: `npm run build`.
4. Запустите предпросмотр: `npm run preview`.
5. Откройте адрес предпросмотра в Chrome или Edge. Для установки сайт должен быть на `localhost` либо опубликован по HTTPS.
6. Нажмите **INSTALL APP** или используйте значок установки в адресной строке браузера.

### Важно про офлайн-режим

PWA сохраняет оболочку приложения, ранее загруженные изображения и уже полученные ответы каталога. Для оформления заказа, входа и любых запросов, требующих backend, соединение с сервером всё равно необходимо. Если backend недоступен, приложение не сможет получить новые данные.

### Публикация

Размещайте frontend по HTTPS (например, Vercel), а backend — на доступном HTTPS-хостинге. В `.env` frontend задайте `VITE_API_URL` на публичный адрес API и настройте `CLIENT_URL` backend на домен frontend. После изменения адреса API пересоберите frontend.
