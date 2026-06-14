import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { queryClient } from '@/lib/queryClient'

export const useLogout = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return () => {
    signOut()
    queryClient.clear()
    navigate('/login', { replace: true })
  }
}
