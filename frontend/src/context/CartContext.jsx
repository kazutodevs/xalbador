import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

const CartContext = createContext()

function areConfigsEqual(a, b) {
  try {
    return JSON.stringify(a || null) === JSON.stringify(b || null)
  } catch (e) {
    return false
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }, [items])

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === item.id && areConfigsEqual(i.config, item.config)
      )

      if (idx > -1) {
        const updated = [...prev]
        updated[idx] = {
          ...updated[idx],
          quantity: (Number(updated[idx].quantity) || 0) + (Number(item.quantity) || 1),
        }
        return updated
      }

      return [...prev, { ...item, quantity: Number(item.quantity) || 1 }]
    })
  }, [])

  const removeItem = useCallback((itemId, config = null) => {
    setItems((prev) =>
      prev.filter((it) => !(it.id === itemId && areConfigsEqual(it.config, config)))
    )
  }, [])

  const updateQuantity = useCallback((itemId, quantity, config = null) => {
    const qty = Number(quantity)
    setItems((prev) => {
      if (qty <= 0) {
        return prev.filter((it) => !(it.id === itemId && areConfigsEqual(it.config, config)))
      }

      return prev.map((it) =>
        it.id === itemId && areConfigsEqual(it.config, config) ? { ...it, quantity: qty } : it
      )
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  }, [items])

  const count = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }, [items])

  const getTotal = useCallback(() => total, [total])
  const getItemCount = useCallback(() => count, [count])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      total,
      count,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount, total, count]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
