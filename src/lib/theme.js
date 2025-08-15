// Theme definitions with WCAG 2.1 AA compliant contrast ratios
export const THEMES = {
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
  dim: {
    id: 'dim',
    name: 'Dim',
    description: 'Softer dark theme, battery-friendly',
    category: 'Dark',
    colors: {
      bg: '#1e293b',
      bgSecondary: '#334155',
      bgTertiary: '#475569',
      text: '#f1f5f9',
      textSecondary: '#e2e8f0',
      textTertiary: '#cbd5e1',
      border: '#475569',
      borderSecondary: '#64748b',
      accent: '#60a5fa',
      accentSecondary: '#93c5fd',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171'
    }
  },
  amoled: {
    id: 'amoled',
    name: 'AMOLED',
    description: 'Pure black for OLED screens',
    category: 'Dark',
    colors: {
      bg: '#000000',
      bgSecondary: '#0a0a0a',
      bgTertiary: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#e5e7eb',
      textTertiary: '#d1d5db',
      border: '#2a2a2a',
      borderSecondary: '#404040',
      accent: '#3b82f6',
      accentSecondary: '#60a5fa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },

  solarizedDark: {
    id: 'solarizedDark',
    name: 'Solarized Dark',
    description: 'Low contrast, easy on the eyes',
    category: 'Specialized',
    colors: {
      bg: '#002b36',
      bgSecondary: '#073642',
      bgTertiary: '#073642',
      text: '#fdf6e3',
      textSecondary: '#eee8d5',
      textTertiary: '#93a1a1',
      border: '#586e75',
      borderSecondary: '#cb4b16',
      accent: '#268bd2',
      accentSecondary: '#6c71c4',
      success: '#859900',
      warning: '#cb4b16',
      error: '#dc322f'
    }
  },
  highContrast: {
    id: 'highContrast',
    name: 'High Contrast',
    description: 'Maximum readability and accessibility',
    category: 'Accessibility',
    colors: {
      bg: '#000000',
      bgSecondary: '#000000',
      bgTertiary: '#000000',
      text: '#ffffff',
      textSecondary: '#ffffff',
      textTertiary: '#ffffff',
      border: '#ffffff',
      borderSecondary: '#ffffff',
      accent: '#ffff00',
      accentSecondary: '#ffff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000'
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
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'
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
    html.classList.remove('dark', 'light', 'dim', 'amoled', 'solarized-light', 'solarized-dark', 'high-contrast')
    body.classList.remove('dark', 'light', 'dim', 'amoled', 'solarized-light', 'solarized-dark', 'high-contrast')
    
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
    if (['dark', 'dim', 'amoled', 'solarizedDark', 'highContrast'].includes(actualTheme)) {
      html.classList.add('dark')
      body.classList.add('dark')
    }
    
    console.log('Applied theme:', themeId, 'actual theme:', actualTheme)
    console.log('HTML classes:', html.className)
    console.log('HTML data-theme:', html.getAttribute('data-theme'))
    
  } catch (error) {
    console.error('Error applying theme:', error)
    // Fallback to dark theme
    const html = document.documentElement
    const body = document.body
    html.classList.remove('dark', 'light', 'dim', 'amoled', 'solarized-light', 'solarized-dark', 'high-contrast')
    body.classList.remove('dark', 'light', 'dim', 'amoled', 'solarized-light', 'solarized-dark', 'high-contrast')
    html.classList.add('dark')
    body.classList.add('dark')
    html.setAttribute('data-theme', 'dark')
    body.setAttribute('data-theme', 'dark')
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
  return document.documentElement.getAttribute('data-theme') || 'dark'
}

// Initialize theme on app start
export function initializeTheme(savedTheme = 'dark') {
  console.log('Initializing theme with:', savedTheme)
  applyTheme(savedTheme, { withFade: false })
}
