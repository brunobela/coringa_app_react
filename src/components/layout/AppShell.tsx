import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export const AppShell = () => (
  <div className="min-h-svh bg-background">
    <Sidebar />

    {/* Content area — offset pelo sidebar fixo no desktop */}
    <div className="flex flex-col md:ml-[260px]">
      <Header />
      <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
    </div>

    <BottomNav />
  </div>
)
