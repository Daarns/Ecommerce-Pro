'use client'
import { createContext, useContext, useReducer, useEffect } from 'react'
import { getLocalStorage, setLocalStorage } from '@/app/lib/utils'

const CartContext = createContext()

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  TOGGLE_CART: 'TOGGLE_CART'
}

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1, size, color } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && 
                item.size === size && 
                item.color === color
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
        return {
          ...state,
          items: updatedItems
        }
      } else {
        // Add new item
        const newItem = {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          product,
          quantity,
          size,
          color,
          addedAt: new Date().toISOString()
        }
        return {
          ...state,
          items: [...state.items, newItem]
        }
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId)
      }
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      }
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      }
    }

    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      }
    }

    case CART_ACTIONS.TOGGLE_CART: {
      return {
        ...state,
        isOpen: !state.isOpen
      }
    }

    default:
      return state
  }
}

// Initial state
const initialState = {
  items: [],
  isOpen: false
}

// Cart provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getLocalStorage('cart', { items: [] })
    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedCart })
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length >= 0) {
      setLocalStorage('cart', { items: state.items })
    }
  }, [state.items])

  // Cart actions
  const addToCart = (product, options = {}) => {
    const { quantity = 1, size = '', color = '' } = options
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity, size, color }
    })
  }

  const removeFromCart = (itemId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { itemId }
    })
  }

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART })
  }

  // Cart calculations
  const cartStats = {
    totalItems: state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    totalOriginalPrice: state.items.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price
      return total + (originalPrice * item.quantity)
    }, 0),
    uniqueItems: state.items.length
  }

  cartStats.savings = cartStats.totalOriginalPrice - cartStats.totalPrice

  const value = {
    ...state,
    ...cartStats,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export { CART_ACTIONS }