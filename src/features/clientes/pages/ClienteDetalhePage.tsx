import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Mail, CreditCard, ShoppingBag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useClienteDetalhe } from '@/features/clientes/hooks/useClienteDetalhe'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatCNPJ, formatDate, formatCurrency } from '@/utils/format'

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value || '—'}</span>
  </div>
)

export const ClienteDetalhePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: cliente, isLoading } = useClienteDetalhe(id!)

  if (isLoading) return <LoadingSpinner className="h-64" />
  if (!cliente) return (
    <div className="p-6 text-center text-muted-foreground">Cliente não encontrado.</div>
  )

  const address = [cliente.address, cliente.number, cliente.neighborhood, cliente.city, cliente.state]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{cliente.fantasyName || cliente.name}</h1>
          <p className="truncate text-sm text-muted-foreground">{cliente.name}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {cliente.blocked && <Badge variant="destructive">Bloqueado</Badge>}
          <Badge variant={cliente.isActive ? 'default' : 'secondary'}>
            {cliente.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Building2 className="size-4" />
          Dados Cadastrais
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <InfoRow label="CNPJ" value={formatCNPJ(cliente.cnpj)} />
          <InfoRow label="IE" value={cliente.ie} />
          <InfoRow label="Código Interno" value={cliente.internalId} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <MapPin className="size-4" />
          Endereço
        </div>
        <p className="text-sm">{address || '—'}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">CEP: {cliente.zipCode || '—'}</p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Mail className="size-4" />
          Contato
        </div>
        <InfoRow label="E-mail" value={cliente.email} />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <CreditCard className="size-4" />
          Financeiro
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Limite de Crédito" value={cliente.limit ? formatCurrency(Number(cliente.limit)) : '—'} />
          <InfoRow label="Cond. Pagamento" value={cliente.paymentCondition} />
          {cliente.reason && <InfoRow label="Motivo Bloqueio" value={cliente.reason} />}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShoppingBag className="size-4" />
          Última compra: {formatDate(cliente.lastPurchase)}
        </div>
        <Button onClick={() => navigate(`/pedidos/novo?clienteId=${cliente.id}`)}>
          <Plus className="mr-2 size-4" />
          Novo Pedido
        </Button>
      </div>
    </div>
  )
}
