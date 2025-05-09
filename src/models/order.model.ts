import { CartItem } from '.'

export type OrderStatus =
  | 'waitingForPayment'
  | 'paymentProcessing'
  | 'paid'
  | 'completed'
  | 'canceled'

export type IOrder = {
  id: string
  items: CartItem[]
  totalPrice: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}
