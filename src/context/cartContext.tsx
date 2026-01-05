import { createContext, ReactNode, useContext, useState } from 'react'

import { showToast } from '@lib/toasts/toast'
import { IAdditionalIngredient } from '@models/additionalIngredient.model'
import { CartItem } from '@models/cart.model'
import { ICart, IProduct } from '@models/index'
import { IProductPortion } from '@models/portion.model'
import { IProductTemperature } from '@models/product.model'
import { getMyCart, updateCart } from '@services/cartService'

type CartState = {
  cart: ICart | null
}

type CartContextType = CartState & {
  initializeCart: () => Promise<void>
  setCart: (cart: ICart | null) => void
  addToCart: (
    product: IProduct,
    config: {
      portion: IProductPortion
      temperature?: IProductTemperature
      additionalIngredients: IAdditionalIngredient[]
      quantity: number
    }
  ) => Promise<void>
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

  const addToCart = async (
    product: IProduct,
    config: {
      portion: IProductPortion
      temperature?: IProductTemperature
      additionalIngredients: IAdditionalIngredient[]
      quantity: number
    }
  ) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const currentItems = (state.cart.items || []) as CartItem[]

      // Calculate final price including additional ingredients
      const ingredientsPrice = config.additionalIngredients.reduce(
        (sum, ing) => sum + ing.priceModifier,
        0
      )
      const finalPrice = config.portion.price + ingredientsPrice

      // Check if exact same item exists (same product ID, same final price)
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === product.id && item.price === finalPrice
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...currentItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + config.quantity,
        }
      } else {
        // Add new item
        const { portions, ...productWithoutPortions } = product
        newItems = [
          ...currentItems,
          {
            ...productWithoutPortions,
            price: finalPrice,
            weight: config.portion.weight,
            quantity: config.quantity,
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
