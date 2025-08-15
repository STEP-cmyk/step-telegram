import React from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeOff, Settings } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

export default function HiddenSection({ sectionName }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <EyeOff size={24} className="text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          {t('sectionHidden')}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          {t('sectionHiddenDescription', { section: sectionName })}
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center gap-2 mx-auto"
        >
          <Settings size={16} />
          {t('goToSettings')}
        </button>
      </div>
    </div>
  )
}
