import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { ICategory, IProduct } from '@models/index'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'

type StoreState = {
  isInitialized: boolean
  cart: any
  categories: ICategory[]
  products: IProduct[]
}

const StoreContext = createContext<StoreState | undefined>(undefined)

const MainContext = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [categories, setCategories] = useState<StoreState['categories']>([])
  const [products, setProducts] = useState<StoreState['products']>([])
  const [cart, setCart] = useState()

  const initScript = async () => {
    const categoriesResponse = await getCategories()
    if (!categoriesResponse.success) {
      // error show
    } else {
      setCategories(categoriesResponse.data.data)
    }

    const productsResponse = await getAllProducts()
    if (!productsResponse.success) {
      // error show
    } else {
      setProducts(productsResponse.data.data)
    }

    setIsInitialized(true)
  }

  useEffect(() => {
    initScript()
  }, [])

  return (
    <StoreContext.Provider
      value={{ isInitialized, cart, categories, products }}
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
