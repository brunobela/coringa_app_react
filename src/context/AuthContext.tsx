import { createContext, useContext, useState, useCallback } from 'react'
import type { UserInfo } from '@/types'

interface AuthContextValue {
  user: UserInfo | null
  signIn: (token: string, user: UserInfo) => void
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const getStoredUser = (): UserInfo | null => {
  try {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as UserInfo) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(getStoredUser)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))

  const signIn = useCallback((token: string, newUser: UserInfo) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
    setIsAuthenticated(true)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
