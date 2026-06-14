import { PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export const EmptyState = ({
  title = 'Nenhum item encontrado',
  description,
  icon,
  className,
  action,
}: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground', className)}>
    {icon ?? <PackageOpen className="size-12 opacity-40" />}
    <p className="font-medium text-foreground">{title}</p>
    {description && <p className="text-sm">{description}</p>}
    {action}
  </div>
)
