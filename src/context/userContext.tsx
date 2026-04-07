import { createContext, ReactNode, useContext, useState } from 'react'

import { Locale } from '@lib/helpers/locale'
import { IUser } from '@models/index'
import {
  authenticateWithTelegram,
  updateUserLanguage,
} from '@services/userService'

type UserState = {
  user: IUser | null
}

type UserContextType = UserState & {
  setUser: (user: IUser | null) => void
  authenticate: (initData: string) => Promise<IUser>
  updateLanguage: (languageCode: Locale) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>({
    user: null,
  })

  const setUser = (user: IUser | null) =>
    setState((prev) => ({ ...prev, user }))

  const authenticate = async (initData: string): Promise<IUser> => {
    try {
      const authResponse = await authenticateWithTelegram(initData)
      if (!authResponse.success) {
        throw new Error('Authentication failed')
      }

      localStorage.setItem('token', authResponse.data.accessToken)
      setUser(authResponse.data.user)
      return authResponse.data.user
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  const updateLanguage = (languageCode: Locale) => {
    setState((prev) =>
      prev.user ? { ...prev, user: { ...prev.user, languageCode } } : prev
    )
    void updateUserLanguage(languageCode)
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUser,
        authenticate,
        updateLanguage,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
