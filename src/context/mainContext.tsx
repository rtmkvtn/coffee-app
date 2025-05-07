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
}

const StoreContext = createContext<StoreState | undefined>(undefined)

const MainContext = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [categories, setCategories] = useState<StoreState['categories']>([])
  const [products, setProducts] = useState<StoreState['products']>([])
  const [cart, setCart] = useState<ICart | null>(null)
  const [user, setUser] = useState<IUser | null>(null)

  const initScript = async () => {
    try {
      // Get initData from Telegram WebApp or use mock data
      const initData =
        window.Telegram?.WebApp?.initData ||
        (() => {
          const params = new URLSearchParams()
          params.set('query_id', MOCK_INIT_DATA.query_id)
          params.set('user', JSON.stringify(MOCK_INIT_DATA.user))
          params.set('auth_date', MOCK_INIT_DATA.auth_date.toString())
          params.set('hash', MOCK_INIT_DATA.hash)
          return params.toString()
        })()
      console.log(initData)
      const authResponse = await authenticateWithTelegram(initData)
      if (!authResponse.success) {
        throw new Error('Authentication failed')
      }
      console.log(authResponse)
      // Set user and cart from auth response
      setUser(authResponse.data.user)
      setCart(authResponse.data.cart)

      // Then fetch other data
      const [categoriesResponse, productsResponse] = await Promise.all([
        getCategories(),
        getAllProducts(),
      ])

      if (!categoriesResponse.success) {
        throw new Error('Failed to load categories')
      }
      setCategories(categoriesResponse.data.data)

      if (!productsResponse.success) {
        throw new Error('Failed to load products')
      }
      setProducts(productsResponse.data.data)

      setIsInitialized(true)
    } catch (error) {
      console.error('Initialization error:', error)
      // Here you might want to show an error message to the user
    }
  }

  useEffect(() => {
    initScript()
  }, [])

  return (
    <StoreContext.Provider
      value={{ isInitialized, cart, categories, products, user }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default MainContext

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
