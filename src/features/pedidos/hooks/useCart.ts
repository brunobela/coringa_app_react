import { useReducer, useCallback } from 'react'
import type { ProductDto } from '@/types'

export interface CartItem {
  product: ProductDto
  quantity: number
  pricePractical: number
}

type CartAction =
  | { type: 'ADD'; product: ProductDto }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; quantity: number }
  | { type: 'SET_PRICE'; productId: string; price: number }
  | { type: 'CLEAR' }

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find((i) => i.product.id === action.product.id)
      if (exists) return state
      return [...state, { product: action.product, quantity: 1, pricePractical: Number(action.product.price) }]
    }
    case 'REMOVE':
      return state.filter((i) => i.product.id !== action.productId)
    case 'SET_QTY':
      return state.map((i) =>
        i.product.id === action.productId ? { ...i, quantity: Math.max(1, action.quantity) } : i,
      )
    case 'SET_PRICE':
      return state.map((i) =>
        i.product.id === action.productId ? { ...i, pricePractical: Math.max(0, action.price) } : i,
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export const useCart = () => {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addItem = useCallback((product: ProductDto) => dispatch({ type: 'ADD', product }), [])
  const removeItem = useCallback((productId: string) => dispatch({ type: 'REMOVE', productId }), [])
  const setQty = useCallback((productId: string, quantity: number) => dispatch({ type: 'SET_QTY', productId, quantity }), [])
  const setPrice = useCallback((productId: string, price: number) => dispatch({ type: 'SET_PRICE', productId, price }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  return { items, addItem, removeItem, setQty, setPrice, clear }
}
