import { LocalizedAdditionalIngredient, LocalizedProduct } from './index'

/**
 * Cart items are localized products with additional cart-specific fields
 * Localized values (strings) are stored to ensure correct display even after language changes
 */
export type CartItem = Omit<LocalizedProduct, 'portions'> & {
  // Cart-specific fields
  price: number
  weight: string
  quantity: number
  selectedTemperature?: string
  selectedAdditionalIngredients: LocalizedAdditionalIngredient[]
}

export interface ICart {
  id: number
  documentId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}
