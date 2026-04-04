import { IAdditionalIngredient } from './additionalIngredient.model'
import { IProductPortion } from './portion.model'

export type IProductTemperature = 'cold' | 'hot'

export type ITemperatureOption = {
  temperatureId: number
  type: IProductTemperature
}

export type IProduct = {
  id: number
  name: string
  description: string | null
  image: string | null
  imageBlur: string | null
  basePrice: number
  subcategoryId: number
  prices: IProductPortion[]
  additionalIngredients: IAdditionalIngredient[]
  temperatures: ITemperatureOption[]
}
