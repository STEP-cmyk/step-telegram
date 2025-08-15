import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

export default function LanguageSelector() {
  const { t, currentLang, changeLanguage } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Globe size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {t('language')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {languages.find(lang => lang.code === currentLang)?.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentLang === lang.code
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            style={{ minHeight: '44px' }}
            aria-pressed={currentLang === lang.code}
            tabIndex={0}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {lang.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lang.code.toUpperCase()}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
