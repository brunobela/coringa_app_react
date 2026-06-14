import { api } from '@/lib/api'
import type { OrderDetailDto, OrderSummaryDto, ProductDto, CreateOrderDto } from '@/types'

export const pedidosService = {
  getAll: async (): Promise<OrderSummaryDto[]> => {
    const { data } = await api.get<OrderSummaryDto[]>('/orders', { params: { limit: 500, page: 1 } })
    return data
  },

  getByCustomer: async (customerId: string): Promise<OrderSummaryDto[]> => {
    const { data } = await api.get<OrderSummaryDto[]>(`/orders/customer/${customerId}`)
    return data
  },

  getById: async (orderId: string): Promise<OrderDetailDto> => {
    const { data } = await api.get<OrderDetailDto>(`/orders/${orderId}`)
    return data
  },

  create: async (payload: CreateOrderDto): Promise<OrderDetailDto> => {
    const { data } = await api.post<OrderDetailDto>('/orders', payload)
    return data
  },

  searchProducts: async (text: string): Promise<ProductDto[]> => {
    const { data } = await api.get<ProductDto[]>('/products/search', { params: { text } })
    return data
  },
}
