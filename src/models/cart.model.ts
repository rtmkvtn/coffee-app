import { IProductTemperature } from './product.model'

/**
 * Cart item returned by the NestJS backend.
 * Items come pre-hydrated with product/portion/temperature/ingredient data.
 */
export type CartItem = {
  id: number
  productId: number
  portionId: number
  temperatureId: number | null
  quantity: number
  unitPrice: number
  ingredientsPrice: number
  product: { id: number; name: string; image: string | null }
  portion: { id: number; name: string }
  temperature: { id: number; type: string } | null
  ingredients: { ingredientId: number; name: string; price: number }[]
}

/**
 * Input DTO for adding a cart item.
 */
export type AddCartItemInput = {
  productId: number
  portionId: number
  temperatureId?: number
  ingredientIds?: number[]
  quantity: number
}

/**
 * Hydrated cart item for display, derived from CartItem.
 */
export type DisplayCartItem = {
  id: number
  productId: number
  portionId: number
  temperatureId: number | null
  quantity: number
  name: string
  image: string | null
  portionName: string
  price: number
  temperature?: IProductTemperature
  ingredients: { ingredientId: number; name: string; price: number }[]
  subcategoryId: number
}
