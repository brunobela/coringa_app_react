import { useAuth } from '@/context/AuthContext'

export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuth()
  return { user, isAuthenticated }
}
