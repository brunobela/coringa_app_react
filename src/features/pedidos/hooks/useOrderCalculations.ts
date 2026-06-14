import { useMemo } from 'react'
import type { CartItem } from './useCart'

export const useOrderCalculations = (items: CartItem[]) =>
  useMemo(() => {
    const subtotals = items.map((i) => ({
      ...i,
      subtotal: i.quantity * i.pricePractical,
    }))
    const total = subtotals.reduce((acc, i) => acc + i.subtotal, 0)
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
    return { subtotals, total, totalItems }
  }, [items])
