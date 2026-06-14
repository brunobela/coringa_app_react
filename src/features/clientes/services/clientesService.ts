import { api } from '@/lib/api'
import type { CustomerDto } from '@/types'

export const clientesService = {
  getAll: async (): Promise<CustomerDto[]> => {
    const { data } = await api.get<CustomerDto[]>('/customers')
    return data
  },
}
