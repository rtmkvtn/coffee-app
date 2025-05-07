import { IUser } from '@models/user.model'

import api from './api'
import { ISingleTypeResponseWrapper } from './services.types'

interface IAuthResponse {
  jwt: string
  user: IUser
  cart: {
    id: number
    documentId: string
    items: any[]
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: string | null
  }
}

export const authenticateWithTelegram = async (
  initData: string
): Promise<ISingleTypeResponseWrapper<IAuthResponse>> => {
  try {
    const response = await api.post('/api/telegram/auth', { initData })

    return {
      success: true,
      data: response.data,
    }
  } catch (e: any) {
    return {
      success: false,
      code: e.status,
    }
  }
}
