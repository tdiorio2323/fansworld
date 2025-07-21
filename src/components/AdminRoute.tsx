import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AdminRoute({ children, redirectTo = '/home' }: AdminRouteProps) {
  // TEMPORARY: Bypass admin authentication check for testing
  // Remove this bypass when admin authentication is needed again
  const BYPASS_ADMIN_AUTH = true;
  
  if (BYPASS_ADMIN_AUTH) {
    return <>{children}</>;
  }

  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      console.log('AdminRoute: Checking admin status for user:', user?.id);
      if (!user) {
        console.log('AdminRoute: No user found');
        setCheckingAdmin(false);
        return;
      }

      try {
        console.log('AdminRoute: Querying profiles table for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_admin, username')
          .eq('user_id', user.id)
          .single();

        console.log('AdminRoute: Profile query result:', { profile, error });
        
        if (error) {
          console.error('AdminRoute: Profile query error:', error);
          // If no profile exists, create one
          if (error.code === 'PGRST116') {
            console.log('AdminRoute: No profile found, creating one...');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{
                user_id: user.id,
                username: user.email?.split('@')[0] || 'admin',
                display_name: 'Admin User',
                is_admin: true,
                role: 'admin'
              }])
              .select()
              .single();
            
            console.log('AdminRoute: Created profile:', { newProfile, createError });
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          const isAdminUser = profile?.role === 'admin' || profile?.is_admin === true;
          console.log('AdminRoute: Admin check result:', isAdminUser, profile);
          console.log('AdminRoute: Setting isAdmin state to:', isAdminUser);
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.error('AdminRoute: Unexpected error:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  if (loading || checkingAdmin || isAdmin === null) {
    console.log('AdminRoute: Still loading or checking admin status', { loading, checkingAdmin, isAdmin });
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('AdminRoute: Final render check - isAdmin:', isAdmin, 'user:', user?.id);
  if (!isAdmin) {
    console.log('AdminRoute: User is not admin, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('AdminRoute: User is admin, rendering children');
  return <>{children}</>;
}