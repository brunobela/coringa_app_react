import { api } from '@/lib/api'
import type { LoginDto, AuthResponse, ChangePasswordDto } from '@/types'

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.patch('/auth/change-password', data)
  },
}
