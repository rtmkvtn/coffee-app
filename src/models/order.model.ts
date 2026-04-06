export type IPaymentMethod = 'CASH' | 'CARD'

export type OrderStatus =
  | 'DRAFT'
  | 'WAITING_FOR_PAYMENT'
  | 'PAYMENT_PROCESSING'
  | 'PAID'
  | 'PREPARING'
  | 'COMPLETED'
  | 'CANCELED'

export type IOrderItem = {
  id: number
  quantity: number
  unitPrice: number
  ingredientsPrice: number
  productSnapshot: {
    name: string
    fullName: string
    description: string | null
    image: string | null
  }
  portionSnapshot: {
    name: string
    priceModifier: number
  }
  temperatureSnapshot: { type: 'hot' | 'cold' } | null
  ingredientsSnapshot: {
    ingredientId: number
    name: string
    price: number
  }[]
}

export type IOrder = {
  id: string
  orderNumber: number
  items: IOrderItem[]
  amount: number
  state: OrderStatus
  createdAt: string
  paymentMethod: IPaymentMethod | null
  comment: string | null
}
