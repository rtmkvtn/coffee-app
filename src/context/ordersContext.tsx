import { createContext, ReactNode, useContext, useState } from 'react'

import { showToast } from '@lib/toasts/toast'
import { IOrder, IPaymentMethod } from '@models/index'
import {
  cancelOrder as cancelOrderService,
  confirmOrder as confirmOrderService,
  createOrder as createOrderService,
  getOrders,
} from '@services/ordersService'

import { useCart } from './cartContext'

type OrdersState = {
  orders: IOrder[]
}

type OrdersContextType = OrdersState & {
  refreshOrders: () => Promise<void>
  createOrder: () => Promise<string | null>
  confirmOrder: (orderId: string, paymentMethod: IPaymentMethod) => Promise<boolean>
  cancelOrder: (orderId: string) => Promise<boolean>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OrdersState>({
    orders: [],
  })

  const { clearCart, initializeCart } = useCart()

  const refreshOrders = async () => {
    try {
      const response = await getOrders()
      if (!response.success) {
        throw new Error('Failed to load orders')
      }
      setState((prev) => ({
        ...prev,
        orders: response.data,
      }))
    } catch (error) {
      showToast('Failed to refresh orders', 'error')
      console.error('Error refreshing orders:', error)
    }
  }

  const createOrder = async (): Promise<string | null> => {
    try {
      const response = await createOrderService()
      if (!response.success) {
        throw new Error('Failed to create order')
      }

      clearCart()

      setState((prev) => ({
        ...prev,
        orders: [response.data, ...prev.orders],
      }))

      return response.data.id
    } catch (error) {
      console.error('Error creating order:', error)
      showToast('Failed to create order', 'error')
      return null
    }
  }

  const confirmOrder = async (
    orderId: string,
    paymentMethod: IPaymentMethod
  ): Promise<boolean> => {
    try {
      const response = await confirmOrderService(orderId, paymentMethod)
      if (!response.success) {
        throw new Error('Failed to confirm order')
      }

      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? response.data : o
        ),
      }))

      return true
    } catch (error) {
      console.error('Error confirming order:', error)
      showToast('Failed to confirm order', 'error')
      return false
    }
  }

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      const response = await cancelOrderService(orderId)
      if (!response.success) {
        throw new Error('Failed to cancel order')
      }

      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? { ...o, state: 'CANCELED' as const } : o
        ),
      }))

      initializeCart()

      return true
    } catch (error) {
      console.error('Error canceling order:', error)
      showToast('Failed to cancel order', 'error')
      return false
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        ...state,
        refreshOrders,
        createOrder,
        confirmOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
