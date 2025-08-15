// Safe storage utilities with fallback to in-memory storage
const memoryStorage = new Map()

// Safe localStorage getter
export function safeGet(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, using memory storage')
      return memoryStorage.get(key) || defaultValue
    }
    
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    
    try {
      return JSON.parse(item)
    } catch (parseError) {
      console.error('Error parsing localStorage item:', parseError)
      return item // Return as string if JSON parsing fails
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return memoryStorage.get(key) || defaultValue
  }
}

// Safe localStorage setter
export function safeSet(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, using memory storage')
      memoryStorage.set(key, value)
      return true
    }
    
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    // Fallback to memory storage
    try {
      memoryStorage.set(key, value)
      return true
    } catch (memoryError) {
      console.error('Error writing to memory storage:', memoryError)
      return false
    }
  }
}

// Safe localStorage remover
export function safeRemove(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, removing from memory storage')
      memoryStorage.delete(key)
      return true
    }
    
    localStorage.removeItem(key)
    memoryStorage.delete(key) // Also remove from memory storage
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    try {
      memoryStorage.delete(key)
      return true
    } catch (memoryError) {
      console.error('Error removing from memory storage:', memoryError)
      return false
    }
  }
}

// Safe localStorage clear
export function safeClear() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, clearing memory storage')
      memoryStorage.clear()
      return true
    }
    
    localStorage.clear()
    memoryStorage.clear() // Also clear memory storage
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    try {
      memoryStorage.clear()
      return true
    } catch (memoryError) {
      console.error('Error clearing memory storage:', memoryError)
      return false
    }
  }
}

// Check if storage is available
export function isStorageAvailable() {
  try {
    if (typeof window === 'undefined') return false
    if (!window.localStorage) return false
    
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.error('Storage not available:', error)
    return false
  }
}

// Get storage info for debugging
export function getStorageInfo() {
  return {
    localStorageAvailable: typeof window !== 'undefined' && !!window.localStorage,
    memoryStorageSize: memoryStorage.size,
    storageType: isStorageAvailable() ? 'localStorage' : 'memory'
  }
}
