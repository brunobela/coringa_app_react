import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/format'

interface ResumoFinanceiroProps {
  total: number
  totalItems: number
}

export const ResumoFinanceiro = ({ total, totalItems }: ResumoFinanceiroProps) => (
  <div className="rounded-lg border bg-card p-4">
    <p className="mb-3 text-sm font-semibold">Resumo</p>
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Total de itens</span>
        <span>{totalItems}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Total do pedido</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  </div>
)
