// Мини-конфетти без зависимостей (для "достижений")
export function mountConfetti() {
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: 9999,
  });
  document.body.appendChild(box);

  function fire(x = window.innerWidth / 2, y = window.innerHeight / 3) {
    const colors = ["#60a5fa", "#f472b6", "#34d399", "#f59e0b", "#ef4444"];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement("div");
      const s = 6 + Math.random() * 6;
      Object.assign(p.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${s}px`,
        height: `${s * 0.6}px`,
        background: colors[i % colors.length],
        opacity: "0.9",
        transform: `translateZ(0) rotate(${Math.random() * 360}deg)`,
        transition: "transform 700ms cubic-bezier(.2,.7,.2,1), opacity 700ms linear",
      });
      box.appendChild(p);
      requestAnimationFrame(() => {
        const dx = (Math.random() - 0.5) * 200;
        const dy = 200 + Math.random() * 200;
        const rz = Math.random() * 720;
        p.style.transform = `translate(${dx}px, ${dy}px) rotate(${rz}deg)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 800);
    }
  }

  function destroy() {
    box.remove();
  }

  return { fire, destroy };
}
