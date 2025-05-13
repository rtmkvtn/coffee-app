import { IProduct } from '@models/index'

import api from './api'
import { IResponseWrapper } from './services.types'

export const getAllProducts = async (): Promise<
  IResponseWrapper<IProduct[]>
> => {
  try {
    let allProducts: IProduct[] = []
    let currentPage = 1
    let hasMorePages = true
    let totalPages = 0
    let totalItems = 0

    while (hasMorePages) {
      const response = await api.get('/api/products', {
        params: {
          sort: ['order:asc'],
          'pagination[page]': currentPage,
          'pagination[pageSize]': 100,
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

      const { data, meta } = response.data
      allProducts = [...allProducts, ...data]
      totalPages = meta.pagination.pageCount
      totalItems = meta.pagination.total

      // Check if we've reached the last page
      hasMorePages = currentPage < totalPages
      currentPage++
    }

    return {
      success: true,
      data: {
        data: allProducts,
        meta: {
          pagination: {
            page: totalPages,
            pageCount: totalPages,
            pageSize: 100,
            total: totalItems,
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
