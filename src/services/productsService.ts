import { IProduct, IProductBackend } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getAllProducts = async (): Promise<
  IResponseWrapper<IProduct[]>
> => {
  try {
    const response = await api.get('/api/products/all')

    // Determine the correct products array
    let productsArray: IProductBackend[] = []
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      productsArray = response.data.data
    } else if (response.data && Array.isArray(response.data)) {
      productsArray = response.data
    } else {
      throw new Error('Invalid API response structure')
    }

    const transformedData: IProduct[] = productsArray.map((x) => {
      // Ensure all required fields exist with defaults
      return {
        id: x.id || 0,
        documentId: x.documentId || '',
        name: x.name || 'Unknown Product',

        description: x.description || '',
        on_hold: Boolean(x.on_hold),
        ingredients: x.ingredients || '',
        order: x.order || 0,
        additionalIngredients: Array.isArray(x.additionalIngredients)
          ? x.additionalIngredients
          : [],
        portions: Array.isArray(x.prices)
          ? x.prices.map((price) => ({
              weight: price?.weight || '',
              price: price?.price || 0,
            }))
          : [],
        avatar: x.avatar || undefined,
        category:
          x.category && typeof x.category === 'object' && x.category.id
            ? { id: x.category.id, documentId: x.category.documentId || '' }
            : { id: 0, documentId: 'other' },
        subcategory:
          x.subcategory && typeof x.subcategory === 'object' && x.subcategory.id
            ? {
                id: x.subcategory.id,
                documentId: x.subcategory.documentId || '',
              }
            : { id: 0, documentId: 'other' },
        temperatures: x.temperatures || [],
      }
    })

    return {
      success: true,
      data: {
        data: transformedData,
        meta: {
          pagination: {
            page: 1,
            pageCount: 1,
            pageSize: 1000,
            total: productsArray.length,
          },
        },
      },
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}
