export type IProduct = {
  order: number
  id: number
  documentId: string
  name: string
  description?: string
  on_hold: boolean
  price: number
  ingredients?: string
}
