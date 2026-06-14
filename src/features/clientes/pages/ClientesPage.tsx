import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useClientes } from '@/features/clientes/hooks/useClientes'
import { ClienteCard } from '@/features/clientes/components/ClienteCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDebounce } from '@/hooks/useDebounce'

export const ClientesPage = () => {
  const { data: clientes, isLoading } = useClientes()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    if (!clientes) return []
    const q = debouncedSearch.toLowerCase()
    if (!q) return clientes
    return clientes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.fantasyName.toLowerCase().includes(q) ||
        c.internalId.toLowerCase().includes(q) ||
        c.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
    )
  }, [clientes, debouncedSearch])

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-[1.6rem] font-extrabold tracking-tight text-[#0f172a]">Clientes</h2>
        {clientes && (
          <span className="rounded-full bg-primary/8 px-3 py-1 text-sm font-semibold text-primary">
            {clientes.length} registros
          </span>
        )}
      </div>

      {/* Busca */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, fantasia, código ou CNPJ..."
            className="rounded-[0.625rem] bg-[#F8FAFC] pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner className="py-20" />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="Nenhum cliente encontrado"
          description={debouncedSearch ? `Sem resultados para "${debouncedSearch}"` : undefined}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <>
          {debouncedSearch && (
            <p className="text-sm text-muted-foreground">{filtered.length} resultado(s)</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => <ClienteCard key={c.id} cliente={c} />)}
          </div>
        </>
      )}
    </div>
  )
}
