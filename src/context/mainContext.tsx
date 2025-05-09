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
import { ICart, ICategory, IProduct, IUser } from '@models/index'
import { updateCart } from '@services/cartService'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'
import { authenticateWithTelegram } from '@services/userService'

// Types
type StoreState = {
  isInitialized: boolean
  cart: ICart | null
  categories: ICategory[]
  products: IProduct[]
  user: IUser | null
  error: string | null
}

type StoreContextType = StoreState & {
  setCart: (cart: ICart | null) => void
  setUser: (user: IUser | null) => void
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
  addToCart: (product: IProduct) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateCartItemQuantity: (
    productId: number,
    newQuantity: number
  ) => Promise<void>
}

// Custom hooks
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

  return {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
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
  if (process.env.NODE_ENV !== 'development') {
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
    error: null,
  })
  const initRef = useRef(false)
  const { initData } = useTelegram()

  const setCart = (cart: ICart | null) =>
    setState((prev) => ({ ...prev, cart }))
  const setUser = (user: IUser | null) =>
    setState((prev) => ({ ...prev, user }))

  const { addToCart, removeFromCart, updateCartItemQuantity } =
    useCartOperations(state, setCart)
  const { refreshProducts, refreshCategories } = useDataRefresh(setState)

  const initialize = async () => {
    if (initRef.current) return
    initRef.current = true

    try {
      const data =
        initData ||
        (process.env.NODE_ENV === 'development' ? getMockInitData() : null)

      if (!data) {
        throw new Error('No initialization data available')
      }

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

      await Promise.all([refreshCategories(), refreshProducts()])
      setState((prev) => ({ ...prev, isInitialized: true }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to initialize application',
        isInitialized: true,
      }))
      showToast('Failed to initialize application', 'error')
      console.error('Initialization error:', error)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return {
    ...state,
    setCart,
    setUser,
    refreshProducts,
    refreshCategories,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
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
