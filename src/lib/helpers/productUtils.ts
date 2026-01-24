import { LocalizedProduct } from '@models/index'

export const isSimpleProduct = (product: LocalizedProduct): boolean => {
  return (
    product.portions.length === 1 &&
    product.additionalIngredients.length === 0 &&
    product.temperatures.length <= 1
  )
}

export const getSimpleProductConfig = (product: LocalizedProduct) => ({
  portion: product.portions[0],
  temperature: product.temperatures[0] || undefined,
  additionalIngredients: [],
  quantity: 1,
})
