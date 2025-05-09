import { CartItem } from '.'

export type IOrder = {
  id: string
  items: CartItem[]
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}
