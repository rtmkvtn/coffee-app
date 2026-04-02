import { AddCartItemInput, CartItem } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getMyCart = async (): Promise<IResponseWrapper<CartItem[]>> => {
  try {
    const response = await api.get('/api/cart')

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

export const addCartItem = async (
  dto: AddCartItemInput
): Promise<IResponseWrapper<CartItem>> => {
  try {
    const response = await api.post('/api/cart/items', dto)

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

export const updateCartItemQuantity = async (
  itemId: number,
  quantity: number
): Promise<IResponseWrapper<void>> => {
  try {
    await api.patch(`/api/cart/items/${itemId}`, { quantity })

    return {
      success: true,
      data: undefined,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}

export const removeCartItem = async (
  itemId: number
): Promise<IResponseWrapper<void>> => {
  try {
    await api.delete(`/api/cart/items/${itemId}`)

    return {
      success: true,
      data: undefined,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}
