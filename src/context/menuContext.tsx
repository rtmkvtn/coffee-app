import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useTranslation } from 'react-i18next'

import { Locale, normalizeLocale } from '@lib/helpers/locale'
import { ICategory, IProduct } from '@models/index'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'

type MenuState = {
  categories: ICategory[]
  products: IProduct[]
  currentLocale: Locale
  error: string | null
}

type MenuContextType = {
  categories: ICategory[]
  products: IProduct[]
  currentLocale: Locale
  error: string | null
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
  refreshAll: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()
  const currentLocale = normalizeLocale(i18n.language)

  const [state, setState] = useState<MenuState>({
    categories: [],
    products: [],
    currentLocale,
    error: null,
  })

  const refreshProducts = useCallback(async () => {
    try {
      const response = await getAllProducts()
      if (!response.success) {
        throw new Error('Failed to load products')
      }
      setState((prev) => ({
        ...prev,
        products: response.data,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: 'Failed to refresh products' }))
      console.error('Error refreshing products:', error)
    }
  }, [])

  const refreshCategories = useCallback(async () => {
    try {
      const response = await getCategories()
      if (!response.success) {
        throw new Error('Failed to load categories')
      }
      setState((prev) => ({
        ...prev,
        categories: response.data,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({ ...prev, error: 'Failed to refresh categories' }))
      console.error('Error refreshing categories:', error)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshCategories(), refreshProducts()])
  }, [refreshCategories, refreshProducts])

  // Refetch data when language changes (server resolves locale)
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLocale = normalizeLocale(lng)
      setState((prev) => {
        if (prev.currentLocale !== newLocale) {
          return { ...prev, currentLocale: newLocale }
        }
        return prev
      })
      refreshAll()
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n, refreshAll])

  const contextValue = useMemo(
    () => ({
      categories: state.categories,
      products: state.products,
      currentLocale: state.currentLocale,
      error: state.error,
      refreshProducts,
      refreshCategories,
      refreshAll,
    }),
    [
      state.categories,
      state.products,
      state.currentLocale,
      state.error,
      refreshProducts,
      refreshCategories,
      refreshAll,
    ]
  )

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  )
}

export const useMenu = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within StoreProvider')
  return ctx
}

export default MenuContext
