import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import type { SalesByMonthDto, SalesByCustomerDto, SalesByProductDto } from '@/types'

interface SalesAreaChartProps {
  data: SalesByMonthDto[]
}

export const SalesAreaChart = ({ data }: SalesAreaChartProps) => (
  <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
    <h5 className="mb-5 text-[0.95rem] font-bold text-[#1e293b]">Vendas por Mês</h5>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="monthName"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Vendas']}
          contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        />
        <Bar dataKey="totalSales" fill="#4F46E5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

interface TopCustomersChartProps {
  data: SalesByCustomerDto[]
}

export const TopCustomersChart = ({ data }: TopCustomersChartProps) => {
  const max = Math.max(...data.map((d) => d.totalSales), 1)
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
      <h5 className="mb-5 text-[0.95rem] font-bold text-[#1e293b]">Top Clientes</h5>
      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <div key={item.customerId}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[0.83rem] font-medium text-[#1e293b]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.68rem] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="truncate max-w-[160px]">{item.fantasyName || item.customerName}</span>
              </span>
              <span className="shrink-0 text-[0.82rem] font-semibold text-[#16a34a]">
                {formatCurrency(item.totalSales)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${(item.totalSales / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TopProductsProps {
  data: SalesByProductDto[]
}

export const TopProductsChart = ({ data }: TopProductsProps) => {
  const max = Math.max(...data.map((d) => d.totalRevenue), 1)
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
      <h5 className="mb-5 text-[0.95rem] font-bold text-[#1e293b]">Top Produtos</h5>
      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <div key={item.productId}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[0.83rem] font-medium text-[#1e293b]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/15 text-[0.68rem] font-bold text-[#059669]">
                  {i + 1}
                </span>
                <span className="truncate max-w-[160px]">{item.productName}</span>
              </span>
              <span className="shrink-0 text-[0.82rem] font-semibold text-[#1e293b]">
                {item.totalQuantity} un.
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all duration-700"
                style={{ width: `${(item.totalRevenue / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
