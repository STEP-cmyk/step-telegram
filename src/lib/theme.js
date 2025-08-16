// Theme definitions with WCAG 2.1 AA compliant contrast ratios
export const THEMES = {
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean, minimal, and highly readable',
    category: 'Basic',
    colors: {
      bg: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      text: '#0f172a',
      textSecondary: '#334155',
      textTertiary: '#64748b',
      border: '#e2e8f0',
      borderSecondary: '#cbd5e1',
      accent: '#2563eb',
      accentSecondary: '#3b82f6',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes in low light',
    category: 'Basic',
    colors: {
      bg: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      text: '#f8fafc',
      textSecondary: '#e2e8f0',
      textTertiary: '#cbd5e1',
      border: '#475569',
      borderSecondary: '#64748b',
      accent: '#3b82f6',
      accentSecondary: '#60a5fa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },

  system: {
    id: 'system',
    name: 'System',
    description: 'Follows your OS theme automatically',
    category: 'System',
    colors: null // Will be resolved dynamically
  }
}

// Get system theme preference
export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch (error) {
    console.error('Error getting system theme:', error)
    return 'light'
  }
}

// Apply theme with unified approach and enhanced contrast
export function applyTheme(themeId, { withFade = false } = {}) {
  try {
    console.log('applyTheme called with:', themeId)
    
    const html = document.documentElement
    const body = document.body
    
    // Handle system theme
    let actualTheme = themeId
    if (themeId === 'system') {
      actualTheme = getSystemTheme()
      console.log('System theme resolved to:', actualTheme)
    }
    
    // Get theme definition
    const theme = THEMES[actualTheme] || THEMES.dark
    
    // Remove ALL existing theme classes and attributes
    html.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    
    // Remove data-theme attributes
    html.removeAttribute('data-theme')
    body.removeAttribute('data-theme')
    
    // Clear any existing CSS variables
    const cssVars = [
      '--bg', '--bg-secondary', '--bg-tertiary',
      '--text', '--text-secondary', '--text-tertiary',
      '--border', '--border-secondary',
      '--accent', '--accent-secondary',
      '--success', '--warning', '--error'
    ]
    
    cssVars.forEach(varName => {
      html.style.removeProperty(varName)
      body.style.removeProperty(varName)
    })
    
    // Apply fade transition if requested
    if (withFade) {
      html.classList.add('theme-fading')
      setTimeout(() => html.classList.remove('theme-fading'), 350)
    }
    
    // Apply theme colors as CSS variables
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        html.style.setProperty(cssVar, value)
        body.style.setProperty(cssVar, value)
      })
    }
    
    // Set data-theme attribute for consistency
    html.setAttribute('data-theme', themeId)
    body.setAttribute('data-theme', themeId)
    
    // Apply Tailwind dark class only for dark themes
    if (actualTheme === 'dark') {
      html.classList.add('dark')
      body.classList.add('dark')
    } else {
      // Ensure light themes don't have dark class
      html.classList.remove('dark')
      body.classList.remove('dark')
    }
    
    console.log('Applied theme:', themeId, 'actual theme:', actualTheme)
    console.log('HTML classes:', html.className)
    console.log('HTML data-theme:', html.getAttribute('data-theme'))
    
  } catch (error) {
    console.error('Error applying theme:', error)
    // Fallback to light theme
    const html = document.documentElement
    const body = document.body
    html.classList.remove('dark', 'light')
    body.classList.remove('dark', 'light')
    html.classList.remove('dark')
    body.classList.remove('dark')
    html.setAttribute('data-theme', 'light')
    body.setAttribute('data-theme', 'light')
  }
}

// Listen for system theme changes
export function watchSystemTheme(callback) {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e) => {
    console.log('System theme changed:', e.matches ? 'dark' : 'light')
    callback(e.matches ? 'dark' : 'light')
  }
  
  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

// Get current theme
export function getCurrentTheme() {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') || 'light'
}

// Initialize theme on app start
export function initializeTheme(savedTheme = 'dark') {
  console.log('Initializing theme with:', savedTheme)
  applyTheme(savedTheme, { withFade: false })
}
