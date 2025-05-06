import { ISubcategory } from './subcategory.model'

export type ICategory = {
  id: number
  documentId: string
  name: string
  description?: string
  subcategories: ISubcategory
}
