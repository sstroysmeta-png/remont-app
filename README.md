# М-Ремонт — код приложения

Веб-приложение на React + Vite. Серверная функция распознавания плана — в `api/`.

## Запуск локально
```bash
npm install
npm run dev      # откроется на http://localhost:5173
```

## Сборка
```bash
npm run build    # результат в папке dist/
```

## Структура
- `src/App.jsx` — всё приложение (ваш код)
- `src/main.jsx` — точка входа
- `api/recognize-plan.js` — серверный прокси, держит ключ AI (работает на Vercel)
- `.env.example` — образец переменных (реальный .env не публикуется)
- `capacitor.config.json` — конфиг для обёртки в Android

## Ключ API
Не хранится в коде. Задаётся на Vercel в Environment Variables.
Подробно — в папке `05-ИНСТРУКЦИЯ`.
