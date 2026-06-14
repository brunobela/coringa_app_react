import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'size-4', md: 'size-8', lg: 'size-12' }

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => (
  <div className={cn('flex items-center justify-center', className)}>
    <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizeMap[size])} />
  </div>
)
