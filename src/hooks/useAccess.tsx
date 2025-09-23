"use client";

import React, { useState, useEffect } from "react";
import { 
  getUser, 
  subscribe, 
  hasScope, 
  hasRole, 
  hasAnyScope, 
  hasAllScopes, 
  isVipUser,
  isVipWaitlisted,
  hasTier,
  type User, 
  type Role, 
  type Scope 
} from "@/lib/access";

export function useUser(): User {
  const [user, setUser] = useState<User>(getUser);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setUser(getUser());
    });
    return unsubscribe;
  }, []);

  return user;
}

export function useAccess() {
  const user = useUser();

  const checkScope = (scope: Scope) => hasScope(scope, user);
  const checkRole = (role: Role) => hasRole(role, user);
  const checkAnyScope = (scopes: Scope[]) => hasAnyScope(scopes, user);
  const checkAllScopes = (scopes: Scope[]) => hasAllScopes(scopes, user);
  const checkTier = (tier: "basic" | "premium" | "enterprise") => hasTier(tier, user);

  return {
    user,
    isAuthenticated: user.id !== "anon",
    isGuest: user.role === "guest",
    isAdmin: user.role === "admin",
    isCreator: user.role === "creator",
    isBrand: user.role === "brand",
    isVip: isVipUser(user),
    isVipWaitlisted: isVipWaitlisted(user),
    hasScope: checkScope,
    hasRole: checkRole,
    hasAnyScope: checkAnyScope,
    hasAllScopes: checkAllScopes,
    hasTier: checkTier,
    
    // Convenience methods for common checks
    canAccessVip: () => checkScope("CABANA_VIP"),
    canAccessCreatorTools: () => checkScope("CREATOR_TOOLS"),
    canAccessAdmin: () => checkScope("ADMIN"),
    canAccessAnalytics: () => checkScope("ANALYTICS"),
    canAccessMessaging: () => checkScope("MESSAGING"),
    canAccessBrand: () => checkScope("BRAND"),
    canManageWaitlist: () => checkScope("VIP_WAITLIST"),
    
    // Tier checks
    isPremium: () => checkTier("premium"),
    isEnterprise: () => checkTier("enterprise"),
    
    // Complex permission checks
    canCreateContent: () => checkAnyScope(["CREATOR_TOOLS", "BRAND", "ADMIN"]),
    canViewAnalytics: () => checkAnyScope(["ANALYTICS", "CREATOR_TOOLS", "BRAND", "ADMIN"]),
    canManageUsers: () => checkAnyScope(["ADMIN", "BRAND"]),
  };
}

// Hook for checking if user meets requirements before showing content
export function usePermissionCheck(requirements: {
  scope?: Scope;
  scopes?: Scope[];
  role?: Role;
  tier?: "basic" | "premium" | "enterprise";
  requireAll?: boolean;
  vipRequired?: boolean;
}) {
  const access = useAccess();
  
  const meetsRequirements = () => {
    // Check VIP requirement
    if (requirements.vipRequired && !access.isVip) {
      return false;
    }

    // Check tier requirement
    if (requirements.tier && !access.hasTier(requirements.tier)) {
      return false;
    }

    // Check role requirement
    if (requirements.role && !access.hasRole(requirements.role)) {
      return false;
    }

    // Check scope requirements
    if (requirements.scope && !access.hasScope(requirements.scope)) {
      return false;
    }

    if (requirements.scopes && requirements.scopes.length > 0) {
      if (requirements.requireAll) {
        return access.hasAllScopes(requirements.scopes);
      } else {
        return access.hasAnyScope(requirements.scopes);
      }
    }

    return true;
  };

  return {
    hasPermission: meetsRequirements(),
    user: access.user,
    access,
  };
}

// Hook for conditional rendering based on permissions
export function useConditionalRender(
  condition: (access: ReturnType<typeof useAccess>) => boolean,
  fallback?: React.ReactNode
) {
  const access = useAccess();
  const shouldRender = condition(access);
  
  return {
    shouldRender,
    access,
    fallback: shouldRender ? null : fallback,
  };
}

// HOC for wrapping components with access control
export function withAccess<P extends object>(
  Component: React.ComponentType<P>,
  requirements: Parameters<typeof usePermissionCheck>[0],
  fallback?: React.ReactNode
) {
  const WrappedComponent = (props: P) => {
    const { hasPermission } = usePermissionCheck(requirements);
    
    if (!hasPermission) {
      return fallback || null;
    }
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withAccess(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}