import { useQuery } from '@tanstack/react-query'
import { clientesService } from '@/features/clientes/services/clientesService'

export const useClienteDetalhe = (id: string) =>
  useQuery({
    queryKey: ['clientes', id],
    queryFn: () => clientesService.getAll().then((list) => list.find((c) => c.id === id) ?? null),
    enabled: !!id,
  })
