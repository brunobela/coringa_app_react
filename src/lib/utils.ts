import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNavItemActive(pathname: string, to: string) {
  if (pathname === to) return true
  if (to === '/pedidos') return /^\/pedidos\/(?!novo)/.test(pathname)
  return pathname.startsWith(`${to}/`)
}
