import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetaCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  borderColor: string
  iconBg: string
  iconColor: string
}

export const MetaCard = ({ title, value, subtitle, icon: Icon, borderColor, iconBg, iconColor }: MetaCardProps) => (
  <div className={cn('flex items-center gap-4 rounded-2xl border border-border/60 bg-white py-5 pl-0 pr-5 shadow-sm', 'overflow-hidden relative')}>
    {/* Left color stripe */}
    <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl" style={{ backgroundColor: borderColor }} />

    {/* Icon */}
    <div
      className="ml-5 flex size-12 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: iconBg }}
    >
      <Icon className="size-6" style={{ color: iconColor }} />
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1">
      <p className="truncate text-[0.78rem] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-0.5 text-[1.5rem] font-extrabold leading-tight tracking-tight text-[#0f172a]">{value}</p>
      {subtitle && <p className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
)
