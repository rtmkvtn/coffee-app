import { IAdditionalIngredient } from './additionalIngredient.model'
import { ICategory } from './category.model'
import { IProductPortion } from './portion.model'
import { ISubcategory } from './subcategory.model'

export type IProductTemperature = 'cold' | 'hot'

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
  avatar?: string
  category: Pick<ICategory, 'id' | 'documentId'>
  temperatures: IProductTemperature[]
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
}

export type IProductBackend = {
  additionalIngredients: IAdditionalIngredient[]
  category: Pick<ICategory, 'id' | 'documentId'>
  createdAt: string // Datetime
  description?: string
  documentId: string
  id: number
  avatar?: string
  ingredients?: string
  locale: string
  name: string
  on_hold: boolean
  order: number
  prices: IProductPortion[]
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
  temperatures: IProductTemperature[]
  updatedAt: string // Datetime
}
