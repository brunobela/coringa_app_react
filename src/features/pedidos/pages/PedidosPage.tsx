import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { usePedidos } from '@/features/pedidos/hooks/usePedidos'
import { PedidoCard } from '@/features/pedidos/components/PedidoCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDebounce } from '@/hooks/useDebounce'

export const PedidosPage = () => {
  const navigate = useNavigate()
  const { data: pedidos, isLoading } = usePedidos()

  const [search, setSearch] = useState('')
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    if (!pedidos) return []
    const q = debouncedSearch.toLowerCase()
    const from = dataInicial ? new Date(dataInicial) : null
    const to = dataFinal ? new Date(dataFinal + 'T23:59:59') : null

    return pedidos.filter((p) => {
      if (q && !p.orderCode.toLowerCase().includes(q) && !p.customerName.toLowerCase().includes(q)) return false
      const created = new Date(p.createdAt)
      if (from && created < from) return false
      if (to && created > to) return false
      return true
    })
  }, [pedidos, debouncedSearch, dataInicial, dataFinal])

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-[1.6rem] font-extrabold tracking-tight text-[#0f172a]">Pedidos</h2>
        <button
          onClick={() => navigate('/pedidos/novo')}
          className="flex items-center gap-1.5 rounded-xl bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C]"
        >
          <Plus className="size-4" />
          Novo Pedido
        </button>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Filter className="size-4" />
          Filtros
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou cliente..."
              className="rounded-[0.625rem] bg-[#F8FAFC] pl-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Data Inicial
              </label>
              <Input
                type="date"
                className="w-36 rounded-[0.625rem] bg-[#F8FAFC] text-sm"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                Data Final
              </label>
              <Input
                type="date"
                className="w-36 rounded-[0.625rem] bg-[#F8FAFC] text-sm"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner className="py-20" />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="Nenhum pedido encontrado"
          description={
            debouncedSearch || dataInicial || dataFinal
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro pedido clicando em Novo Pedido'
          }
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{filtered.length} pedido(s) encontrado(s)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <PedidoCard key={p.id} pedido={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
