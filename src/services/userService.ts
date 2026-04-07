import { Locale } from '@lib/helpers/locale'
import { IUser } from '@models/user.model'

import api from './api'
import { IResponseWrapper } from './services.types'

export interface IAuthResponse {
  accessToken: string
  user: IUser
}

export const authenticateWithTelegram = async (
  initData: string
): Promise<IResponseWrapper<IAuthResponse>> => {
  try {
    const response = await api.post('/api/auth/telegram', { initData })

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

export const updateUserLanguage = async (
  languageCode: Locale
): Promise<IResponseWrapper<IUser>> => {
  try {
    const response = await api.patch('/api/users/language', { languageCode })

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
