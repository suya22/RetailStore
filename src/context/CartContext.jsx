"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { TAX_RATE } from "../utils/currency"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((item) => item.productId === action.payload.productId)

      let newItems
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            const newQty = Math.min(item.quantity + action.payload.quantity, action.payload.maxStock)
            return { ...item, quantity: newQty }
          }
          return item
        })
      } else {
        newItems = [...state.items, action.payload]
      }

      return { ...state, items: newItems }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) => {
          if (item.productId === action.payload.productId) {
            return { ...item, quantity: Math.min(action.payload.quantity, item.maxStock) }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      return { ...state, items: newItems }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      }
    }

    case "CLEAR_CART": {
      return { ...state, items: [] }
    }

    case "LOAD_CART": {
      return { ...state, items: action.payload }
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (e) {
        console.error("Failed to load cart:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
        maxStock: product.stock,
      },
    })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
  }

  const removeItem = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
