import React from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

export default function LanguageSelector() {
  const { t, currentLang, changeLanguage } = useTranslation()

  const RussiaFlag = () => (
    <svg width="32" height="21" viewBox="0 0 32 21" className="rounded border border-gray-200/50" aria-label="Russia">
      <rect width="32" height="21" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
      <rect x="0" y="0" width="32" height="7" fill="#ffffff"/>
      <rect x="0" y="7" width="32" height="7" fill="#0052cc"/>
      <rect x="0" y="14" width="32" height="7" fill="#d52b1e"/>
    </svg>
  )

  const USAFlag = () => (
    <svg width="32" height="21" viewBox="0 0 32 21" className="rounded border border-gray-200/50" aria-label="United States">
      <rect width="32" height="21" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
      <rect x="0" y="0" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="1.615" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="3.23" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="4.845" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="6.46" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="8.075" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="9.69" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="11.305" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="12.92" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="14.535" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="16.15" width="32" height="1.615" fill="#B22234"/>
      <rect x="0" y="17.765" width="32" height="1.615" fill="#FFFFFF"/>
      <rect x="0" y="19.38" width="32" height="1.62" fill="#B22234"/>
      <rect x="0" y="0" width="12.8" height="10.765" fill="#3C3B6E"/>
    </svg>
  )

  const languages = [
    { code: 'en', name: 'English', flag: USAFlag },
    { code: 'ru', name: 'Русский', flag: RussiaFlag }
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
        {languages.map((lang) => {
          const FlagComponent = lang.flag
          return (
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
              aria-label={lang.name}
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <FlagComponent />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {lang.name}
                  </div>
                  {currentLang === lang.code && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
