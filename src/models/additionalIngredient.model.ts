import { LocalizedString } from '@lib/helpers/locale'

export type IAdditionalIngredient = {
  id: number
  name: LocalizedString // Backend sends 'name' not 'name_by_locale'
  priceModifier: number
  weight: string // Backend sends weight as plain string, not LocalizedString
}
