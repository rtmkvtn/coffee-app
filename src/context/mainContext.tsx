import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { MOCK_INIT_DATA } from '@constants/temp'
import { useTelegram } from '@hooks/useTelegram'
import { showToast } from '@lib/toasts/toast'
import { CartItem } from '@models/cart.model'
import { ICart, ICategory, IOrder, IProduct, IUser } from '@models/index'
import { updateCart } from '@services/cartService'
import { getCategories } from '@services/categoriesService'
import { createOrder, getOrders } from '@services/ordersService'
import { getAllProducts } from '@services/productsService'
import { authenticateWithTelegram } from '@services/userService'

// Types
type StoreState = {
  isInitialized: boolean
  cart: ICart | null
  categories: ICategory[]
  products: IProduct[]
  user: IUser | null
  orders: IOrder[]
  error: string | null
}

type StoreContextType = StoreState & {
  setCart: (cart: ICart | null) => void
  setUser: (user: IUser | null) => void
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
  refreshOrders: () => Promise<void>
  addToCart: (product: IProduct) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateCartItemQuantity: (
    productId: number,
    newQuantity: number
  ) => Promise<void>
  clearCart: () => Promise<void>
  createOrder: () => Promise<void>
}

// Custom hooks
const useOrderOperations = (
  state: StoreState,
  setState: React.Dispatch<React.SetStateAction<StoreState>>,
  setCart: (cart: ICart | null) => void
) => {
  const refreshOrders = async () => {
    try {
      // Get the latest state to ensure we have the user ID
      const currentState = await new Promise<StoreState>((resolve) => {
        setState((prev) => {
          resolve(prev)
          return prev
        })
      })

      if (!currentState.user?.id) {
        return
      }

      const response = await getOrders(currentState.user.id)
      if (!response.success) {
        throw new Error('Failed to load orders')
      }
      setState((prev) => ({
        ...prev,
        orders: response.data.data,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: 'Failed to refresh orders' }))
      showToast('Failed to refresh orders', 'error')
      console.error('Error refreshing orders:', error)
    }
  }

  const createNewOrder = async () => {
    if (!state.cart?.id) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const response = await createOrder(state.cart.id)
      if (!response.success) {
        throw new Error('Failed to create order')
      }

      // Clear cart locally since backend already clears it
      if (state.cart) {
        setCart({
          ...state.cart,
          items: [],
        })
      }

      // Add new order to the state
      setState((prev) => ({
        ...prev,
        orders: [response.data, ...prev.orders],
      }))

      showToast('Order created successfully', 'success')
    } catch (error) {
      console.error('Error creating order:', error)
      showToast('Failed to create order', 'error')
    }
  }

  return {
    refreshOrders,
    createOrder: createNewOrder,
  }
}

const useCartOperations = (
  state: StoreState,
  setCart: (cart: ICart | null) => void
) => {
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

  return {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  }
}

const useDataRefresh = (
  setState: React.Dispatch<React.SetStateAction<StoreState>>
) => {
  const refreshProducts = async () => {
    try {
      const response = await getAllProducts()
      if (!response.success) {
        throw new Error('Failed to load products')
      }
      setState((prev) => ({
        ...prev,
        products: response.data.data,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: 'Failed to refresh products' }))
      showToast('Failed to refresh products', 'error')
      console.error('Error refreshing products:', error)
    }
  }

  const refreshCategories = async () => {
    try {
      const response = await getCategories()
      if (!response.success) {
        throw new Error('Failed to load categories')
      }
      setState((prev) => ({
        ...prev,
        categories: response.data.data,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: 'Failed to refresh categories' }))
      showToast('Failed to refresh categories', 'error')
      console.error('Error refreshing categories:', error)
    }
  }

  return {
    refreshProducts,
    refreshCategories,
  }
}

const getMockInitData = () => {
  if (import.meta.env.MODE !== 'development') {
    throw new Error('Mock data is only available in development environment')
  }

  const params = new URLSearchParams()
  params.set('query_id', MOCK_INIT_DATA.query_id)
  params.set('user', JSON.stringify(MOCK_INIT_DATA.user))
  params.set('auth_date', MOCK_INIT_DATA.auth_date.toString())
  params.set('hash', MOCK_INIT_DATA.hash)
  return params.toString()
}

const useStoreInitialization = () => {
  const [state, setState] = useState<StoreState>({
    isInitialized: false,
    cart: null,
    categories: [],
    products: [],
    user: null,
    orders: [],
    error: null,
  })
  const initRef = useRef(false)
  const { initData, isReady } = useTelegram()
  console.log('INIT DATA', initData)

  const setCart = (cart: ICart | null) =>
    setState((prev) => ({ ...prev, cart }))
  const setUser = (user: IUser | null) =>
    setState((prev) => ({ ...prev, user }))

  const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
    useCartOperations(state, setCart)
  const { refreshProducts, refreshCategories } = useDataRefresh(setState)
  const { refreshOrders, createOrder } = useOrderOperations(
    state,
    setState,
    setCart
  )

  const initialize = async () => {
    console.log('INIT...')
    try {
      // Wait for Telegram to be ready
      if (!isReady) {
        console.log('Waiting for Telegram initialization...')
        return
      }

      if (!initData && import.meta.env.MODE !== 'development') {
        throw new Error('No initialization data available')
      }

      const data =
        initData ||
        (import.meta.env.MODE === 'development' ? getMockInitData() : null)

      if (!data) {
        console.log('HERE')
        throw new Error('No initialization data available')
      }

      if (initRef.current) return
      initRef.current = true

      const authResponse = await authenticateWithTelegram(data)
      if (!authResponse.success) {
        throw new Error('Authentication failed')
      }

      localStorage.setItem('token', authResponse.data.jwt)

      setState((prev) => ({
        ...prev,
        user: authResponse.data.user,
        cart: authResponse.data.cart,
        error: null,
      }))

      // First load categories and products
      await Promise.all([refreshCategories(), refreshProducts()])

      // Then load orders after we have user data
      await refreshOrders()

      setState((prev) => ({ ...prev, isInitialized: true }))
    } catch (error) {
      console.error('Initialization error:', error)
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }

  useEffect(() => {
    initialize()
  }, [isReady])
  console.log('CURRENT STATE', state)
  return {
    ...state,
    setCart,
    setUser,
    refreshProducts,
    refreshCategories,
    refreshOrders,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    createOrder,
  }
}

// Context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

const MainContext = ({ children }: { children: ReactNode }) => {
  const store = useStoreInitialization()
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default MainContext

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
