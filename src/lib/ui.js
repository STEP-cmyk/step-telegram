// Управление масштабом UI (влияет на базовый размер шрифта)
export function applyUIScale(scale = "md") {
  const root = document.documentElement;
  const map = { sm: 0.94, md: 1, lg: 1.08 };
  const factor = map[scale] ?? 1;
  root.style.setProperty("--ui-scale", String(factor));
  // подстрахуем браузеры без var() — меняем base font-size
  root.style.fontSize = `${16 * factor}px`;
}
