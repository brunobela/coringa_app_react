import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
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
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative size-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="totalValue" nameKey="statusLabel" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="none">
                {data.map((item) => (
                  <Cell key={item.orderStatus} fill={STATUS_META[item.orderStatus]?.color ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [formatCurrency(Number(value ?? 0)), String(name)]}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[0.68rem] text-muted-foreground">Total</span>
            <span className="text-[0.95rem] font-bold text-[#1e293b]">{formatCurrency(totalValue)}</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {data.map((item) => {
            const meta = STATUS_META[item.orderStatus]
            return (
              <div key={item.orderStatus} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta?.color ?? '#94a3b8' }} />
                  <span className="text-[0.82rem] font-medium text-[#1e293b]">{meta?.label ?? item.statusLabel}</span>
                  <span className="text-[0.78rem] text-muted-foreground">({item.count})</span>
                </div>
                <span className="shrink-0 text-[0.82rem] font-semibold text-[#1e293b]">
                  {formatCurrency(item.totalValue)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
