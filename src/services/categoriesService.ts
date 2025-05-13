import { ICategory } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getCategories = async (): Promise<
  IResponseWrapper<ICategory[]>
> => {
  try {
    const response = await api.get('/api/categories', {
      params: {
        locale: 'ru',
        sort: ['order:asc'],
        fields: ['id', 'name'],
        populate: {
          subcategories: {
            sort: ['order:asc'],
            fields: ['id', 'name'],
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
