import { CartItem } from '.'

export type IPaymentMethod = 'cash'

export type OrderStatus =
  | 'waitingForPayment'
  | 'paymentProcessing'
  | 'paid'
  | 'preparing'
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
  paymentMethod?: IPaymentMethod
}
