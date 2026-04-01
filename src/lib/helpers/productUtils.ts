import { IProduct } from '@models/index'

export const isSimpleProduct = (product: IProduct): boolean => {
  return (
    product.prices.length === 1 &&
    product.additionalIngredients.length === 0 &&
    product.temperatures.length <= 1
  )
}

export const getSimpleProductConfig = (product: IProduct) => ({
  portionId: product.prices[0].portionId,
  temperatureId: product.temperatures[0]?.temperatureId || undefined,
  ingredientIds: [] as number[],
  quantity: 1,
})
