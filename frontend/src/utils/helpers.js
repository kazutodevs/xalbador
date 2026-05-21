export function formatCurrency(amount, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date, locale = 'id-ID') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date, locale = 'id-ID') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CN-${timestamp}-${random}`
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function calculateHostingPrice(config) {
  const { cpu, ram, storage } = config
  const cpuPrice = cpu * 25000
  const ramPrice = (ram / 512) * 15000
  const storagePrice = (storage / 5) * 5000
  return cpuPrice + ramPrice + storagePrice
}

export function calculateDeveloperPrice(config) {
  const { duration, requests, complexity } = config
  const basePrice = 150000
  const requestPrice = requests * 50000
  const durationMultiplier = duration.multiplier
  const complexityMultiplier = complexity.multiplier
  return Math.round((basePrice + requestPrice) * complexityMultiplier * durationMultiplier)
}
