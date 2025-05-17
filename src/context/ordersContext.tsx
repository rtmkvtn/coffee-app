import { createContext, ReactNode, useContext, useState } from 'react'

import { showToast } from '@lib/toasts/toast'
import { IOrder } from '@models/index'
import {
  createOrder as createOrderService,
  getOrders,
} from '@services/ordersService'

import { useCart } from './cartContext'

type OrdersState = {
  orders: IOrder[]
}

type OrdersContextType = OrdersState & {
  refreshOrders: () => Promise<void>
  createOrder: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OrdersState>({
    orders: [],
  })

  const { cart, setCart } = useCart()

  const refreshOrders = async () => {
    try {
      const response = await getOrders()
      if (!response.success) {
        throw new Error('Failed to load orders')
      }
      setState((prev) => ({
        ...prev,
        orders: response.data.data,
      }))
    } catch (error) {
      showToast('Failed to refresh orders', 'error')
      console.error('Error refreshing orders:', error)
    }
  }

  const createOrder = async () => {
    if (!cart?.id) {
      showToast('Cart is not initialized', 'error')
      return
    }

    try {
      const response = await createOrderService(cart.id)
      if (!response.success) {
        throw new Error('Failed to create order')
      }

      // Clear cart locally since backend already clears it
      if (cart) {
        setCart({
          ...cart,
          items: [],
        })
      }

      // Add new order to the state
      setState((prev) => ({
        ...prev,
        orders: [response.data, ...prev.orders],
      }))

      showToast('Order created successfully', 'success')
    } catch (error) {
      console.error('Error creating order:', error)
      showToast('Failed to create order', 'error')
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        ...state,
        refreshOrders,
        createOrder,
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
