import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can return a loading spinner here if you prefer
    return null;
  }

  if (!user) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to send them back to that page after they log in.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
