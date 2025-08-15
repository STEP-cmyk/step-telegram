import React from 'react'
import { Check, Monitor } from 'lucide-react'
import { THEMES } from '../../lib/theme'
import ThemePreview from './ThemePreview'

export default function ThemePicker({ selectedTheme, onThemeChange }) {
  const handleThemeSelect = (themeId) => {
    try {
      onThemeChange(themeId)
    } catch (error) {
      console.error('Error changing theme:', error)
      // Fallback to dark theme if there's an error
      onThemeChange('dark')
    }
  }

  // Group themes by category
  const groupedThemes = Object.values(THEMES).reduce((acc, theme) => {
    if (!acc[theme.category]) {
      acc[theme.category] = []
    }
    acc[theme.category].push(theme)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedThemes).map(([category, themes]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {category}
          </h3>
          <div className="grid gap-3">
            {themes.map((theme) => (
              <ThemeOption
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ThemeOption({ theme, isSelected, onSelect }) {
  const handleClick = () => {
    onSelect(theme.id)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(theme.id)
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
      style={{ minHeight: '44px' }}
      aria-pressed={isSelected}
      tabIndex={0}
    >
      <div className="flex items-center gap-4">
        {/* Theme Preview */}
        <div className="flex-shrink-0">
          <ThemePreview themeId={theme.id} size="md" />
        </div>

        {/* Theme Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {theme.name}
            </h4>
            {theme.id === 'system' && (
              <Monitor size={14} className="text-gray-500 dark:text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {theme.description}
          </p>
        </div>

        {/* Selection Indicator */}
        <div className="flex-shrink-0">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      </div>
    </button>
  )
}
