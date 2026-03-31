import { CartItem, IOrder, IPaymentMethod } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export type UnavailableItem = {
  name: string
  reason: string
}

export type RepeatOrderResponse = {
  available: CartItem[]
  unavailable: UnavailableItem[]
}

export const createOrder = async (
  paymentMethod?: IPaymentMethod
): Promise<IResponseWrapper<IOrder>> => {
  try {
    const response = await api.post('/api/orders', {
      ...(paymentMethod && { paymentMethod }),
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

export const repeatOrder = async (
  orderId: string
): Promise<IResponseWrapper<RepeatOrderResponse>> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/repeat`)

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
      data: response.data.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}
