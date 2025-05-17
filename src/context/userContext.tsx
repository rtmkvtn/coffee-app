import { createContext, ReactNode, useContext, useState } from 'react'

import { IUser } from '@models/index'
import { authenticateWithTelegram } from '@services/userService'

type UserState = {
  user: IUser | null
}

type UserContextType = UserState & {
  setUser: (user: IUser | null) => void
  authenticate: (initData: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<UserState>({
    user: null,
  })

  const setUser = (user: IUser | null) =>
    setState((prev) => ({ ...prev, user }))

  const authenticate = async (initData: string) => {
    try {
      const authResponse = await authenticateWithTelegram(initData)
      if (!authResponse.success) {
        throw new Error('Authentication failed')
      }

      localStorage.setItem('token', authResponse.data.jwt)
      setUser(authResponse.data.user)
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUser,
        authenticate,
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
