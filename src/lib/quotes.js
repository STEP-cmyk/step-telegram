// Quote service for motivation quotes
const CACHE_KEY = 'step_020_quotes_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Fallback quotes if API fails
const FALLBACK_QUOTES = {
  en: [
    "If you want — you look for opportunities, if you don't want — you look for reasons.",
    "The first step doesn't have to be perfect, it has to be taken.",
    "Habits are the dividends of discipline.",
    "Small steps every day are stronger than motivation once a month.",
    "Write it down — your head rests, the system works.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "It always seems impossible until it's done."
  ],
  ru: [
    "Если хочешь — ищешь возможности, если не хочешь — ищешь причины.",
    "Первый шаг не должен быть идеальным, он должен быть сделан.",
    "Привычки — это дивиденды дисциплины.",
    "Маленькие шаги каждый день сильнее мотивации раз в месяц.",
    "Записывай — голова отдыхает, система работает.",
    "Успех не окончателен, неудача не фатальна: важно мужество продолжать.",
    "Единственный способ делать великую работу — любить то, что делаешь.",
    "Не смотри на часы; делай то, что они делают. Продолжай.",
    "Будущее зависит от того, что ты делаешь сегодня.",
    "Всегда кажется невозможным, пока не сделано."
  ]
}

// Get cached quote data
function getCachedQuote(language = 'en') {
  if (typeof window === 'undefined') return null
  
  try {
    const cacheKey = `${CACHE_KEY}_${language}`
    const cached = localStorage.getItem(cacheKey)
    if (!cached) return null
    
    const data = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data
    }
    
    return null
  } catch (error) {
    console.error('Error reading cached quote:', error)
    return null
  }
}

// Save quote to cache
function saveQuoteToCache(quote, index, language = 'en') {
  if (typeof window === 'undefined') return
  
  try {
    const cacheKey = `${CACHE_KEY}_${language}`
    const data = {
      quote,
      index,
      language,
      timestamp: Date.now()
    }
    localStorage.setItem(cacheKey, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving quote to cache:', error)
  }
}

// Fetch quote from API
async function fetchQuote(language = 'en') {
  try {
    // For Russian, try to fetch from a Russian quote API or use fallback
    if (language === 'ru') {
      // Try Russian quote API (if available)
      try {
        const response = await fetch('https://api.quotable.io/random?tags=motivation|success|inspiration&language=ru', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          timeout: 5000
        })
        
        if (response.ok) {
          const data = await response.json()
          return data.content
        }
      } catch (error) {
        console.warn('Failed to fetch Russian quote from API:', error)
      }
      
      // Fallback to English API for Russian (will be translated)
      console.log('Using English API for Russian quotes')
    }
    
    // Try to fetch from a free quote API
    const response = await fetch('https://api.quotable.io/random?tags=motivation|success|inspiration', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      timeout: 5000
    })
    
    if (!response.ok) {
      throw new Error('API response not ok')
    }
    
    const data = await response.json()
    return data.content
  } catch (error) {
    console.warn('Failed to fetch quote from API:', error)
    return null
  }
}

// Get current quote (cached or new)
export async function getCurrentQuote(language = 'en') {
  // Check cache first
  const cached = getCachedQuote(language)
  if (cached) {
    return cached.quote
  }
  
  // Try to fetch new quote
  const newQuote = await fetchQuote(language)
  if (newQuote) {
    saveQuoteToCache(newQuote, 0, language)
    return newQuote
  }
  
  // Fallback to random quote from our list
  const quotes = FALLBACK_QUOTES[language] || FALLBACK_QUOTES.en
  const randomIndex = Math.floor(Math.random() * quotes.length)
  const fallbackQuote = quotes[randomIndex]
  saveQuoteToCache(fallbackQuote, randomIndex, language)
  return fallbackQuote
}

// Get next quote (for tap to change)
export async function getNextQuote(language = 'en') {
  // Try to fetch new quote
  const newQuote = await fetchQuote(language)
  if (newQuote) {
    saveQuoteToCache(newQuote, 0, language)
    return newQuote
  }
  
  // Fallback to next quote from our list
  const cached = getCachedQuote(language)
  const quotes = FALLBACK_QUOTES[language] || FALLBACK_QUOTES.en
  const currentIndex = cached ? cached.index : -1
  const nextIndex = (currentIndex + 1) % quotes.length
  const nextQuote = quotes[nextIndex]
  saveQuoteToCache(nextQuote, nextIndex, language)
  return nextQuote
}
