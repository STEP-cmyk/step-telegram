// Telegram Web App Debug Utility
export function debugTelegramWebApp() {
  const debug = {
    isTelegram: false,
    webApp: null,
    user: null,
    initData: null,
    colorScheme: null,
    platform: null,
    version: null,
    errors: []
  }

  try {
    // Check if we're in a browser
    if (typeof window === 'undefined') {
      debug.errors.push('Not in browser environment')
      return debug
    }

    // Check if Telegram WebApp is available
    if (!window.Telegram) {
      debug.errors.push('Telegram object not found')
      return debug
    }

    if (!window.Telegram.WebApp) {
      debug.errors.push('Telegram.WebApp not found')
      return debug
    }

    const tg = window.Telegram.WebApp
    debug.isTelegram = true
    debug.webApp = tg
    debug.colorScheme = tg.colorScheme
    debug.platform = tg.platform
    debug.version = tg.version

    // Try to get user info
    try {
      debug.user = tg.initDataUnsafe?.user || null
    } catch (error) {
      debug.errors.push(`Error getting user: ${error.message}`)
    }

    // Try to get init data
    try {
      debug.initData = tg.initData || null
    } catch (error) {
      debug.errors.push(`Error getting init data: ${error.message}`)
    }

    // Test WebApp methods
    try {
      tg.ready()
      debug.errors.push('tg.ready() called successfully')
    } catch (error) {
      debug.errors.push(`Error calling tg.ready(): ${error.message}`)
    }

    try {
      tg.expand()
      debug.errors.push('tg.expand() called successfully')
    } catch (error) {
      debug.errors.push(`Error calling tg.expand(): ${error.message}`)
    }

  } catch (error) {
    debug.errors.push(`General error: ${error.message}`)
  }

  return debug
}

// Log debug info to console
export function logTelegramDebug() {
  const debug = debugTelegramWebApp()
  console.log('=== Telegram Web App Debug Info ===')
  console.log('Is Telegram:', debug.isTelegram)
  console.log('Color Scheme:', debug.colorScheme)
  console.log('Platform:', debug.platform)
  console.log('Version:', debug.version)
  console.log('User:', debug.user)
  console.log('Init Data:', debug.initData)
  console.log('Errors:', debug.errors)
  console.log('====================================')
  return debug
}

// Check for common Telegram Web App issues
export function checkTelegramIssues() {
  const issues = []
  
  // Check if we're in an iframe
  try {
    if (window.self !== window.top) {
      issues.push('Running in iframe (expected for Telegram Web App)')
    } else {
      issues.push('Not running in iframe (unexpected for Telegram Web App)')
    }
  } catch (error) {
    issues.push('Cannot check iframe status (likely in iframe)')
  }

  // Check for localStorage
  try {
    if (typeof window.localStorage === 'undefined') {
      issues.push('localStorage not available')
    } else {
      // Test localStorage
      const testKey = '__telegram_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
    }
  } catch (error) {
    issues.push(`localStorage error: ${error.message}`)
  }

  // Check for sessionStorage
  try {
    if (typeof window.sessionStorage === 'undefined') {
      issues.push('sessionStorage not available')
    }
  } catch (error) {
    issues.push(`sessionStorage error: ${error.message}`)
  }

  // Check for IndexedDB
  try {
    if (typeof window.indexedDB === 'undefined') {
      issues.push('IndexedDB not available')
    }
  } catch (error) {
    issues.push(`IndexedDB error: ${error.message}`)
  }

  // Check for Web Workers
  try {
    if (typeof window.Worker === 'undefined') {
      issues.push('Web Workers not available')
    }
  } catch (error) {
    issues.push(`Web Workers error: ${error.message}`)
  }

  return issues
}

// Initialize debug logging
export function initTelegramDebug() {
  // Log debug info on page load
  setTimeout(() => {
    logTelegramDebug()
    const issues = checkTelegramIssues()
    if (issues.length > 0) {
      console.log('=== Telegram Web App Issues ===')
      issues.forEach(issue => console.log('-', issue))
      console.log('===============================')
    }
  }, 1000)

  // Log debug info when Telegram WebApp is ready
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.onEvent('ready', () => {
        console.log('=== Telegram Web App Ready ===')
        logTelegramDebug()
      })
    } catch (error) {
      console.error('Error setting up Telegram WebApp ready event:', error)
    }
  }
}
