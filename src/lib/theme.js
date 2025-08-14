export function applyTheme(theme, { withFade = false } = {}) {
  console.log('applyTheme called with:', theme, 'withFade:', withFade)
  
  const root = document.documentElement
  const body = document.body
  
  // Remove any existing theme classes
  root.classList.remove('dark', 'light')
  body.classList.remove('dark', 'light')
  
  if (withFade) {
    root.classList.add('theme-fading')
    setTimeout(() => root.classList.remove('theme-fading'), 350)
  }
  
  // Apply the selected theme using Tailwind's dark mode
  if (theme === 'dark') {
    root.classList.add('dark')
    body.classList.add('dark')
    console.log('Applied dark theme class to html and body')
  } else {
    // Light theme - explicitly remove dark class to ensure light theme
    root.classList.remove('dark')
    body.classList.remove('dark')
    console.log('Applied light theme (removed dark class from html and body)')
  }
  
  // Set data-theme attribute for additional styling if needed
  root.setAttribute('data-theme', theme)
  body.setAttribute('data-theme', theme)
  console.log('Set data-theme to:', theme, 'on both html and body')
  
  // Force a repaint to ensure styles are applied
  root.style.display = 'none'
  root.offsetHeight // Trigger reflow
  root.style.display = ''
  
  console.log('Theme application complete. HTML classes:', root.className)
  console.log('Body classes:', body.className)
  console.log('Current computed background color:', getComputedStyle(root).backgroundColor)
}
