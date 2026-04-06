import { CartItem, IOrder, IPaymentMethod } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export type UnavailableItem = {
  name: string
  reason: string
}

export type RepeatAvailableItem = {
  productId: number
  portionId: number
  temperatureId: number | null
  ingredientIds: number[]
  quantity: number
  productName: string
}

export type RepeatOrderResponse = {
  available: RepeatAvailableItem[]
  unavailable: UnavailableItem[]
}

export type RepeatOrderConfirmResponse =
  | { success: true; cart: CartItem[] }
  | {
      success: false
      availabilityChanged: true
      available: RepeatAvailableItem[]
      unavailable: UnavailableItem[]
    }

export const createOrder = async (
  comment?: string
): Promise<IResponseWrapper<IOrder>> => {
  try {
    const response = await api.post('/api/orders', {
      comment: comment || undefined,
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

export const confirmOrder = async (
  orderId: string,
  paymentMethod: IPaymentMethod
): Promise<IResponseWrapper<IOrder>> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/confirm`, {
      paymentMethod,
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

export const cancelOrder = async (
  orderId: string
): Promise<IResponseWrapper<{ id: string; state: string }>> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/cancel`)

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

const mapUnavailable = (
  items: Array<{ productName: string; reason: string }>
): UnavailableItem[] =>
  items.map((i) => ({ name: i.productName, reason: i.reason }))

export const repeatOrder = async (
  orderId: string
): Promise<IResponseWrapper<RepeatOrderResponse>> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/repeat`)

    return {
      success: true,
      data: {
        available: response.data.available,
        unavailable: mapUnavailable(response.data.unavailable),
      },
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const confirmRepeatOrder = async (
  orderId: string
): Promise<RepeatOrderConfirmResponse> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/repeat/confirm`)

    return {
      success: true,
      cart: response.data.data,
    }
  } catch (e: any) {
    if (e.response?.status === 409) {
      const body = e.response.data
      return {
        success: false,
        availabilityChanged: true,
        available: body.available,
        unavailable: mapUnavailable(body.unavailable),
      }
    }
    throw e
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
