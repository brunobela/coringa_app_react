import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Check, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useClientes } from '@/features/clientes/hooks/useClientes'
import { useCart } from '@/features/pedidos/hooks/useCart'
import { useOrderCalculations } from '@/features/pedidos/hooks/useOrderCalculations'
import { ProdutosList } from '@/features/pedidos/components/ProdutosList'
import { pedidosService } from '@/features/pedidos/services/pedidosService'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { queryClient } from '@/lib/queryClient'
import { toast } from 'sonner'
import { formatCNPJ, formatCurrency } from '@/utils/format'
import { useDebounce } from '@/hooks/useDebounce'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ORDER_STATUS } from '@/types'
import type { CustomerDto } from '@/types'
import { cn } from '@/lib/utils'

const CLIENTES_POR_PAGINA = 10

type Step = 1 | 2 | 3

const StepWizard = ({ step }: { step: Step }) => {
  const steps = ['Cliente', 'Produtos', 'Confirmação']
  return (
    <div className="mb-6 flex items-center">
      {steps.map((label, i) => {
        const num = (i + 1) as Step
        const done = num < step
        const active = num === step
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                  done && 'border-[#10B981] bg-[#10B981] text-white',
                  active && 'border-primary bg-primary text-white shadow-[0_0_0_4px_rgba(79,70,229,0.15)]',
                  !done && !active && 'border-border bg-background text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" /> : num}
              </div>
              <span
                className={cn(
                  'text-[0.78rem] font-medium',
                  active && 'font-bold text-primary',
                  done && 'text-[#10B981]',
                  !done && !active && 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn('mb-6 mx-2 h-0.5 flex-1 transition-colors', done ? 'bg-[#10B981]' : 'bg-border')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const ProgressBar = ({ step }: { step: Step }) => (
  <div className="mb-6 flex gap-2">
    {([1, 2, 3] as Step[]).map((s) => (
      <div
        key={s}
        className={cn('h-1.5 flex-1 rounded-sm transition-colors', s <= step ? 'bg-[#DC2626]' : 'bg-border')}
      />
    ))}
  </div>
)

export const NovoPedidoPage = () => {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const { data: clientes, isLoading: loadingClientes } = useClientes()

  const [step, setStep] = useState<Step>(1)
  const [selectedCliente, setSelectedCliente] = useState<CustomerDto | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 200)

  const { items, addItem, removeItem, setQty, setPrice, clear } = useCart()
  const { subtotals, total, totalItems } = useOrderCalculations(items)
  const addedIds = useMemo(() => new Set(items.map((i) => i.product.id)), [items])

  /* ── Filtro e paginação de clientes ── */
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / CLIENTES_POR_PAGINA))
  const safePage = Math.min(page, totalPages)
  const paginatedClientes = filtered.slice((safePage - 1) * CLIENTES_POR_PAGINA, safePage * CLIENTES_POR_PAGINA)

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1) }, [])
  const handleSelect = useCallback((c: CustomerDto) => setSelectedCliente((prev) => prev?.id === c.id ? null : c), [])

  /* ── Submissão ── */
  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: () =>
      pedidosService.create({
        customerId: selectedCliente!.id,
        userId: user!.id,
        total,
        orderStatus: ORDER_STATUS.Finalizado,
        items: subtotals.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          regularPrice: Number(i.product.price),
          pricePractical: i.pricePractical,
          subtotal: i.subtotal,
        })),
      }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      clear()
      toast.success(`Pedido #${order.orderCode} criado com sucesso!`)
      navigate(`/pedidos/${order.id}`)
    },
    onError: () => toast.error('Erro ao criar o pedido. Tente novamente.'),
  })

  return (
    <div className="p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-start gap-4">
        <button
          onClick={() => (step === 1 ? navigate(-1) : setStep((s) => (s - 1) as Step))}
          className="mt-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h2 className="text-[1.6rem] font-extrabold leading-tight tracking-tight text-[#0f172a]">Novo Pedido</h2>
          <span className="mt-0.5 block text-sm text-muted-foreground">Passo {step} de 3</span>
        </div>
      </div>

      <ProgressBar step={step} />
      <StepWizard step={step} />

      {/* ── STEP 1: Cliente ── */}
      {step === 1 && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h5 className="mb-5 text-[1.05rem] font-bold text-[#1e293b]">Selecione o Cliente</h5>

          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="rounded-[0.625rem] border-border bg-[#F8FAFC] pl-10 text-sm"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {loadingClientes ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <>
              {/* Grid de cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paginatedClientes.map((c) => {
                  const selected = selectedCliente?.id === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-2 rounded-xl border-[1.5px] px-5 py-4 text-left transition-all select-none hover:border-[#94a3b8]',
                        selected
                          ? 'border-[#DC2626] bg-[#FEF2F2]'
                          : 'border-border bg-white',
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#1e293b]">
                          {c.internalId} - {c.fantasyName || c.name}
                        </p>
                        <p className="mt-0.5 truncate text-[0.8rem] text-muted-foreground">
                          {formatCNPJ(c.cnpj)} - {c.city}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          'size-[1.1rem] shrink-0 text-[#DC2626] transition-opacity',
                          selected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </button>
                  )
                })}
              </div>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
                  <p className="font-medium">Nenhum cliente encontrado</p>
                </div>
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    className="rounded-lg border border-border bg-white p-1.5 text-[#475569] transition-colors hover:border-[#DC2626] hover:text-[#DC2626] disabled:opacity-35"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="min-w-28 text-center text-sm text-muted-foreground">
                    {(safePage - 1) * CLIENTES_POR_PAGINA + 1}–
                    {Math.min(safePage * CLIENTES_POR_PAGINA, filtered.length)} de {filtered.length}
                  </span>
                  <button
                    className="rounded-lg border border-border bg-white p-1.5 text-[#475569] transition-colors hover:border-[#DC2626] hover:text-[#DC2626] disabled:opacity-35"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Produtos ── */}
      {step === 2 && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h5 className="mb-5 text-[1.05rem] font-bold text-[#1e293b]">Produtos</h5>
          <ProdutosList onAdd={addItem} addedIds={addedIds} />

          {/* Lista de itens */}
          {items.length > 0 && (
            <div className="mt-5">
              {/* Cabeçalho desktop */}
              <div className="mb-1 hidden grid-cols-[1fr_auto_80px_80px_100px_32px] gap-2 border-t border-b border-primary/20 bg-[#f9f9f9] px-2 py-1.5 text-[0.8rem] font-bold sm:grid">
                <span>Produto</span>
                <span className="text-right">Fator</span>
                <span className="text-right">Tabela</span>
                <span className="text-right">Praticado</span>
                <span className="text-right">Subtotal</span>
                <span />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {items.map(({ product, quantity, pricePractical }) => (
                  <div
                    key={product.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm shadow-sm"
                    data-fator={product.factor}
                  >
                    {/* Nome */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>

                    {/* Fator */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground sm:hidden">Fator</span>
                      <span className="min-w-[48px] rounded border bg-muted/50 px-2 py-1 text-right text-xs">{product.factor}</span>
                    </div>

                    {/* Qtd */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground sm:hidden">Qtd</span>
                      <input
                        type="number"
                        min={1}
                        className="w-20 rounded border border-border bg-white px-2 py-1 text-right text-sm"
                        value={quantity}
                        onChange={(e) => setQty(product.id, Number(e.target.value))}
                      />
                    </div>

                    {/* Preço tabela */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground sm:hidden">Tabela</span>
                      <span className="min-w-[80px] rounded border bg-muted/50 px-2 py-1 text-right text-xs">{formatCurrency(Number(product.price))}</span>
                    </div>

                    {/* Preço praticado */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground sm:hidden">Praticado</span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="w-24 rounded border border-border bg-white px-2 py-1 text-right text-sm"
                        value={pricePractical}
                        onChange={(e) => setPrice(product.id, Number(e.target.value))}
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground sm:hidden">Subtotal</span>
                      <span className="min-w-[90px] text-right text-sm font-semibold text-primary">
                        {formatCurrency(quantity * pricePractical)}
                      </span>
                    </div>

                    <button
                      className="text-destructive hover:text-destructive/70"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totalizador */}
          {items.length > 0 && (
            <div className="mt-5 flex items-center justify-end gap-6 rounded-xl border border-[#fecaca] bg-[#fff8f8] px-5 py-4">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">Itens</span>
                <span className="text-[1.1rem] font-bold text-[#1e293b]">{totalItems}</span>
              </div>
              <div className="h-10 w-px bg-[#fecaca]" />
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">Total do Pedido</span>
                <span className="text-[1.35rem] font-bold text-[#DC2626]">{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Confirmação ── */}
      {step === 3 && selectedCliente && (
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h5 className="mb-5 text-[1.05rem] font-bold text-[#1e293b]">Confirmação do Pedido</h5>

          {/* Card do cliente */}
          <div className="mb-5 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-4">
            <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">Cliente</p>
            <p className="font-bold text-[#1e293b]">{selectedCliente.fantasyName || selectedCliente.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">CNPJ: {formatCNPJ(selectedCliente.cnpj)}</p>
          </div>

          {/* Cabeçalho itens */}
          <div className="mb-1 hidden grid-cols-[1fr_60px_100px_100px_100px] gap-2 border-t border-b border-primary/20 bg-[#f9f9f9] px-2 py-1.5 text-[0.8rem] font-bold sm:grid">
            <span>Produto</span>
            <span className="text-right">Qtde</span>
            <span className="text-right">Tabela</span>
            <span className="text-right">Praticado</span>
            <span className="text-right">Subtotal</span>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {subtotals.map(({ product, quantity, pricePractical, subtotal }) => (
              <div key={product.id} className="flex flex-wrap gap-2 rounded-lg border border-border px-3 py-2.5 text-sm">
                <span className="flex-1 font-medium">{product.name}</span>
                <span className="min-w-[48px] text-right text-muted-foreground">{quantity}</span>
                <span className="min-w-[80px] text-right text-muted-foreground">{formatCurrency(Number(product.price))}</span>
                <span className="min-w-[80px] text-right text-muted-foreground">{formatCurrency(pricePractical)}</span>
                <span className="min-w-[80px] text-right font-semibold">{formatCurrency(subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Totalizador */}
          <div className="mt-5 flex items-center justify-end gap-6 rounded-xl border border-[#fecaca] bg-[#fff8f8] px-5 py-4">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">Itens</span>
              <span className="text-[1.1rem] font-bold text-[#1e293b]">{totalItems}</span>
            </div>
            <div className="h-10 w-px bg-[#fecaca]" />
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">Total do Pedido</span>
              <span className="text-[1.35rem] font-bold text-[#DC2626]">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Navegação entre steps ── */}
      <div className={cn('mt-5 flex gap-3', step > 1 ? 'justify-between' : 'justify-end')}>
        {step > 1 && (
          <button
            className="rounded-xl border-[1.5px] border-border bg-transparent px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
            onClick={() => setStep((s) => (s - 1) as Step)}
          >
            ← Voltar
          </button>
        )}

        {step < 3 ? (
          <button
            className="rounded-xl bg-[#DC2626] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] disabled:opacity-40"
            disabled={step === 1 ? !selectedCliente : items.length === 0}
            onClick={() => setStep((s) => (s + 1) as Step)}
          >
            Próximo →
          </button>
        ) : (
          <button
            className="rounded-xl bg-[#DC2626] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] disabled:opacity-40"
            disabled={isPending}
            onClick={() => createOrder()}
          >
            {isPending ? 'Enviando...' : 'Finalizar Pedido'}
          </button>
        )}
      </div>
    </div>
  )
}
