import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatCNPJ = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, '')
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return '-'
  }
}

export const formatDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  } catch {
    return '-'
  }
}
