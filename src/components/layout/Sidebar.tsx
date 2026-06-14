import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Search, Users, ClipboardList, Lock, LogOut } from 'lucide-react'
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

export const Sidebar = () => {
  const logout = useLogout()

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col md:flex" style={{
      background: 'linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
      overflowY: 'auto',
    }}>
      <div className="flex min-h-[80px] items-center justify-center border-b border-white/10 px-6">
        <img src={logo} alt="Coringa" className="max-h-[55px] brightness-110" />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/pedidos/novo' ? false : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white transition-all duration-200',
                isActive
                  ? 'bg-[#C0392B] font-bold shadow-[0_6px_18px_rgba(192,57,43,0.45)]'
                  : 'hover:bg-[#DC2626]',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-xl bg-white" />
                )}
                <Icon className="size-[1.1rem] shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 pb-6">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#DC2626]"
        >
          <LogOut className="size-[1.1rem]" />
          Sair
        </button>
      </div>
    </aside>
  )
}
