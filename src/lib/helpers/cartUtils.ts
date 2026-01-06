import { IAdditionalIngredient } from '@models/additionalIngredient.model'
import { CartItem } from '@models/cart.model'

/**
 * Creates a unique key for an ingredient based on all its properties
 */
export const getIngredientKey = (ingredient: IAdditionalIngredient): string => {
  return `${ingredient.name}|${ingredient.weight}|${ingredient.priceModifier}`
}

/**
 * Creates a unique key for a cart item based on product ID, temperature, and ingredients
 * This ensures items with the same product but different configurations are treated separately
 */
export const getCartItemKey = (item: CartItem): string => {
  const ingredientsHash = item.selectedAdditionalIngredients
    .map(getIngredientKey)
    .sort()
    .join('||')

  return `${item.id}-${item.selectedTemperature || 'none'}-${ingredientsHash}`
}

/**
 * Compares two arrays of additional ingredients to check if they're identical
 */
export const areIngredientsEqual = (
  ingredients1: IAdditionalIngredient[],
  ingredients2: IAdditionalIngredient[]
): boolean => {
  if (ingredients1.length !== ingredients2.length) return false

  const keys1 = ingredients1.map(getIngredientKey).sort()
  const keys2 = ingredients2.map(getIngredientKey).sort()

  return keys1.every((key, index) => key === keys2[index])
}

/**
 * Finds an existing cart item that matches the product configuration exactly
 */
export const findMatchingCartItem = (
  items: CartItem[],
  productId: number,
  temperature: string | undefined,
  additionalIngredients: IAdditionalIngredient[]
): number => {
  return items.findIndex((item) => {
    if (item.id !== productId) return false
    if (item.selectedTemperature !== temperature) return false
    return areIngredientsEqual(
      item.selectedAdditionalIngredients,
      additionalIngredients
    )
  })
}
