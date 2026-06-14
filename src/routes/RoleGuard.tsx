import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { UserRole } from '@/config/roles'

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useCurrentUser()
  if (!user || !allowedRoles.includes(user.type)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
