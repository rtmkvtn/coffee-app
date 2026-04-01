export type IResponseWrapper<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      code: number
    }
