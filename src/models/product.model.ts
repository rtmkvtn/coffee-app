import { IAdditionalIngredient } from './additionalIngredient.model'
import { ICategory } from './category.model'
import { IStrapiMedia } from './media.model'
import { IProductPortion } from './portion.model'
import { ISubcategory } from './subcategory.model'

export type IProduct = {
  order: number
  id: number
  documentId: string
  name: string
  description?: string
  on_hold: boolean
  ingredients?: string
  additionalIngredients: IAdditionalIngredient[]
  portions: IProductPortion[]
  avatar?: IStrapiMedia
  category: Pick<ICategory, 'id' | 'documentId'>
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
}

export type IProductBackend = {
  additionalIngredients: IAdditionalIngredient[]
  category: Pick<ICategory, 'id' | 'documentId'>
  createdAt: string // Datetime
  description?: string
  documentId: string
  id: number
  avatar?: IStrapiMedia
  ingredients?: string
  locale: string
  name: string
  on_hold: boolean
  order: number
  prices: IProductPortion[]
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
  updatedAt: string // Datetime
}
