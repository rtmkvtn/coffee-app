import { ICategory } from '../models/category.model'
import api from './api'
import { IResponseWrapper } from './services.types'

export const getCategories = async (): Promise<
  IResponseWrapper<ICategory[]>
> => {
  try {
    const response = await api.get(
      '/api/categories?locale=ru&sort[0]=order:asc&fields[0]=id&fields[1]=name&fields[2]=description&populate[subcategories][sort][0]=order:asc&populate[subcategories][fields][0]=id&populate[subcategories][fields][1]=name&populate[subcategories][fields][2]=description&populate[subcategories][populate][products][sort][0]=order:asc&populate[subcategories][populate][products][fields][0]=id&populate[subcategories][populate][products][fields][1]=name&populate[subcategories][populate][products][fields][2]=description&populate[subcategories][populate][products][fields][3]=on_hold&populate[subcategories][populate][products][fields][4]=price&populate[subcategories][populate][products][fields][5]=ingredients'
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
