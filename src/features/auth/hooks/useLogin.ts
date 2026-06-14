import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/features/auth/services/authService'
import type { LoginDto } from '@/types'

export const useLogin = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: ({ access_token, user }) => {
      signIn(access_token, user)
      navigate('/dashboard', { replace: true })
    },
  })
}
