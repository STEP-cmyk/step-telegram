// src/components/ui/Tooltip.jsx
import React from "react";

/**
 * Простой тултип без сторонних библиотек.
 * Пример: <Tooltip text="Настройки"><Button>Settings</Button></Tooltip>
 */
export default function Tooltip({ text, side = "top", children, className = "" }) {
  const pos =
    side === "top"
      ? "bottom-full mb-1 left-1/2 -translate-x-1/2"
      : side === "bottom"
      ? "top-full mt-1 left-1/2 -translate-x-1/2"
      : side === "left"
      ? "right-full mr-2 top-1/2 -translate-y-1/2"
      : "left-full ml-2 top-1/2 -translate-y-1/2"; // right

  return (
    <span className={`relative inline-flex group ${className}`}>
      {children}
      <span
        className={`pointer-events-none absolute whitespace-nowrap rounded-xl px-2 py-1 text-xs font-medium
        shadow-lg backdrop-blur-md bg-black/70 text-white
        opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
        transition-all duration-150 ${pos}`}
      >
        {text}
      </span>
    </span>
  );
}
