// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import api from '@services/api'
import toast from 'react-hot-toast'

/**
 * Custom hook untuk fetch dan manage products
 * @param {string|null} category - Filter by category slug
 * @returns {Object} Products state dan methods
 */
export function useProducts(category = null) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = category ? { category } : {}
      const response = await api.get('/products', { params })
      setProducts(response.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError(err.message)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const refetch = () => {
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    refetch,
  }
}

export default useProducts