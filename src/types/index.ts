import type { UserRole } from '@/config/roles'

export interface UserInfo {
  id: string
  email: string
  name: string
  type: UserRole
}

export interface LoginDto {
  login: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user: UserInfo
}

export interface ChangePasswordDto {
  email: string
  currentPassword: string
  newPassword: string
}

export interface CustomerDto {
  id: string
  internalId: string
  name: string
  fantasyName: string
  address: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  cnpj: string
  ie: string
  blocked: boolean
  lastPurchase: string | null
  email: string
  userId: string
  reason: string
  limit: string
  paymentCondition: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductDto {
  id: string
  sku: string
  name: string
  unit: string
  factor: string
  price: string
  packSize: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const ORDER_STATUS = {
  NaoFinalizado: 1,
  Finalizado: 2,
  Enviado: 3,
  Recebido: 4,
  Faturado: 5,
  Cancelado: 6,
} as const

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export interface OrderItemPayload {
  productId: string
  quantity: number
  regularPrice: number
  pricePractical: number
  subtotal: number
}

export interface CreateOrderDto {
  customerId: string
  userId: string
  deliveryDate?: string
  total: number
  orderStatus: number
  observation?: string
  items: OrderItemPayload[]
}

export interface OrderDetailItemDto {
  id: string
  orderId: string
  productId: string
  productName: string
  sku: string
  quantity: number
  regularPrice: number
  pricePractical: number
  subtotal: number
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface OrderCustomerDto {
  id: string
  name: string
  internalId: string
  cnpj: string
}

export interface OrderUserDto {
  id: string
  name: string
  login: string
  email: string
}

export interface OrderDetailDto {
  id: string
  orderCode: string
  customerId: string
  customerName: string
  customer: OrderCustomerDto | null
  userId: string
  userName: string
  user: OrderUserDto | null
  total: number
  orderStatus: number
  deliveryDate: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  observation: string | null
  items: OrderDetailItemDto[]
}

export interface OrderSummaryDto {
  id: string
  orderCode: string
  customerId: string
  customerName: string
  userId: string
  userName: string
  total: number
  orderStatus: number
  createdAt: string
  updatedAt: string
}

export interface SalesByMonthDto {
  year: number
  month: number
  monthName: string
  totalSales: number
  ordersCount: number
}

export interface SalesByCustomerDto {
  rank: number
  customerId: string
  customerName: string
  fantasyName: string
  totalSales: number
  ordersCount: number
}

export interface SalesByProductDto {
  rank: number
  productId: string
  productName: string
  sku: string
  totalQuantity: number
  totalRevenue: number
}

export interface OrdersByStatusDto {
  orderStatus: number
  statusLabel: string
  count: number
  totalValue: number
}

export interface SalesBySellerDto {
  rank: number
  sellerId: string
  sellerName: string
  totalSales: number
  ordersCount: number
}
