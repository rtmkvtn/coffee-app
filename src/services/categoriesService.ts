import { ICategory } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getCategories = async (): Promise<
  IResponseWrapper<ICategory[]>
> => {
  try {
    const response = await api.get('/api/categories')

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
