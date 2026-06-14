import { api } from '@/lib/api'
import type {
  SalesByMonthDto,
  SalesByCustomerDto,
  SalesByProductDto,
  OrdersByStatusDto,
  SalesBySellerDto,
} from '@/types'

export const dashboardService = {
  getSalesByMonth: async (year: number): Promise<SalesByMonthDto[]> => {
    const { data } = await api.get<SalesByMonthDto[]>('/reports/sales-by-month', { params: { year } })
    return data
  },

  getSalesByCustomer: async (year: number, limit = 5): Promise<SalesByCustomerDto[]> => {
    const { data } = await api.get<SalesByCustomerDto[]>('/reports/sales-by-customer', { params: { year, limit } })
    return data
  },

  getSalesByProduct: async (year: number, limit = 5): Promise<SalesByProductDto[]> => {
    const { data } = await api.get<SalesByProductDto[]>('/reports/sales-by-product', { params: { year, limit } })
    return data
  },

  getOrdersByStatus: async (year: number): Promise<OrdersByStatusDto[]> => {
    const { data } = await api.get<OrdersByStatusDto[]>('/reports/orders-by-status', { params: { year } })
    return data
  },

  getSalesBySeller: async (year: number, limit = 5): Promise<SalesBySellerDto[]> => {
    const { data } = await api.get<SalesBySellerDto[]>('/reports/sales-by-seller', { params: { year, limit } })
    return data
  },
}
