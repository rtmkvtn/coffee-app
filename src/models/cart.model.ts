import { IProduct } from './index'

export type CartItem = IProduct & { quantity: number }

export interface ICart {
  id: number
  documentId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}
