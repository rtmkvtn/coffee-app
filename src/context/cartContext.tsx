import { createContext, ReactNode, useContext, useState } from 'react'

import { findMatchingCartItem, getCartItemKey } from '@lib/helpers/cartUtils'
import { showToast } from '@lib/toasts/toast'
import { IAdditionalIngredient } from '@models/additionalIngredient.model'
import { CartItem } from '@models/cart.model'
import { ICart, IProduct } from '@models/index'
import { IProductPortion } from '@models/portion.model'
import { IProductTemperature } from '@models/product.model'
import { getMyCart, updateCart } from '@services/cartService'

type CartState = {
  cart: ICart | null
  operationsInProgress: Set<string>
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
  removeFromCart: (cartItemKey: string) => Promise<void>
  updateCartItemQuantity: (
    cartItemKey: string,
    newQuantity: number
  ) => Promise<void>
  removeFromCartByProductId: (productId: number) => Promise<void>
  updateCartItemQuantityByProductId: (
    productId: number,
    newQuantity: number
  ) => Promise<void>
  clearCart: () => Promise<void>
  isItemOperationInProgress: (cartItemKey: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({
    cart: null,
    operationsInProgress: new Set(),
  })

  const setCart = (cart: ICart | null) =>
    setState((prev) => ({ ...prev, cart }))

  const addOperationInProgress = (key: string) => {
    setState((prev) => ({
      ...prev,
      operationsInProgress: new Set(prev.operationsInProgress).add(key),
    }))
  }

  const removeOperationInProgress = (key: string) => {
    setState((prev) => {
      const newSet = new Set(prev.operationsInProgress)
      newSet.delete(key)
      return { ...prev, operationsInProgress: newSet }
    })
  }

  const isItemOperationInProgress = (cartItemKey: string): boolean => {
    return state.operationsInProgress.has(cartItemKey)
  }

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

      // Find exact matching item (same product, temperature, and ingredients)
      const existingItemIndex = findMatchingCartItem(
        currentItems,
        product.id,
        config.temperature,
        config.additionalIngredients
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
        newItems = [
          ...currentItems,
          {
            ...product,
            price: finalPrice,
            weight: config.portion.weight,
            quantity: config.quantity,
            selectedTemperature: config.temperature,
            selectedAdditionalIngredients: config.additionalIngredients,
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

  const removeFromCart = async (cartItemKey: string) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    // Prevent concurrent operations on the same item
    if (state.operationsInProgress.has(cartItemKey)) {
      return
    }

    addOperationInProgress(cartItemKey)

    try {
      const currentItems = (state.cart.items || []) as CartItem[]
      const newItems = currentItems.filter(
        (item) => getCartItemKey(item) !== cartItemKey
      )

      const response = await updateCart(state.cart.documentId, newItems)
      if (!response.success) {
        throw new Error('Failed to update cart')
      }

      setCart(response.data)
    } catch (error) {
      showToast('Failed to remove item from cart', 'error')
      console.error('Error removing from cart:', error)
    } finally {
      removeOperationInProgress(cartItemKey)
    }
  }

  const updateCartItemQuantity = async (
    cartItemKey: string,
    newQuantity: number
  ) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    // Prevent concurrent operations on the same item
    if (state.operationsInProgress.has(cartItemKey)) {
      return
    }

    // Validate quantity
    if (newQuantity < 1 || newQuantity > 99) {
      showToast('Quantity must be between 1 and 99', 'warning')
      return
    }

    addOperationInProgress(cartItemKey)

    try {
      const currentItems = (state.cart.items || []) as CartItem[]
      const existingItemIndex = currentItems.findIndex(
        (item) => getCartItemKey(item) === cartItemKey
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
    } finally {
      removeOperationInProgress(cartItemKey)
    }
  }

  /**
   * Remove cart item by product ID (for backward compatibility with MenuItem)
   * Removes the FIRST cart item matching the product ID
   */
  const removeFromCartByProductId = async (productId: number) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    const currentItems = (state.cart.items || []) as CartItem[]
    const itemToRemove = currentItems.find((item) => item.id === productId)

    if (itemToRemove) {
      const cartItemKey = getCartItemKey(itemToRemove)
      await removeFromCart(cartItemKey)
    }
  }

  /**
   * Update cart item quantity by product ID (for backward compatibility with MenuItem)
   * Updates the FIRST cart item matching the product ID
   */
  const updateCartItemQuantityByProductId = async (
    productId: number,
    newQuantity: number
  ) => {
    if (!state.cart) {
      showToast('Cart is not initialized', 'error')
      return
    }

    const currentItems = (state.cart.items || []) as CartItem[]
    const itemToUpdate = currentItems.find((item) => item.id === productId)

    if (itemToUpdate) {
      const cartItemKey = getCartItemKey(itemToUpdate)
      await updateCartItemQuantity(cartItemKey, newQuantity)
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
        removeFromCartByProductId,
        updateCartItemQuantityByProductId,
        clearCart,
        isItemOperationInProgress,
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
