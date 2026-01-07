import { CartItem } from '@models/cart.model'
import { LocalizedAdditionalIngredient } from '@models/index'

/**
 * Creates a unique key for an ingredient
 * All ingredients are now localized (with string name/weight)
 */
export const getIngredientKey = (
  ingredient:
    | LocalizedAdditionalIngredient
    | CartItem['selectedAdditionalIngredients'][number]
): string => {
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
 * Compares two arrays of ingredients by their IDs
 */
export const areIngredientsEqual = (
  ingredients1:
    | LocalizedAdditionalIngredient[]
    | CartItem['selectedAdditionalIngredients'],
  ingredients2:
    | LocalizedAdditionalIngredient[]
    | CartItem['selectedAdditionalIngredients']
): boolean => {
  if (ingredients1.length !== ingredients2.length) return false

  // Sort by ID for comparison
  const ids1 = ingredients1.map((ing) => ing.id).sort()
  const ids2 = ingredients2.map((ing) => ing.id).sort()

  return ids1.every((id, index) => id === ids2[index])
}

/**
 * Finds an existing cart item that matches the product configuration exactly
 * Compares by product ID, temperature, and ingredient IDs
 */
export const findMatchingCartItem = (
  items: CartItem[],
  productId: number,
  temperature: string | undefined,
  additionalIngredients: LocalizedAdditionalIngredient[]
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
