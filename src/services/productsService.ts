import { IProduct } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getAllProducts = async (): Promise<
  IResponseWrapper<IProduct[]>
> => {
  try {
    const response = await api.get('/api/products')

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
