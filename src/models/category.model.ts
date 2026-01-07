import { LocalizedString } from '@lib/helpers/locale'

import { ISubcategory } from './subcategory.model'

export type ICategory = {
  id: number
  documentId: string
  name_by_locale: LocalizedString
  description_by_locale?: LocalizedString
  subcategories: ISubcategory[]
}
