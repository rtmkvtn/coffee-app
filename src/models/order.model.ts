import { CartItem } from '.'

export type OrderStatus =
  | 'waitingForPayment'
  | 'paymentProcessing'
  | 'paid'
  | 'completed'
  | 'canceled'

export type IOrder = {
  id: string
  documentId: string
  items: CartItem[]
  amount: number
  state: OrderStatus
  createdAt: Date
  updatedAt: Date
}
