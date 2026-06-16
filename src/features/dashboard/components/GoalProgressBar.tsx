import { formatCurrency } from '@/utils/format'
import type { OrdersByStatusDto } from '@/types'
import { ORDER_STATUS } from '@/types'

interface GoalProgressBarProps {
  data: OrdersByStatusDto[]
}

const STATUS_META: Record<number, { label: string; color: string; bg: string; textColor: string }> = {
  [ORDER_STATUS.NaoFinalizado]: { label: 'Não Finalizado', color: '#d97706', bg: '#fef3c7', textColor: '#92400e' },
  [ORDER_STATUS.Finalizado]:    { label: 'Finalizado',     color: '#2563eb', bg: '#dbeafe', textColor: '#1e40af' },
  [ORDER_STATUS.Enviado]:       { label: 'Enviado',        color: '#4338ca', bg: '#e0e7ff', textColor: '#3730a3' },
  [ORDER_STATUS.Recebido]:      { label: 'Recebido',       color: '#059669', bg: '#d1fae5', textColor: '#065f46' },
  [ORDER_STATUS.Faturado]:      { label: 'Faturado',       color: '#10b981', bg: '#ecfdf5', textColor: '#064e3b' },
  [ORDER_STATUS.Cancelado]:     { label: 'Cancelado',      color: '#dc2626', bg: '#fee2e2', textColor: '#991b1b' },
}

export const GoalProgressBar = ({ data }: GoalProgressBarProps) => {
  const totalValue = data.reduce((acc, d) => acc + d.totalValue, 0)

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
      <h5 className="mb-5 text-[0.95rem] font-bold text-[#1e293b]">Pedidos por Status</h5>
      <div className="flex flex-col gap-4">
        {data.map((item) => {
          const meta = STATUS_META[item.orderStatus]
          const pct = totalValue > 0 ? (item.totalValue / totalValue) * 100 : 0
          return (
            <div key={item.orderStatus}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold"
                    style={{ backgroundColor: meta?.bg ?? '#f3f4f6', color: meta?.textColor ?? '#374151' }}
                  >
                    {meta?.label ?? item.statusLabel}
                  </span>
                  <span className="text-[0.78rem] text-muted-foreground">({item.count})</span>
                </div>
                <span className="shrink-0 text-[0.82rem] font-semibold text-[#1e293b]">
                  {formatCurrency(item.totalValue)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: meta?.color ?? '#94a3b8' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
