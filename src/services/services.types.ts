export type IStrapiPaginationMeta = {
  pagination: {
    page: number
    pageCount: number
    pageSize: number
    total: number
  }
}

interface IStrapiResponse<T> {
  data: T
  meta: IStrapiPaginationMeta
}

export type IResponseWrapper<T> =
  | {
      success: true
      data: IStrapiResponse<T>
    }
  | {
      success: false
      code: number
    }
