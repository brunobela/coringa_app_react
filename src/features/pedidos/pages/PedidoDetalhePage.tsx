import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { usePedidoDetalhe } from '@/features/pedidos/hooks/usePedidos'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency, formatDate } from '@/utils/format'
import { ORDER_STATUS } from '@/types'

const STATUS_CONFIG: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  [ORDER_STATUS.NaoFinalizado]: { label: 'Não Finalizado', variant: 'secondary' },
  [ORDER_STATUS.Finalizado]: { label: 'Finalizado', variant: 'outline' },
  [ORDER_STATUS.Enviado]: { label: 'Enviado', variant: 'default' },
  [ORDER_STATUS.Recebido]: { label: 'Recebido', variant: 'default' },
  [ORDER_STATUS.Faturado]: { label: 'Faturado', variant: 'default' },
  [ORDER_STATUS.Cancelado]: { label: 'Cancelado', variant: 'destructive' },
}

export const PedidoDetalhePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pedido, isLoading } = usePedidoDetalhe(id!)

  if (isLoading) return <LoadingSpinner className="h-64" />
  if (!pedido) return (
    <div className="p-6 text-center text-muted-foreground">Pedido não encontrado.</div>
  )

  const status = STATUS_CONFIG[pedido.orderStatus] ?? { label: String(pedido.orderStatus), variant: 'secondary' as const }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Pedido #{pedido.orderCode}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(pedido.createdAt)}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <User className="size-4" />
            Cliente
          </div>
          <p className="text-sm">{pedido.customerName}</p>
          {pedido.customer && (
            <p className="text-xs text-muted-foreground">Cód: {pedido.customer.internalId}</p>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="size-4" />
            Datas
          </div>
          <p className="text-xs text-muted-foreground">
            Criado em: <span className="text-foreground">{formatDate(pedido.createdAt)}</span>
          </p>
          {pedido.deliveryDate && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Entrega: <span className="text-foreground">{formatDate(pedido.deliveryDate)}</span>
            </p>
          )}
        </div>
      </div>

      {pedido.observation && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Observação</p>
          <p className="text-sm">{pedido.observation}</p>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 border-b p-4 text-sm font-semibold">
          <Package className="size-4" />
          Itens do Pedido
        </div>
        <div className="divide-y">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  SKU: {item.sku} · {item.quantity} un × {formatCurrency(item.pricePractical)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(pedido.total)}</span>
        </div>
      </div>
    </div>
  )
}
