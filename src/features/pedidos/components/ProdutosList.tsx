import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { pedidosService } from '@/features/pedidos/services/pedidosService'
import { useDebounce } from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ProductDto } from '@/types'

interface ProdutosListProps {
  onAdd: (product: ProductDto) => void
  addedIds: Set<string>
}

export const ProdutosList = ({ onAdd, addedIds }: ProdutosListProps) => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'search', debouncedSearch],
    queryFn: () => pedidosService.searchProducts(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produto por nome ou SKU (mín. 2 caracteres)..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <LoadingSpinner size="sm" className="py-4" />}

      {!isLoading && debouncedSearch.length >= 2 && products?.length === 0 && (
        <EmptyState title="Nenhum produto encontrado" />
      )}

      {products && products.length > 0 && (
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  SKU: {product.sku} · {product.unit} · {formatCurrency(Number(product.price))}
                </p>
              </div>
              <Button
                size="sm"
                variant={addedIds.has(product.id) ? 'secondary' : 'default'}
                className="shrink-0"
                disabled={addedIds.has(product.id)}
                onClick={() => onAdd(product)}
              >
                <Plus className="size-3.5" />
                {addedIds.has(product.id) ? 'Adicionado' : 'Adicionar'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
