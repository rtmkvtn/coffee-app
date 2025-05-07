import { ICategory } from './category.model'
import { IStrapiMedia } from './media.model'
import { ISubcategory } from './subcategory.model'

export type IProduct = {
  order: number
  id: number
  documentId: string
  name: string
  description?: string
  on_hold: boolean
  price: number
  ingredients?: string
  avatar?: IStrapiMedia
  category: Pick<ICategory, 'id' | 'documentId'>
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
}
