// src/lib/tg.js
export function initTG(appSetters) {
  const tg = window.Telegram?.WebApp;
  if (!tg) return { isTG: false };

  // Сообщаем Telegram, что UI готов, и растягиваем вебвью
  tg.ready();
  tg.expand();

  // Синхронизируем тему Telegram -> твоё приложение
  const applyScheme = () => {
    const scheme = tg.colorScheme; // 'light' | 'dark'
    appSetters.setTheme(scheme === 'dark' ? 'dark' : 'light', { withFade: true });
  };
  applyScheme();
  tg.onEvent('themeChanged', applyScheme);

  // Подставим ник из Telegram, если ещё не задан
  const user = tg.initDataUnsafe?.user;
  if (user && !appSetters.getNickname?.()) {
    appSetters.setNickname?.(user.username || user.first_name || 'User');
  }

  return { isTG: true, tg };
}
