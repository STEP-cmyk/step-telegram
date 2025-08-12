// Лёгкий параллакс для фонового градиента (через CSS-переменные)
export function bindParallax() {
  const root = document.documentElement;

  const onMouse = (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX - w / 2) / w; // -0.5..0.5
    const y = (e.clientY - h / 2) / h; // -0.5..0.5
    root.style.setProperty("--parallax-x", x.toFixed(3));
    root.style.setProperty("--parallax-y", y.toFixed(3));
  };

  const onTilt = (ev) => {
    // beta: -180..180 (наклон вперёд/назад), gamma: -90..90 (влево/вправо)
    const x = (ev.gamma || 0) / 45; // примерно -2..2 -> нормализуем
    const y = (ev.beta || 0) / 45;
    root.style.setProperty("--parallax-x", x.toFixed(3));
    root.style.setProperty("--parallax-y", y.toFixed(3));
  };

  window.addEventListener("mousemove", onMouse, { passive: true });
  window.addEventListener("deviceorientation", onTilt, { passive: true });

  return () => {
    window.removeEventListener("mousemove", onMouse);
    window.removeEventListener("deviceorientation", onTilt);
  };
}
