// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

/**
 * Custom hook untuk sync state dengan localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value jika key tidak ada
 * @returns {Array} [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage