import { LocalizedString } from '@lib/helpers/locale'

export type ISubcategory = {
  id: number
  documentId: string
  name_by_locale: LocalizedString
  description_by_locale?: LocalizedString
  avatar: string
}
