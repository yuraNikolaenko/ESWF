# 📦 ESWF — ERP-система управління автотранспортом

## 🔧 Загальні відомості
- **Назва проєкту:** ESWF (Enterprise Software for Fleet)
- **Призначення:** управління автопарком, логістикою, обліком водіїв, маршрутами, витратами
- **Архітектура:**
  - Frontend: React + Ant Design
  - Backend: Node.js + Express
  - База даних: SQLite (із планом переходу на PostgreSQL)

## 🗂 Основні модулі

### 1. **Довідники (DirectoryList + EditForm)**
- Автомобілі (з брендами і моделями)
- Водії
- Маршрути
- Пункти призначення
- Номенклатура
- Контрагенти
- Організації
- Валюти
- Склади

### 2. **Путеві листи (Documents)**
- Путеві листи
- Облік витрат пального

### 3. **Сервісні модулі**
- Обмін з BAF
- Видалення об'єктів

### 4. **Реєстри (Registers)**
#### 📘 Леджери (залишки)
- **Cash Ledger** – залишки грошових коштів за рахунками
- **Inventory Ledger** – залишки товарів по складах

#### 📒 Журнали (рухи)
- **Cash Journal** – рухи грошових коштів
- **Inventory Journal** – рухи товарів

## 📁 Структура довідника "Пункти призначення"

### 📍 `location_point`
- Населені пункти України та інших країн
- Поля: id, name, region, country, latitude, longitude

### 🏗 `transport_hub`
- Транспортні вузли (порти, аеропорти, станції)
- Поля: id, name, type, location_point_id (FK), code, latitude, longitude

### 📦 `delivery_point`
- Адреси доставки (неточні або точні координати)
- Поля: id, location_point_id (FK), address, note, latitude, longitude

## 🔌 API (поточна логіка доступу)
- `GET /api/location-points` — всі населені пункти
- `GET /api/transport-hubs?location_id=1` — вузли міста
- `GET /api/delivery-points?location_id=1` — адреси доставки в місті

## 🧠 Принципи
- Вся географічна логіка обʼєднується в абстракцію `destination`
- Один населений пункт може мати багато хабів і багато адрес доставки
- Імпорт довідників можливий з відкритих джерел (OSM, GeoNames, КОАТУУ)

## 💰 Облік залишків і рухів

### 📒 Таблиця `cash_journal` – журнал рухів коштів
- `id` — PK
- `organization_id` — FK → organizations
- `account_id` — FK → chart_of_accounts
- `currency_id` — FK → currencies
- `movement_type` — 'in' / 'out'
- `amount` — сума операції
- `document_type` — тип документа (наприклад, incomingPayments)
- `document_id` — ID документа
- `movement_date` — дата операції
- `created_at` — створено
- `comment` — примітка

### 📘 Таблиця `cash_ledger` – залишки по рахунках
- `id` — PK
- `organization_id` — FK → organizations
- `account_id` — FK → chart_of_accounts
- `currency_id` — FK → currencies
- `balance` — поточний залишок
- `last_update` — дата останнього оновлення

### 🧠 Механізм
- Кожна операція додається до `cash_journal`
- Одночасно оновлюється `cash_ledger`
- Швидке отримання залишку: `SELECT balance FROM cash_ledger WHERE account_id = ...`

## 🛠️ Поточна реалізація (станом на сьогодні)
- Усі довідники відкриваються у вкладках (`directoryList`, `directoryItem`, тощо)
- Підтримка багатовкладковості
- Вкладки керуються глобальним хук-контекстом `useTabs()`
- React-компоненти: `App.jsx`, `DirectoryTab.jsx`, `UniversalEditForm.jsx`, `sections.js`, `FooterTabs.jsx`, `Sidebar.jsx`
- Підключено SQLite через backend API
- GitHub: https://github.com/yuraNikolaenko/ESWF

