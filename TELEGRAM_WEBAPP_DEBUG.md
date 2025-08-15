# Telegram Web App Debug Guide

## Проблемы и решения для Telegram Web App

### 🔧 Основные исправления

#### 1. **Маршрутизация (HashRouter)**
**Проблема**: Telegram Web App требует HashRouter вместо BrowserRouter для правильной работы SPA в iframe.

**Решение**: 
```jsx
// src/main.jsx
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
```

#### 2. **Безопасная инициализация Telegram WebApp SDK**
**Проблема**: Инициализация SDK может блокировать рендеринг или вызывать ошибки.

**Решение**:
```jsx
// src/lib/tg.js
export function initTG(appSetters) {
  if (typeof window === 'undefined') {
    return { isTG: false };
  }

  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.log('Telegram WebApp not available');
    return { isTG: false };
  }

  try {
    tg.ready();
    tg.expand();
    // ... остальная логика
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return { isTG: false };
  }
}
```

#### 3. **Безопасный доступ к localStorage**
**Проблема**: localStorage может быть недоступен или заблокирован в Telegram Web App.

**Решение**:
```jsx
// src/store/app.jsx
export function load() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, using default data');
      return DEFAULT;
    }
    // ... остальная логика
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return DEFAULT;
  }
}
```

#### 4. **Задержка инициализации**
**Проблема**: Telegram Web App требует времени для полной загрузки.

**Решение**:
```jsx
// src/components/Shell.jsx
React.useEffect(() => {
  if (!ready) return;
  
  // Задержка для безопасной инициализации в Telegram iframe
  const timer = setTimeout(initTelegram, 100);
  
  return () => clearTimeout(timer);
}, [ready]);
```

### 🐛 Диагностика проблем

#### Отладка в консоли
Приложение автоматически логирует информацию о Telegram Web App:

```javascript
// Открыть консоль в Telegram Web App
// Найти логи:
// === Telegram Web App Debug Info ===
// === Telegram Web App Issues ===
```

#### Проверка доступности API
```javascript
// В консоли браузера:
console.log('Telegram object:', window.Telegram);
console.log('WebApp object:', window.Telegram?.WebApp);
console.log('Color scheme:', window.Telegram?.WebApp?.colorScheme);
```

### 📱 Специфичные для Telegram проблемы

#### 1. **Iframe ограничения**
- Проверка: `window.self !== window.top`
- Решение: Использовать HashRouter

#### 2. **localStorage ограничения**
- Проверка: `typeof window.localStorage`
- Решение: Fallback на дефолтные данные

#### 3. **CSP/CORS ограничения**
- Проверка: Сетевые запросы в консоли
- Решение: Использовать только локальные ресурсы

#### 4. **Версии WebApp SDK**
- Проверка: `window.Telegram.WebApp.version`
- Решение: Проверять доступность методов

### 🔍 Чек-лист отладки

#### При открытии вкладок "Tasks" и "Habits":

1. **Проверить консоль на ошибки**
   ```
   - ReferenceError
   - TypeError
   - Import errors
   ```

2. **Проверить загрузку чанков**
   ```
   - 404 ошибки
   - CORS ошибки
   - CSP блокировки
   ```

3. **Проверить состояние приложения**
   ```javascript
   // В консоли:
   console.log('App ready:', window.appReady);
   console.log('Data loaded:', window.appData);
   ```

4. **Проверить маршрутизацию**
   ```javascript
   // В консоли:
   console.log('Current route:', window.location.hash);
   console.log('Router state:', window.routerState);
   ```

### 🛠️ Инструменты отладки

#### Автоматическая диагностика
Приложение включает автоматическую диагностику:

```javascript
// src/lib/telegram-debug.js
import { logTelegramDebug, checkTelegramIssues } from './telegram-debug'

// Автоматически вызывается при загрузке
logTelegramDebug()
checkTelegramIssues()
```

#### Ручная диагностика
```javascript
// В консоли Telegram Web App:
import('./telegram-debug.js').then(module => {
  module.logTelegramDebug()
  module.checkTelegramIssues()
})
```

### ✅ Критерии успеха

Вкладки "Tasks" и "Habits" работают корректно, если:

1. ✅ **Нет ошибок в консоли**
2. ✅ **Страницы загружаются без белых экранов**
3. ✅ **Навигация работает стабильно**
4. ✅ **UI отображается корректно**
5. ✅ **Темы и языки работают**
6. ✅ **Данные сохраняются и загружаются**

### 🚀 Готово к деплою

После применения всех исправлений:

1. **Сборка проходит без ошибок**
2. **HashRouter обеспечивает правильную маршрутизацию**
3. **Telegram WebApp SDK инициализируется безопасно**
4. **localStorage работает с fallback**
5. **Отладка включена для диагностики**

Приложение готово к использованию в Telegram Web App!
