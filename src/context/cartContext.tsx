import { createContext, ReactNode, useContext, useState } from 'react';



import { showToast } from '@lib/toasts/toast';
import { CartItem } from '@models/cart.model';
import { addCartItem, getMyCart, removeCartItem, updateCartItemQuantity as updateCartItemQuantityApi } from '@services/cartService';





type CartState = {
  items: CartItem[]
  operationsInProgress: Set<number>
}

type CartContextType = CartState & {
  initializeCart: () => Promise<void>
  setItems: (items: CartItem[]) => void
  addToCart: (
    productId: number,
    config: {
      portionId: number
      temperatureId?: number
      ingredientIds: number[]
      quantity: number
    }
  ) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  updateCartItemQuantity: (
    itemId: number,
    newQuantity: number
  ) => Promise<void>
  removeLastByProductId: (productId: number) => Promise<void>
  clearCart: () => void
  isItemOperationInProgress: (itemId: number) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    operationsInProgress: new Set(),
  })

  const setItems = (items: CartItem[]) =>
    setState((prev) => ({ ...prev, items }))

  const addOperationInProgress = (id: number) => {
    setState((prev) => ({
      ...prev,
      operationsInProgress: new Set(prev.operationsInProgress).add(id),
    }))
  }

  const removeOperationInProgress = (id: number) => {
    setState((prev) => {
      const newSet = new Set(prev.operationsInProgress)
      newSet.delete(id)
      return { ...prev, operationsInProgress: newSet }
    })
  }

  const isItemOperationInProgress = (itemId: number): boolean => {
    return state.operationsInProgress.has(itemId)
  }

  const initializeCart = async () => {
    try {
      const response = await getMyCart()

      if (!response.success) {
        throw new Error('Failed to initialize cart')
      }

      setItems(response.data)
    } catch (error) {
      showToast('Failed to initialize cart', 'error')
      console.error('Error initializing cart:', error)
    }
  }

  const addToCart = async (
    productId: number,
    config: {
      portionId: number
      temperatureId?: number
      ingredientIds: number[]
      quantity: number
    }
  ) => {
    try {
      const response = await addCartItem({
        productId,
        portionId: config.portionId,
        temperatureId: config.temperatureId,
        ingredientIds:
          config.ingredientIds.length > 0 ? config.ingredientIds : undefined,
        quantity: config.quantity,
      })

      if (!response.success) {
        throw new Error('Failed to add item to cart')
      }

      setState((prev) => {
        const existingIndex = prev.items.findIndex(
          (item) => item.id === response.data.id
        )
        if (existingIndex >= 0) {
          const updatedItems = [...prev.items]
          updatedItems[existingIndex] = response.data
          return { ...prev, items: updatedItems }
        }
        return { ...prev, items: [...prev.items, response.data] }
      })
    } catch (error) {
      showToast('Failed to add item to cart', 'error')
      console.error('Error adding to cart:', error)
    }
  }

  const removeFromCart = async (itemId: number) => {
    if (state.operationsInProgress.has(itemId)) {
      return
    }

    addOperationInProgress(itemId)

    try {
      const response = await removeCartItem(itemId)
      if (!response.success) {
        throw new Error('Failed to remove item from cart')
      }

      setState((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }))
    } catch (error) {
      showToast('Failed to remove item from cart', 'error')
      console.error('Error removing from cart:', error)
    } finally {
      removeOperationInProgress(itemId)
    }
  }

  const updateCartItemQuantity = async (
    itemId: number,
    newQuantity: number
  ) => {
    if (state.operationsInProgress.has(itemId)) {
      return
    }

    if (newQuantity < 1 || newQuantity > 99) {
      showToast('Quantity must be between 1 and 99', 'warning')
      return
    }

    addOperationInProgress(itemId)

    try {
      const response = await updateCartItemQuantityApi(itemId, newQuantity)
      if (!response.success) {
        throw new Error('Failed to update item quantity')
      }

      setState((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      }))
    } catch (error) {
      showToast('Failed to update item quantity', 'error')
      console.error('Error updating item quantity:', error)
    } finally {
      removeOperationInProgress(itemId)
    }
  }

  const removeLastByProductId = async (productId: number) => {
    const items = state.items.filter(item => item.productId === productId)
    const lastItem = items[items.length - 1]
    if (!lastItem) return

    if (lastItem.quantity > 1) {
      await updateCartItemQuantity(lastItem.id, lastItem.quantity - 1)
    } else {
      await removeFromCart(lastItem.id)
    }
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        initializeCart,
        setItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        removeLastByProductId,
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
