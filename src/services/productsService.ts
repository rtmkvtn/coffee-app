import { IProduct } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getAllProducts = async (): Promise<
  IResponseWrapper<IProduct[]>
> => {
  try {
    const response = await api.get('/api/products', {
      params: {
        sort: ['order:asc'],
        populate: {
          category: {
            fields: ['id'],
          },
          subcategory: {
            fields: ['id'],
          },
          avatar: {
            fields: ['url', 'name'],
          },
        },
      },
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
