import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '@/utils/format'
import { ORDER_STATUS } from '@/types'
import type { OrderSummaryDto } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<number, { label: string; bg: string; color: string }> = {
  [ORDER_STATUS.NaoFinalizado]: { label: 'Não Finalizado', bg: '#fef3c7', color: '#d97706' },
  [ORDER_STATUS.Finalizado]:    { label: 'Finalizado',     bg: '#dbeafe', color: '#2563eb' },
  [ORDER_STATUS.Enviado]:       { label: 'Enviado',        bg: '#e0e7ff', color: '#4338ca' },
  [ORDER_STATUS.Recebido]:      { label: 'Recebido',       bg: '#d1fae5', color: '#059669' },
  [ORDER_STATUS.Faturado]:      { label: 'Faturado',       bg: '#ecfdf5', color: '#065f46' },
  [ORDER_STATUS.Cancelado]:     { label: 'Cancelado',      bg: '#fee2e2', color: '#dc2626' },
}

interface PedidoCardProps {
  pedido: OrderSummaryDto
}

export const PedidoCard = ({ pedido }: PedidoCardProps) => {
  const navigate = useNavigate()
  const status = STATUS_CONFIG[pedido.orderStatus] ?? { label: String(pedido.orderStatus), bg: '#f3f4f6', color: '#6b7280' }

  return (
    <button
      onClick={() => navigate(`/pedidos/${pedido.id}`)}
      className={cn(
        'flex w-full flex-col rounded-xl border border-border bg-white text-left shadow-sm transition-all',
        'hover:shadow-md hover:-translate-y-0.5 hover:border-[#DC2626]/30',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3">
        <span className="text-[1.35rem] font-extrabold tracking-tight text-[#0f172a]">
          #{pedido.orderCode}
        </span>
        <span
          className="rounded-full px-3 py-0.5 text-[0.78rem] font-semibold"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* Cliente */}
      <div className="px-5 pb-3">
        <p className="truncate text-sm text-muted-foreground">{pedido.customerName}</p>
      </div>

      <hr className="border-border/60" />

      {/* Info rows */}
      <div className="flex items-center justify-between gap-2 px-5 py-3">
        <span className="text-[0.82rem] text-muted-foreground">{formatDate(pedido.createdAt)}</span>
        <span className="text-[1.05rem] font-bold text-[#16a34a]">{formatCurrency(pedido.total)}</span>
      </div>
    </button>
  )
}
