import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// ✅ ADD: Number formatting utility
export function formatNumber(number) {
  return new Intl.NumberFormat('id-ID').format(number)
}

// ✅ ADD: Discount calculation utility
export function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || !currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// ✅ ADD: Slugify utility for URL-friendly strings
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ✅ ADD: Truncate text utility
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// ✅ ADD: Generate star rating utility
export function generateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  }
}

// ✅ ADD: Format large numbers (K, M, B)
export function formatLargeNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// ✅ ADD: Debounce utility for search
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

// ✅ ADD: Check if value is empty
export function isEmpty(value) {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// ✅ ADD: Generate random ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ✅ ADD: Local storage utilities with error handling
export function getLocalStorage(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setLocalStorage(key, value) {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error)
    return false
  }
}

export function removeLocalStorage(key) {
  if (typeof window === 'undefined') return false
  
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

// ✅ ADD: URL parameter utilities
export function getUrlParams(url = window.location.href) {
  if (typeof window === 'undefined') return {}
  
  try {
    const urlObj = new URL(url)
    const params = {}
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  } catch (error) {
    console.error('Error parsing URL parameters:', error)
    return {}
  }
}

export function updateUrlParams(params, replace = false) {
  if (typeof window === 'undefined') return
  
  try {
    const url = new URL(window.location.href)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, value)
      }
    })
    
    const newUrl = url.toString()
    if (replace) {
      window.history.replaceState({}, '', newUrl)
    } else {
      window.history.pushState({}, '', newUrl)
    }
  } catch (error) {
    console.error('Error updating URL parameters:', error)
  }
}

// Theme utilities
export function getStoredTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light'
  }
  return 'light'
}

export function setStoredTheme(theme) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }
}

// ✅ ADD: Validation utilities
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone) {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// ✅ ADD: Array utilities
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key]
    result[group] = result[group] || []
    result[group].push(item)
    return result
  }, {})
}

export function sortBy(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

export function filterBy(array, filters) {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === '' || value === null || value === undefined) return true
      
      if (Array.isArray(value)) {
        return value.length === 0 || value.includes(item[key])
      }
      
      if (typeof value === 'string') {
        return item[key].toLowerCase().includes(value.toLowerCase())
      }
      
      return item[key] === value
    })
  })
}