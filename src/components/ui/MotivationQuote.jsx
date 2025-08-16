import React, { useState, useEffect } from 'react'
import { RefreshCw, Quote } from 'lucide-react'
import { getCurrentQuote, getNextQuote } from '../../lib/quotes'
import { useTranslation } from '../../lib/i18n'

export default function MotivationQuote() {
  const [quote, setQuote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const { t, currentLang } = useTranslation()

  // Load initial quote
  useEffect(() => {
    loadQuote()
  }, [currentLang])

  const loadQuote = async () => {
    try {
      setIsLoading(true)
      setIsOffline(false)
      const currentQuote = await getCurrentQuote(currentLang)
      setQuote(currentQuote)
    } catch (error) {
      console.error('Error loading quote:', error)
      // Fallback to English quote if Russian fails
      if (currentLang === 'ru') {
        try {
          const fallbackQuote = await getCurrentQuote('en')
          setQuote(fallbackQuote)
          setIsOffline(true)
        } catch (fallbackError) {
          setQuote(t('fallbackQuote'))
        }
      } else {
        setQuote(t('fallbackQuote'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      setIsOffline(false)
      const nextQuote = await getNextQuote(currentLang)
      setQuote(nextQuote)
    } catch (error) {
      console.error('Error refreshing quote:', error)
      // Fallback to English quote if Russian fails
      if (currentLang === 'ru') {
        try {
          const fallbackQuote = await getNextQuote('en')
          setQuote(fallbackQuote)
          setIsOffline(true)
        } catch (fallbackError) {
          console.error('Fallback quote also failed:', fallbackError)
        }
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="group relative w-full rounded-2xl border backdrop-blur-md bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/60 dark:border-blue-800/30 overflow-hidden p-6">
        {/* Subtle gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60" />
        
        <div className="relative h-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-black dark:text-blue-50 font-medium">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative w-full rounded-2xl border backdrop-blur-md bg-gradient-to-br from-blue-50/80 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/60 dark:border-blue-800/30 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg shadow-blue-200/30 dark:shadow-blue-900/40 overflow-hidden">
      {/* Subtle gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 opacity-60" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full" />

      <div className="relative h-full p-6 flex flex-col">
        {/* Header with icon and title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Quote size={20} />
            </div>
            <h2 className="text-lg font-semibold text-black dark:text-blue-50">
              {t('motivationOfTheDay')}
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            title={t('tapToChange')}
          >
            <RefreshCw 
              size={16} 
              className={`text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        
        {/* Main quote text */}
        <blockquote className="text-black dark:text-blue-50 text-lg leading-relaxed mb-4 font-medium flex-1">
          "{quote}"
        </blockquote>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-600 dark:text-blue-100/75">
            {t('tapToChange')}
          </p>
          {isOffline && (
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {t('offline')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
