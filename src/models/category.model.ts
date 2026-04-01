import { ISubcategory } from './subcategory.model'

export type ICategory = {
  id: number
  name: string
  description: string | null
  image: string | null
  subcategories: ISubcategory[]
}
