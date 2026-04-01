import { CartItem, DisplayCartItem } from '@models/cart.model'
import { IProduct, IProductTemperature } from '@models/product.model'

/**
 * Converts a server-hydrated CartItem into a DisplayCartItem for rendering.
 */
export const toDisplayCartItem = (
  item: CartItem,
  products: IProduct[]
): DisplayCartItem => {
  const product = products.find((p) => p.id === item.productId)

  return {
    id: item.id,
    productId: item.productId,
    portionId: item.portionId,
    temperatureId: item.temperatureId,
    quantity: item.quantity,
    name: item.product.name,
    image: item.product.image,
    portionName: item.portion.name,
    price:
      item.unitPrice +
      item.ingredients.reduce((sum, ing) => sum + ing.price, 0),
    temperature: item.temperature?.type as IProductTemperature | undefined,
    ingredients: item.ingredients,
    subcategoryId: product?.subcategoryId ?? 0,
  }
}

/**
 * Converts all cart items to display items.
 */
export const toDisplayCartItems = (
  items: CartItem[],
  products: IProduct[]
): DisplayCartItem[] => {
  return items.map((item) => toDisplayCartItem(item, products))
}
