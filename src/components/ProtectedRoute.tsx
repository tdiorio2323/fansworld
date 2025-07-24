import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireVip?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVip = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white text-center mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requireVip && !user?.isVip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="gradient-text text-2xl font-bold mb-4">VIP Access Required</div>
          <p className="text-gray-300 mb-6">
            This content is exclusive to VIP members. Upgrade your account to access premium features.
          </p>
          <button className="luxury-button px-6 py-3 rounded-full text-white font-semibold">
            Upgrade to VIP
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}