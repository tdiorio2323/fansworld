import React from "react";
import { motion } from "framer-motion";
import { hasScope, hasAnyScope, hasAllScopes, type Scope, type User } from "@/lib/access";
import { GlassCard } from "@/components/ui/glass-card";
import { FrostedButton } from "@/components/ui/frosted-button";
import { Shield, Crown, Lock } from "lucide-react";
import Link from "next/link";

interface ScopeGuardProps {
  children: React.ReactNode;
  scope?: Scope;
  scopes?: Scope[];
  requireAll?: boolean; // If true with scopes array, requires ALL scopes. If false, requires ANY scope
  user?: User;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showUpgrade?: boolean;
}

export default function ScopeGuard({ 
  children, 
  scope, 
  scopes, 
  requireAll = false, 
  user,
  fallback,
  redirectTo,
  showUpgrade = true
}: ScopeGuardProps) {
  // Determine if user has required permissions
  let hasPermission = false;

  if (scope) {
    hasPermission = hasScope(scope, user);
  } else if (scopes && scopes.length > 0) {
    if (requireAll) {
      hasPermission = hasAllScopes(scopes, user);
    } else {
      hasPermission = hasAnyScope(scopes, user);
    }
  } else {
    // No requirements specified, allow access
    hasPermission = true;
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied UI with glassmorphism
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-8 text-center max-w-md" gradient>
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30 w-fit mx-auto mb-6">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Access Restricted
            </h2>
            
            <p className="text-gray-300 mb-6">
              {scope && `You need ${scope.replace('_', ' ').toLowerCase()} access to view this content.`}
              {scopes && !scope && 
                `You need ${requireAll ? 'all of' : 'one of'} these permissions: ${scopes.map(s => s.replace('_', ' ')).join(', ').toLowerCase()}.`
              }
            </p>

            <div className="space-y-3">
              {showUpgrade && (
                <>
                  {(scope === "CABANA_VIP" || scopes?.includes("CABANA_VIP")) && (
                    <Link href="/vip">
                      <FrostedButton variant="luxury" size="lg" className="w-full">
                        <Crown className="h-5 w-5 mr-2" />
                        Join VIP Waitlist
                      </FrostedButton>
                    </Link>
                  )}
                  
                  {(scope === "CREATOR_TOOLS" || scopes?.includes("CREATOR_TOOLS")) && (
                    <Link href="/creator-application">
                      <FrostedButton variant="primary" size="lg" className="w-full">
                        <Shield className="h-5 w-5 mr-2" />
                        Apply as Creator
                      </FrostedButton>
                    </Link>
                  )}
                </>
              )}

              {redirectTo && (
                <Link href={redirectTo}>
                  <FrostedButton variant="ghost" size="lg" className="w-full">
                    Go Back
                  </FrostedButton>
                </Link>
              )}
              
              {!redirectTo && (
                <Link href="/">
                  <FrostedButton variant="ghost" size="lg" className="w-full">
                    Return Home
                  </FrostedButton>
                </Link>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-6">
              Contact support if you believe this is an error.
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}