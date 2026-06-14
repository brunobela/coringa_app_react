import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Search, Users, ClipboardList, Lock, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/features/auth/hooks/useLogout'
import logo from '@/assets/logotipo_coringa.png'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/alterar-senha', label: 'Alterar Senha', icon: Lock },
  { to: '/pedidos', label: 'Consultar Pedido', icon: Search },
  { to: '/clientes', label: 'Consultar Cliente', icon: Users },
  { to: '/pedidos/novo', label: 'Novo Pedido', icon: ClipboardList },
]

export const Header = () => {
  const logout = useLogout()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <header className="flex h-[70px] items-center bg-white px-3 shadow-sm md:hidden">
        <button
          className="flex size-10 items-center justify-center rounded-lg text-foreground"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-7" />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <img src={logo} alt="Coringa" className="max-h-[44px]" />
        </div>
        <div className="size-10" />
      </header>

      {/* Offcanvas overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Offcanvas drawer */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[82vw] max-w-80 flex-col rounded-r-[1.25rem] transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          background: 'linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)',
          boxShadow: '0.25rem 0 2rem rgba(0,0,0,0.45)',
        }}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <span className="text-base font-bold tracking-wide text-white">Menu Principal</span>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 transition-colors hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-[#e2e8f0] transition-colors',
                  isActive
                    ? 'bg-[#C0392B] font-semibold text-white shadow-[0_6px_18px_rgba(192,57,43,0.45)]'
                    : 'hover:bg-white/6',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl text-[1.15rem]',
                      isActive ? 'bg-white/15' : 'bg-white/7',
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 pb-8">
          <button
            onClick={() => { logout(); setOpen(false) }}
            className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-[#fca5a5] transition-colors hover:bg-[#DC2626] hover:text-white"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/18 text-[1.15rem]">
              <LogOut className="size-5" />
            </span>
            Sair
          </button>
        </div>
      </div>
    </>
  )
}
