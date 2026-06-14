import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/utils/format'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingCart } from 'lucide-react'
import type { CartItem } from '@/features/pedidos/hooks/useCart'

interface CarrinhoProps {
  items: CartItem[]
  onRemove: (productId: string) => void
  onSetQty: (productId: string, qty: number) => void
  onSetPrice: (productId: string, price: number) => void
}

export const Carrinho = ({ items, onRemove, onSetQty, onSetPrice }: CarrinhoProps) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Busque e adicione produtos acima"
        icon={<ShoppingCart className="size-10 opacity-40" />}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(({ product, quantity, pricePractical }) => (
        <div key={product.id} className="rounded-lg border bg-card p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {product.sku} · {product.unit}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-destructive hover:text-destructive"
              onClick={() => onRemove(product.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground">Qtd</label>
              <Input
                type="number"
                min={1}
                className="h-8 text-sm"
                value={quantity}
                onChange={(e) => onSetQty(product.id, Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground">Preço Unit.</label>
              <Input
                type="number"
                min={0}
                step={0.01}
                className="h-8 text-sm"
                value={pricePractical}
                onChange={(e) => onSetPrice(product.id, Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground">Subtotal</label>
              <div className="flex h-8 items-center text-sm font-semibold text-primary">
                {formatCurrency(quantity * pricePractical)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
