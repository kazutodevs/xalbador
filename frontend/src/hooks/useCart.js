// src/hooks/useCart.js
import { useContext } from 'react'
import { CartContext } from '@context/CartContext'

/**
 * Custom hook untuk mengakses cart context
 * @returns {Object} Cart context value dengan methods
 */
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}

export default useCart