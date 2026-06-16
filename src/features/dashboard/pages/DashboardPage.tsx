import { useState } from 'react'
import { TrendingUp, ShoppingBag, Users, Coins } from 'lucide-react'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { MetaCard } from '@/features/dashboard/components/MetaCard'
import { SalesAreaChart, TopCustomersChart, TopProductsChart } from '@/features/dashboard/components/KpiChart'
import { GoalProgressBar } from '@/features/dashboard/components/GoalProgressBar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCurrency } from '@/utils/format'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - 1 + i)

export const DashboardPage = () => {
  const [year, setYear] = useState(CURRENT_YEAR)
  const { salesByMonth, salesByCustomer, salesByProduct, ordersByStatus, isLoading } = useDashboardData(year)

  const totalSales = salesByMonth.data?.reduce((acc, m) => acc + m.totalSales, 0) ?? 0
  const totalOrders = salesByMonth.data?.reduce((acc, m) => acc + m.ordersCount, 0) ?? 0
  const topCustomers = salesByCustomer.data?.length ?? 0
  const ticketMedio = totalOrders > 0 ? totalSales / totalOrders : 0

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.6rem] font-extrabold tracking-tight text-[#0f172a]">Dashboard</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Resumo de desempenho do representante</p>
        </div>

        {/* Year selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-1.5 py-1 shadow-sm">
          <button
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            onClick={() => setYear((y) => Math.max(YEAR_OPTIONS[0], y - 1))}
            disabled={year <= YEAR_OPTIONS[0]}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-12 text-center text-sm font-bold text-[#1e293b]">{year}</span>
          <button
            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            onClick={() => setYear((y) => Math.min(YEAR_OPTIONS[YEAR_OPTIONS.length - 1], y + 1))}
            disabled={year >= YEAR_OPTIONS[YEAR_OPTIONS.length - 1]}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {isLoading && <LoadingSpinner className="py-24" />}

      {!isLoading && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetaCard
              title="Vendas no Ano"
              value={formatCurrency(totalSales)}
              subtitle={`${salesByMonth.data?.filter((m) => m.totalSales > 0).length ?? 0} meses ativos`}
              icon={TrendingUp}
              borderColor="#4F46E5"
              iconBg="#ede9fe"
              iconColor="#4F46E5"
            />
            <MetaCard
              title="Total de Pedidos"
              value={totalOrders}
              subtitle="pedidos no período"
              icon={ShoppingBag}
              borderColor="#10B981"
              iconBg="#d1fae5"
              iconColor="#059669"
            />
            <MetaCard
              title="Clientes Ativos"
              value={topCustomers}
              subtitle="no ranking"
              icon={Users}
              borderColor="#F59E0B"
              iconBg="#fef3c7"
              iconColor="#d97706"
            />
            <MetaCard
              title="Ticket Médio"
              value={formatCurrency(ticketMedio)}
              subtitle="por pedido"
              icon={Coins}
              borderColor="#DC2626"
              iconBg="#fee2e2"
              iconColor="#dc2626"
            />
          </div>

          {/* Charts row */}
          <div className="grid gap-4 lg:grid-cols-2">
            {salesByMonth.data && <SalesAreaChart data={salesByMonth.data} />}
            {ordersByStatus.data && <GoalProgressBar data={ordersByStatus.data} />}
          </div>

          {/* Rankings row */}
          <div className="grid gap-4 lg:grid-cols-2">
            {salesByCustomer.data && <TopCustomersChart data={salesByCustomer.data} />}
            {salesByProduct.data && <TopProductsChart data={salesByProduct.data} />}
          </div>
        </>
      )}
    </div>
  )
}
