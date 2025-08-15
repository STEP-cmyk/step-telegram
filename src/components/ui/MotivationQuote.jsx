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
          setQuote("The first step doesn't have to be perfect, it has to be taken.")
        }
      } else {
        setQuote("The first step doesn't have to be perfect, it has to be taken.")
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
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-blue-600 dark:text-blue-400">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            {t('motivationOfTheDay')}
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors disabled:opacity-50"
          title={t('tapToChange')}
        >
          <RefreshCw 
            size={16} 
            className={`text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      <blockquote className="text-blue-900 dark:text-blue-100 text-lg leading-relaxed mb-3">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-blue-600 dark:text-blue-400 opacity-75">
          {t('tapToChange')}
        </p>
        {isOffline && (
          <p className="text-xs text-orange-600 dark:text-orange-400 opacity-75">
            {t('offline')}
          </p>
        )}
      </div>
    </div>
  )
}
