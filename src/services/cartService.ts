import { ICart } from '@models/index'

import api from './api'
import { ISingleTypeResponseWrapper } from './services.types'

export const getMyCart = async (): Promise<
  ISingleTypeResponseWrapper<ICart>
> => {
  try {
    const response = await api.get(`/api/cart/`)

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

export const updateCart = async (
  cartId: string,
  items: any[]
): Promise<ISingleTypeResponseWrapper<ICart>> => {
  try {
    const response = await api.put(`/api/carts/${cartId}`, {
      data: {
        items,
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
