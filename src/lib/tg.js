// src/lib/tg.js
export function initTG(appSetters) {
  // Проверяем, что мы в браузере и Telegram WebApp доступен
  if (typeof window === 'undefined') {
    return { isTG: false };
  }

  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.log('Telegram WebApp not available');
    return { isTG: false };
  }

  try {
    // Сообщаем Telegram, что UI готов, и растягиваем вебвью
    tg.ready();
    tg.expand();

    // Синхронизируем тему Telegram -> приложение
    const applyScheme = () => {
      try {
        const scheme = tg.colorScheme; // 'light' | 'dark'
        const theme = scheme === 'dark' ? 'dark' : 'light';
        console.log('Applying Telegram theme:', theme);
        appSetters.setTheme(theme, { withFade: true });
      } catch (error) {
        console.error('Error applying Telegram theme:', error);
      }
    };

    // Применяем тему сразу
    applyScheme();
    
    // Слушаем изменения темы
    tg.onEvent('themeChanged', applyScheme);

    // Подставляем ник из Telegram, если ещё не задан
    const user = tg.initDataUnsafe?.user;
    if (user && !appSetters.getNickname?.()) {
      const nickname = user.username || user.first_name || 'User';
      console.log('Setting nickname from Telegram:', nickname);
      appSetters.setNickname?.(nickname);
    }

    console.log('Telegram WebApp initialized successfully');
    return { isTG: true, tg };
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return { isTG: false };
  }
}
