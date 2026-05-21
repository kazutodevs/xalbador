import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.config) === JSON.stringify(item.config)
      )
      
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += item.quantity || 1
        return updated
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (itemId, config = null) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === itemId && JSON.stringify(item.config) === JSON.stringify(config))
      )
    )
  }

  const updateQuantity = (itemId, quantity, config = null) => {
    if (quantity <= 0) {
      removeItem(itemId, config)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId && JSON.stringify(item.config) === JSON.stringify(config)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
