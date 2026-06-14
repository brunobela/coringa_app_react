import { NavLink } from 'react-router-dom'
import { Home, Search, ClipboardList, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/features/auth/hooks/useLogout'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/pedidos', label: 'Pedidos', icon: Search },
  { to: '/pedidos/novo', label: 'Novo', icon: ClipboardList },
]

export const BottomNav = () => {
  const logout = useLogout()

  return (
    <nav
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-[4vw] right-[4vw] z-50 flex h-[3.75rem] items-stretch gap-1 rounded-full px-1.5 py-1.5 md:hidden"
      style={{
        background: 'rgba(28, 28, 30, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.35)',
      }}
    >
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[#f5f5f5] transition-colors',
              isActive && 'bg-[#48484a]',
            )
          }
        >
          {({ isActive }) => (
            <Icon
              className={cn('size-[1.4rem] transition-transform active:scale-85', isActive && 'fill-current')}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
          )}
        </NavLink>
      ))}

      <button
        onClick={logout}
        className="flex flex-1 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[#f5f5f5] transition-colors hover:bg-[#48484a]"
      >
        <LogOut className="size-[1.4rem]" strokeWidth={1.8} />
      </button>
    </nav>
  )
}
