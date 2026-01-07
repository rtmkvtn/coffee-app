/**
 * Localized models for component consumption
 * These types have simple string fields instead of LocalizedString objects
 * They are created by transforming the raw API models in contexts
 */
import { IProductTemperature } from './product.model'

/**
 * Localized portion with resolved weight string
 */
export type LocalizedPortion = {
  weight: string
  price: number
}

/**
 * Localized additional ingredient with resolved name and weight
 */
export type LocalizedAdditionalIngredient = {
  id: number
  name: string
  priceModifier: number
  weight: string
}

/**
 * Localized subcategory with resolved name and description
 */
export type LocalizedSubcategory = {
  id: number
  documentId: string
  name: string
  description?: string
  avatar: string
}

/**
 * Localized category with resolved name and description
 */
export type LocalizedCategory = {
  id: number
  documentId: string
  name: string
  description?: string
  subcategories: LocalizedSubcategory[]
}

/**
 * Localized product with resolved name, description, and ingredients
 */
export type LocalizedProduct = {
  order: number
  id: number
  documentId: string
  name: string
  description?: string
  on_hold: boolean
  ingredients?: string
  additionalIngredients: LocalizedAdditionalIngredient[]
  portions: LocalizedPortion[]
  avatar?: string
  category: { id: number; documentId: string }
  temperatures: IProductTemperature[]
  subcategory: { id: number; documentId: string }
}
