// Currency system for the app
export const CURRENCIES = {
  RUB: {
    symbol: '₽',
    name: 'RUB',
    format: (amount) => `${amount.toLocaleString('ru-RU')} ₽`
  },
  USD: {
    symbol: '$',
    name: 'USD',
    format: (amount) => `$${amount.toLocaleString('en-US')}`
  },
  EUR: {
    symbol: '€',
    name: 'EUR',
    format: (amount) => `${amount.toLocaleString('de-DE')} €`
  }
}

// Get currency settings from app state
export function getCurrencySettings(data) {
  const currencyCode = data?.settings?.units?.currency || 'RUB'
  return CURRENCIES[currencyCode] || CURRENCIES.RUB
}

// Format amount with current currency
export function formatCurrency(amount, data) {
  const currency = getCurrencySettings(data)
  return currency.format(amount)
}

// Get currency symbol
export function getCurrencySymbol(data) {
  const currency = getCurrencySettings(data)
  return currency.symbol
}
