export function applyTheme(theme, { withFade = false } = {}) {
  const root = document.documentElement
  if (withFade) {
    root.classList.add('theme-fading')
    setTimeout(()=> root.classList.remove('theme-fading'), 350)
  }
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}
