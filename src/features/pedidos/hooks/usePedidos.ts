import { useQuery } from '@tanstack/react-query'
import { pedidosService } from '@/features/pedidos/services/pedidosService'

export const usePedidos = () =>
  useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.getAll,
  })

export const usePedidoDetalhe = (id: string) =>
  useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => pedidosService.getById(id),
    enabled: !!id,
  })

export const usePedidosPorCliente = (customerId: string) =>
  useQuery({
    queryKey: ['pedidos', 'cliente', customerId],
    queryFn: () => pedidosService.getByCustomer(customerId),
    enabled: !!customerId,
  })
