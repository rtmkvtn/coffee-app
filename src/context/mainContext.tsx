import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { MOCK_INIT_DATA } from '@constants/temp'
import { ICart, ICategory, IProduct, IUser } from '@models/index'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'
import { authenticateWithTelegram } from '@services/userService'

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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

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

  const setCart = (cart: ICart | null) =>
    setState((prev) => ({ ...prev, cart }))
  const setUser = (user: IUser | null) =>
    setState((prev) => ({ ...prev, user }))

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
      console.error('Error refreshing categories:', error)
    }
  }

  const initialize = async () => {
    try {
      const initData =
        window.Telegram?.WebApp?.initData ||
        (process.env.NODE_ENV === 'development' ? getMockInitData() : null)

      if (!initData) {
        throw new Error('No initialization data available')
      }

      const authResponse = await authenticateWithTelegram(initData)
      if (!authResponse.success) {
        throw new Error('Authentication failed')
      }

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
  }
}

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
