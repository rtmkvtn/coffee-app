import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { ICategory } from '../models/category.model'
import { getMenu } from '../services'

type StoreState = {
  isInitialized: boolean
  cart: any
  menu: ICategory[]
}

const StoreContext = createContext<StoreState | undefined>(undefined)

const MainContext = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [menu, setMenu] = useState<StoreState['menu']>([])
  const [cart, setCart] = useState()

  const initScript = async () => {
    const menuResponse = await getMenu()
    if (!menuResponse.success) {
      // error show
    } else {
      setMenu(menuResponse.data.data)
    }
    setIsInitialized(true)
  }

  useEffect(() => {
    initScript()
  }, [])

  return (
    <StoreContext.Provider value={{ isInitialized, cart, menu }}>
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
