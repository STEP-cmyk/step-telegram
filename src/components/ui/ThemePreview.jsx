import React from 'react'
import { THEMES } from '../../lib/theme'

export default function ThemePreview({ themeId, size = 'md' }) {
  const theme = THEMES[themeId]
  if (!theme) return null

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  // Handle system theme by showing a special preview
  if (themeId === 'system') {
    return (
      <div className={`${sizeClasses[size]} rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800`}>
        <div className="w-1/2 h-1/2 rounded bg-gradient-to-br from-blue-400 to-purple-500" />
      </div>
    )
  }

  // Use colors from the new theme structure
  const bgColor = theme.colors?.bg || '#ffffff'
  const accentColor = theme.colors?.accent || '#3b82f6'

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-1/2 h-1/2 rounded"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  )
}
