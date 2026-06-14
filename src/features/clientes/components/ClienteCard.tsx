import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { formatCNPJ, formatDate } from '@/utils/format'
import type { CustomerDto } from '@/types'
import { cn } from '@/lib/utils'

interface ClienteCardProps {
  cliente: CustomerDto
}

export const ClienteCard = ({ cliente }: ClienteCardProps) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/clientes/${cliente.id}`)}
      className={cn(
        'flex w-full flex-col rounded-xl border border-border bg-white text-left shadow-sm transition-all',
        'hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30',
        cliente.blocked && 'border-red-200',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3">
        <span className="text-[0.78rem] font-bold tracking-widest text-primary">
          #{cliente.internalId}
        </span>
        <div className="flex items-center gap-1.5">
          {cliente.blocked && (
            <span className="rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#dc2626]">
              Bloqueado
            </span>
          )}
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold',
              cliente.isActive
                ? 'bg-[#d1fae5] text-[#059669]'
                : 'bg-[#f3f4f6] text-[#6b7280]',
            )}
          >
            {cliente.isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {/* Nome */}
      <div className="px-5 pb-3">
        <p className="truncate font-bold text-[#1e293b]">{cliente.name}</p>
        {cliente.fantasyName && (
          <p className="truncate text-sm text-muted-foreground">{cliente.fantasyName}</p>
        )}
      </div>

      <hr className="border-border/60" />

      {/* Info rows */}
      <div className="flex flex-col gap-1.5 px-5 py-3 text-[0.82rem] text-muted-foreground">
        <span>CNPJ: {formatCNPJ(cliente.cnpj)}</span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5 shrink-0" />
          {cliente.city} — {cliente.state}
        </span>
        {cliente.lastPurchase && (
          <span className="text-[0.78rem] text-muted-foreground/70">
            Última compra: {formatDate(cliente.lastPurchase)}
          </span>
        )}
      </div>
    </button>
  )
}
