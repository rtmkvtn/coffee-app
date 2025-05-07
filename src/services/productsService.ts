import { IProduct } from '../models/product.model'
import api from './api'
import { IResponseWrapper } from './services.types'

export const getAllProducts = async (): Promise<
  IResponseWrapper<IProduct[]>
> => {
  try {
    const response = await api.get(
      '/api/products?populate[category][fields][0]=id&populate[subcategory][fields][0]=id&populate[avatar][fields][0]=url&populate[avatar][fields][1]=name'
    )
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
