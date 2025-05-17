import { createContext, ReactNode, useContext, useState } from 'react'

import { showToast } from '@lib/toasts/toast'
import { CartItem } from '@models/cart.model'
import { ICart, IProduct } from '@models/index'
import { getMyCart, updateCart } from '@services/cartService'

type CartState = {
  cart: ICart | null
}

type CartContextType = CartState & {
  initializeCart: () => Promise<void>
  setCart: (cart: ICart | null) => void
  addToCart: (product: IProduct) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateCartItemQuantity: (
    productId: number,
    newQuantity: number
  ) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({
    cart: null,
  })

  const setCart = (cart: ICart | null) =>
    setState((prev) => ({ ...prev, cart }))

  const initializeCart = async () => {
    try {
      const response = await getMyCart()

      if (!response.success) {
        throw new Error('Failed to initialize cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to initialize cart', 'error')
      console.error('Error adding to cart:', error)
    }
  }

  const addToCart = async (product: IProduct) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const currentItems = (state.cart.items || []) as CartItem[]
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === product.id
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = [...currentItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        }
      } else {
        newItems = [
          ...currentItems,
          {
            ...product,
            quantity: 1,
          },
        ]
      }

      const response = await updateCart(state.cart.documentId, newItems)
      if (!response.success) {
        throw new Error('Failed to update cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to add item to cart', 'error')
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (productId: number) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const currentItems = (state.cart.items || []) as CartItem[]
      const newItems = currentItems.filter((item) => item.id !== productId)

      const response = await updateCart(state.cart.documentId, newItems)
      if (!response.success) {
        throw new Error('Failed to update cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to remove item from cart', 'error')
      console.error('Error removing from cart:', error)
    }
  }

  const updateCartItemQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const currentItems = (state.cart.items || []) as CartItem[]
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === productId
      )

      if (existingItemIndex === -1) {
        showToast('Item not found in cart', 'error')
        return
      }

      const newItems = [...currentItems]
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newQuantity,
      }

      const response = await updateCart(state.cart.documentId, newItems)
      if (!response.success) {
        throw new Error('Failed to update cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to update item quantity', 'error')
      console.error('Error updating item quantity:', error)
    }
  }

  const clearCart = async () => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const response = await updateCart(state.cart.documentId, [])
      if (!response.success) {
        throw new Error('Failed to clear cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to clear cart', 'error')
      console.error('Error clearing cart:', error)
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        initializeCart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
