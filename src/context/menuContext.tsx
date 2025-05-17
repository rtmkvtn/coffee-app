import { createContext, ReactNode, useContext, useState } from 'react'

import { ICategory, IProduct } from '@models/index'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'

type MenuState = {
  categories: ICategory[]
  products: IProduct[]
  error: string | null
}

type MenuContextType = MenuState & {
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MenuState>({
    categories: [],
    products: [],
    error: null,
  })
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

  return (
    <MenuContext.Provider
      value={{
        ...state,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within StoreProvider')
  return ctx
}

export default MenuContext
