import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ClienteSearchProps {
  value: string
  onChange: (value: string) => void
}

export const ClienteSearch = ({ value, onChange }: ClienteSearchProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      placeholder="Buscar por nome, fantasia ou CNPJ..."
      className="pl-9"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
