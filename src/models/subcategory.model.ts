import { IProduct } from './product.model'

export type ISubcategory = {
  id: number
  documentId: string
  name: string
  description?: string
  products: IProduct[]
}
