import React from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // TODO: Add admin authentication logic
  return <>{children}</>;
};