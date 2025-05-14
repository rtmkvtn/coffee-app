import { IOrder, OrderStatus } from '@models/index'

import api from './api'
import { IResponseWrapper, ISingleTypeResponseWrapper } from './services.types'

export const createOrder = async (
  cartId: number
): Promise<ISingleTypeResponseWrapper<IOrder>> => {
  try {
    const response = await api.post('/api/orders', {
      cartId,
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const getOrders = async (): Promise<IResponseWrapper<IOrder[]>> => {
  try {
    const response = await api.get('/api/orders/my')

    return {
      success: true,
      data: response.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const getOrderById = async (
  orderId: string
): Promise<ISingleTypeResponseWrapper<IOrder>> => {
  try {
    const response = await api.get(`/api/orders/${orderId}`)

    return {
      success: true,
      data: response.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  paymentMethod?: 'cash'
): Promise<ISingleTypeResponseWrapper<IOrder>> => {
  try {
    const response = await api.put(`/api/orders/${orderId}`, {
      data: {
        state: status,
        ...(paymentMethod && { paymentMethod }),
      },
    })

    return {
      success: true,
      data: response.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const cancelOrder = async (
  orderId: string
): Promise<ISingleTypeResponseWrapper<IOrder>> => {
  try {
    const response = await api.put(`/api/orders/${orderId}`, {
      data: {
        state: 'canceled' as OrderStatus,
      },
    })

    return {
      success: true,
      data: response.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}
