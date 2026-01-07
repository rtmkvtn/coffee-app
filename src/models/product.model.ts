import { LocalizedString } from '@lib/helpers/locale'

import { IAdditionalIngredient } from './additionalIngredient.model'
import { ICategory } from './category.model'
import { IProductPortion } from './portion.model'
import { ISubcategory } from './subcategory.model'

export type IProductTemperature = 'cold' | 'hot'

export type IProduct = {
  order: number
  id: number
  documentId: string
  name_by_locale: LocalizedString
  description_by_locale?: LocalizedString
  on_hold: boolean
  ingredients_by_locale?: LocalizedString
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
  description_by_locale?: LocalizedString
  documentId: string
  id: number
  avatar?: string
  ingredients_by_locale?: LocalizedString
  locale: string
  name_by_locale: LocalizedString
  on_hold: boolean
  order: number
  prices: IProductPortion[]
  subcategory: Pick<ISubcategory, 'id' | 'documentId'>
  temperatures: IProductTemperature[]
  updatedAt: string // Datetime
}
