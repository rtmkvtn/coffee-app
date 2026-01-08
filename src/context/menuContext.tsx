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

import { getLocalizedField, Locale, normalizeLocale } from '@lib/helpers/locale'
import {
  ICategory,
  IProduct,
  LocalizedCategory,
  LocalizedProduct,
} from '@models/index'
import { getCategories } from '@services/categoriesService'
import { getAllProducts } from '@services/productsService'

type MenuState = {
  rawCategories: ICategory[]
  rawProducts: IProduct[]
  currentLocale: Locale
  error: string | null
}

type MenuContextType = {
  categories: LocalizedCategory[]
  products: LocalizedProduct[]
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
    rawCategories: [],
    rawProducts: [],
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
        rawProducts: response.data.data,
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
        rawCategories: response.data.data,
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

  // Transform products to localized versions using useMemo
  const localizedProducts = useMemo<LocalizedProduct[]>(
    () =>
      state.rawProducts.map((product) => {
        const localizedProduct = {
          ...product,
          name: getLocalizedField(product.name_by_locale, state.currentLocale),
          description: getLocalizedField(
            product.description_by_locale,
            state.currentLocale
          ),
          ingredients: getLocalizedField(
            product.ingredients_by_locale,
            state.currentLocale
          ),
          portions: product.portions.map((portion) => ({
            weight: getLocalizedField(portion.weight, state.currentLocale),
            price: portion.price,
          })),
          additionalIngredients: product.additionalIngredients.map((ing) => ({
            id: ing.id,
            name: getLocalizedField(ing.name, state.currentLocale),
            priceModifier: ing.priceModifier,
            weight: getLocalizedField(ing.weight, state.currentLocale),
          })),
        }
        return localizedProduct
      }),
    [state.rawProducts, state.currentLocale]
  )

  // Transform categories to localized versions using useMemo
  const localizedCategories = useMemo<LocalizedCategory[]>(
    () =>
      state.rawCategories.map((category) => ({
        ...category,
        name: getLocalizedField(category.name_by_locale, state.currentLocale),
        description: getLocalizedField(
          category.description_by_locale,
          state.currentLocale
        ),
        subcategories: category.subcategories.map((sub) => ({
          ...sub,
          name: getLocalizedField(sub.name_by_locale, state.currentLocale),
          description: getLocalizedField(
            sub.description_by_locale,
            state.currentLocale
          ),
        })),
      })),
    [state.rawCategories, state.currentLocale]
  )

  // Listen for language changes and update locale state
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLocale = normalizeLocale(lng)
      setState((prev) => {
        if (prev.currentLocale !== newLocale) {
          return { ...prev, currentLocale: newLocale }
        }
        return prev
      })

      // Optionally refetch data when language changes
      // Since backend now returns all locales, we don't need to refetch
      // Components will automatically re-render with new locale
    }

    // Sync immediately in case i18n changed before mount
    handleLanguageChange(i18n.language)

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      categories: localizedCategories,
      products: localizedProducts,
      currentLocale: state.currentLocale,
      error: state.error,
      refreshProducts,
      refreshCategories,
      refreshAll,
    }),
    [
      localizedCategories,
      localizedProducts,
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
