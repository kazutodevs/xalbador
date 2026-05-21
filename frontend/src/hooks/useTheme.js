// src/hooks/useTheme.js
import { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'

/**
 * Custom hook untuk mengakses theme context
 * @returns {Object} Theme context value dengan toggle function
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

export default useTheme