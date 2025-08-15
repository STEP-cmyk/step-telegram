import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ThemePicker from '../components/ui/ThemePicker'
import { useApp } from '../store/app.jsx'
import { applyTheme, watchSystemTheme } from '../lib/theme'
import { useTranslation } from '../lib/i18n'

export default function ThemeSelection() {
  const navigate = useNavigate()
  const { data, setData } = useApp()
  const { t } = useTranslation()
  const currentTheme = data?.settings?.theme || 'dark'

  // Handle theme change
  const handleThemeChange = (themeId) => {
    try {
      console.log('Theme changed to:', themeId)
      // Apply theme immediately
      applyTheme(themeId, { withFade: true })
      // Update state
      setData(d => ({ 
        ...d, 
        settings: { ...d.settings, theme: themeId } 
      }))
    } catch (error) {
      console.error('Error applying theme:', error)
      // Fallback to dark theme
      applyTheme('dark', { withFade: false })
      setData(d => ({ 
        ...d, 
        settings: { ...d.settings, theme: 'dark' } 
      }))
    }
  }

  // Watch for system theme changes when system theme is selected
  React.useEffect(() => {
    if (currentTheme === 'system') {
      const unsubscribe = watchSystemTheme((isDark) => {
        console.log('System theme changed in ThemeSelection, reapplying system theme')
        applyTheme('system', { withFade: false })
      })
      return unsubscribe
    }
  }, [currentTheme])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('themeSelection')}
        </h1>
      </div>

      {/* Current Theme Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h2 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
          {t('currentTheme')}
        </h2>
        <p className="text-blue-600 dark:text-blue-300">
          {t(currentTheme) || currentTheme}
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
          {t('tapToChange')}
        </p>
      </div>

      {/* Theme Picker */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('availableThemes')}
        </h2>
        <ThemePicker 
          selectedTheme={currentTheme} 
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* Theme Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t('aboutThemes')}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>
            <strong>{t('system')}:</strong> {t('systemTheme')}
          </p>
          <p>
            <strong>{t('highContrast')}:</strong> {t('highContrast')}
          </p>
          <p>
            <strong>{t('amoled')}:</strong> {t('amoled')}
          </p>
        </div>
      </div>
    </div>
  )
}
