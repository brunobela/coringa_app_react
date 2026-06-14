import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AlterarSenhaPage } from '@/features/auth/pages/AlterarSenhaPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ClientesPage } from '@/features/clientes/pages/ClientesPage'
import { ClienteDetalhePage } from '@/features/clientes/pages/ClienteDetalhePage'
import { PedidosPage } from '@/features/pedidos/pages/PedidosPage'
import { PedidoDetalhePage } from '@/features/pedidos/pages/PedidoDetalhePage'
import { NovoPedidoPage } from '@/features/pedidos/pages/NovoPedidoPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'alterar-senha', element: <AlterarSenhaPage /> },
          { path: 'clientes', element: <ClientesPage /> },
          { path: 'clientes/:id', element: <ClienteDetalhePage /> },
          { path: 'pedidos', element: <PedidosPage /> },
          { path: 'pedidos/novo', element: <NovoPedidoPage /> },
          { path: 'pedidos/:id', element: <PedidoDetalhePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
