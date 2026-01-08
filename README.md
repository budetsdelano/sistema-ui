# Sistema UI 🎨

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs)](https://vuejs.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://LICENSE)
[![Demo Live](https://img.shields.io/badge/Demo-Live-success)](https://sistemaui.ru/form/)
[![Design Figma](https://img.shields.io/badge/Design-Figma-purple)](https://sistemaui.ru/demo/)

**Sistema UI** — модульная система компонентов на Vue 3. Проект фокусируется на чистой архитектуре, централизованной конфигурации и переиспользуемых паттернах.

> **Демо**: [sistemaui.ru/form/](https://sistemaui.ru/form/)  
> **Дизайн в Figma**: [sistemaui.ru/demo/](https://sistemaui.ru/demo/)

## ✨ Особенности

- **📋 Полнофункциональная форма**: Поддержка текстовых полей, загрузки файлов, чекбоксов с комплексной валидацией.
- **🎭 Система компонентов**: Готовые, стилизованные компоненты (`InputText`, `InputFile`, `Notification`, `AlertBlock`, `ActionButton`).
- **⚙️ Централизованная конфигурация**: Все тексты, правила валидации и настройки полей управляются через единый файл `formFields.js`.
- **🔗 Гибкая интеграция с бэкендом**: Готовый пример отправки данных на PHP API (`/api/form.php`) с обработкой ошибок.
- **🔄 Валидация в реальном времени**: Валидация на стороне клиента (Vue) и сервера (PHP) с синхронизацией ошибок.
- **📁 Обработка файлов**: Drag & Drop загрузка, валидация размера и типа, превью списка файлов.
- **🎨 SCSS-архитектура**: Модульные, структурированные стили с использованием SCSS.

## 📁 Структура проекта

```
sistema-ui/
├── src/
│   ├── assets/
│   │   ├── favicon/          # Иконки и фавиконки
│   │   └── styles/           # SCSS-стили (переменные, миксины, компоненты)
│   ├── components/forms/     # 💎 ЯДРО: Компоненты формы
│   │   ├── InputText.vue     # Текстовое поле с маской
│   │   ├── InputFile.vue     # Поле загрузки файлов (Drag & Drop)
│   │   ├── InputCheckbox.vue # Чекбокс
│   │   ├── FormLabel.vue     # Лейбл для полей
│   │   ├── ActionButton.vue  # Кнопка (вариации base/minor)
│   │   ├── Notification.vue  # Инлайновое уведомление (ошибки)
│   │   └── AlertBlock.vue    # Блок алерта (успешная отправка)
│   ├── views/
│   │   └── FormView.vue      # Основной компонент страницы с формой
│   ├── router/               # Конфигурация Vue Router
│   ├── api/
│   │   └── formApi.js        # Клиент для отправки данных на PHP API
│   ├── config/
│   │   └── formFields.js     # ⚙️ КОНФИГ: Все тексты, правила, настройки полей
│   ├── composables/          # Vue 3 composables (например, useForm)
│   ├── App.vue
│   └── main.js
├── public/                   # Статические активы (копируются как есть)
├── api/                      # PHP-скрипт для обработки формы
│   └── form.php
├── vite.config.js           # Конфигурация Vite (сборка, алиасы, SCSS)
└── package.json
```

## 🧩 Компоненты системы

Каждый компонент спроектирован как независимый, конфигурируемый модуль.

| Компонент       | Назначение                                     | Ключевые пропсы                                 |
| --------------- | ---------------------------------------------- | ----------------------------------------------- |
| `InputText`     | Текстовый ввод.                                | `v-model`, `mask` (для маски телефона), `error` |
| `InputFile`     | Загрузка файлов (множественная, Drag & Drop).  | `v-model`, `multiple`, `maxSize`, `error`       |
| `InputCheckbox` | Чекбокс для согласий.                          | `v-model`, `error`                              |
| `ActionButton`  | Кнопка действий.                               | `variant` (`base`/`minor`), `disabled`          |
| `Notification`  | Встроенное уведомление (для ошибок валидации). | `type`, `message`, `closable`                   |
| `AlertBlock`    | Крупный алерт (для статуса отправки формы).    | `type`, `title`, `message`, `autoClose`         |
| `FormLabel`     | Лейбл для полей ввода.                         | `label`, `required`                             |

## ⚙️ Конфигурация

Все изменяемые тексты и правила вынесены в центральный конфиг `src/config/formFields.js`. Это позволяет:

- **Локализовать** приложение, меняя только один файл.
- **Быстро прототипировать** новые формы, изменяя структуру полей.
- **Управлять бизнес-правилами** (макс. размер файла, обязательные поля) без правки компонентов.

**Пример конфигурации поля:**

```javascript
email: {
  id: 'email',
  label: 'E-mail',
  type: 'email',
  component: 'InputText',
  placeholder: 'mail@example.com',
  required: true,
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Некорректный email' // Текст ошибки из конфига
  }
}
```

## 🔧 Разработка и расширение

### Добавление нового типа поля

1. Создать компонент в `src/components/forms/` (например, `InputSelect.vue`).
2. Зарегистрировать его в `src/components/forms/index.js`.
3. Добавить конфигурацию нового поля в `formFields.js`, указав `component: 'InputSelect'`.
4. Форма в `FormView.vue` автоматически отобразит новый компонент на основе конфига.

### Изменение логики валидации

Логика валидации сосредоточена в `FormView.vue` (методы `validateField`, `validateFileField`). Для добавления новых правил:

1. Расширить объект `validation` в конфиге поля.
2. Реализовать проверку в соответствующем методе валидации.
3. Добавить текст ошибки в `validation.generalMessages` конфига.

### Работа с API

- Клиентская логика: `src/api/formApi.js` (использует `fetch`).
- Серверная логика: `api/form.php` (обработка, валидация, логгирование).

## 🔗 Полезные ссылки

- [Демо приложение](https://sistemaui.ru/form/) — Рабочая форма
- [Дизайн в Figma](https://sistemaui.ru/demo/) — Макет проекта
- [Документация Vue 3](https://vuejs.org/guide/introduction.html)
- [Документация Vite](https://vitejs.dev/guide/)
- [Sass/SCSS документация](https://sass-lang.com/documentation)

---
