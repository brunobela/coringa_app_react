export const USER_ROLES = {
  ADMIN: 'A',
  VENDEDOR: 'V',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
