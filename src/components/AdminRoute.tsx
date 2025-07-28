import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  // Always call hooks first - never conditionally
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      // Check admin status
      if (!user) {
        // No user found
        setCheckingAdmin(false);
        return;
      }

      try {
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_admin, username')
          .eq('user_id', user.id)
          .single();

        
        
        if (error) {
          console.error('AdminRoute: Profile query error:', error);
          // If no profile exists, create one
          if (error.code === 'PGRST116') {
            
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
            
            // Created admin profile
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          const isAdminUser = profile?.role === 'admin' || profile?.is_admin === true;
          
          
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

  // TEMPORARY: Bypass admin auth for development
  // Remove this when admin authentication is needed  
  const BYPASS_ADMIN_AUTH = true;
  
  if (BYPASS_ADMIN_AUTH) {
    return <>{children}</>;
  }

  if (loading || checkingAdmin || isAdmin === null) {
    
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
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  
  if (!isAdmin) {
    
    return <Navigate to={redirectTo} replace />;
  }

  
  return <>{children}</>;
}