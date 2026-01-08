import { LocalizedString } from '@lib/helpers/locale'

export type IAdditionalIngredient = {
  id: number
  name: LocalizedString
  priceModifier: number
  weight: LocalizedString
}
