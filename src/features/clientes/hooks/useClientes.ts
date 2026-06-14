import { useQuery } from '@tanstack/react-query'
import { clientesService } from '@/features/clientes/services/clientesService'

export const useClientes = () =>
  useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  })
