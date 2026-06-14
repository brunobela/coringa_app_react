import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/features/dashboard/services/dashboardService'

export const useDashboardData = (year: number) => {
  const salesByMonth = useQuery({
    queryKey: ['dashboard', 'salesByMonth', year],
    queryFn: () => dashboardService.getSalesByMonth(year),
  })

  const salesByCustomer = useQuery({
    queryKey: ['dashboard', 'salesByCustomer', year],
    queryFn: () => dashboardService.getSalesByCustomer(year, 5),
  })

  const salesByProduct = useQuery({
    queryKey: ['dashboard', 'salesByProduct', year],
    queryFn: () => dashboardService.getSalesByProduct(year, 5),
  })

  const ordersByStatus = useQuery({
    queryKey: ['dashboard', 'ordersByStatus', year],
    queryFn: () => dashboardService.getOrdersByStatus(year),
  })

  const isLoading =
    salesByMonth.isLoading ||
    salesByCustomer.isLoading ||
    salesByProduct.isLoading ||
    ordersByStatus.isLoading

  return { salesByMonth, salesByCustomer, salesByProduct, ordersByStatus, isLoading }
}
