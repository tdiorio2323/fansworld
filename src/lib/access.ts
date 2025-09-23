// Enhanced access control system inspired by OFFICIALAUTH-CABANA
// Lightweight access model with role-based and scope-based permissions

export type Role = "guest" | "member" | "admin" | "creator" | "brand";

export type Scope =
  | "VIP_WAITLIST" // VIP waitlist access
  | "DISPENSARY" // 21+ area: shop, brands, cart, etc.
  | "INTERNAL" // internal setup/docs
  | "STUDIO" // public/portfolio area
  | "AGENCY" // agency services
  | "CABANA_VIP" // VIP features and content
  | "CODE_SITE" // development resources
  | "DOWNLOADS" // downloadable resources
  | "MESSAGING" // messaging and communications
  | "BRAND" // brand management
  | "CUSTOMER" // customer features
  | "ADMIN" // administrative functions
  | "ANALYTICS" // analytics and insights
  | "CREATOR_TOOLS"; // creator-specific tools

export type User = {
  id: string;
  email?: string;
  role: Role;
  scopes: Scope[];
  metadata?: Record<string, any>;
  tier?: "basic" | "premium" | "enterprise";
  vipStatus?: "none" | "waitlisted" | "invited" | "active";
};

const KEY = "cabana_user_access_v1";

// Reactive store via subscribe/emit + in-memory snapshot for referential stability
type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readFromStorage(): User {
  if (typeof window === "undefined") {
    return { id: "anon", role: "guest", scopes: [], vipStatus: "none" };
  }
  
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const user = JSON.parse(raw) as User;
      // Ensure vipStatus exists for backward compatibility
      if (!user.vipStatus) {
        user.vipStatus = "none";
      }
      return user;
    }
  } catch (error) {
    console.warn("Failed to read user from storage:", error);
  }
  return { id: "anon", role: "guest", scopes: [], vipStatus: "none" };
}

let currentUser: User = { id: "anon", role: "guest", scopes: [], vipStatus: "none" };

// Initialize only on client side
if (typeof window !== "undefined") {
  currentUser = readFromStorage();
}

export function getUser(): User {
  return currentUser;
}

export function saveUser(user: Partial<User>) {
  const id = user.id && user.id !== "anon" ? user.id : `u_${Math.random().toString(36).slice(2, 10)}`;
  
  currentUser = { 
    ...currentUser,
    ...user,
    id,
    vipStatus: user.vipStatus || currentUser.vipStatus || "none"
  };
  
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(currentUser));
  }
  
  emit();
}

export function clearUser() {
  currentUser = { id: "anon", role: "guest", scopes: [], vipStatus: "none" };
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
  emit();
}

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      currentUser = readFromStorage();
      emit();
    }
  });
}

// Permission checking functions
export function hasRole(requiredRole: Role, user: User = getUser()): boolean {
  if (user.role === "admin") return true;
  return user.role === requiredRole;
}

export function hasScope(scope: Scope, user: User = getUser()): boolean {
  if (user.role === "admin") return true;
  return user.scopes.includes(scope);
}

export function hasAnyScope(scopes: Scope[], user: User = getUser()): boolean {
  if (user.role === "admin") return true;
  return scopes.some((s) => user.scopes.includes(s));
}

export function hasAllScopes(scopes: Scope[], user: User = getUser()): boolean {
  if (user.role === "admin") return true;
  return scopes.every((s) => user.scopes.includes(s));
}

// Role-based scope assignment
export function getScopesForRole(role: Role): Scope[] {
  switch (role) {
    case "admin":
      return [
        "AGENCY", "MESSAGING", "CODE_SITE", "DOWNLOADS", "INTERNAL", 
        "DISPENSARY", "CABANA_VIP", "BRAND", "CUSTOMER", "ADMIN",
        "ANALYTICS", "CREATOR_TOOLS", "VIP_WAITLIST"
      ];
    case "creator":
      return ["CABANA_VIP", "CODE_SITE", "DOWNLOADS", "CREATOR_TOOLS", "ANALYTICS"];
    case "brand":
      return ["BRAND", "ANALYTICS", "MESSAGING"];
    case "member":
      return ["CUSTOMER", "MESSAGING"];
    case "guest":
    default:
      return [];
  }
}

// Scope management
export function grantScopes(scopes: Scope[], user: User = getUser()) {
  const newScopes = Array.from(new Set([...(user.scopes ?? []), ...scopes]));
  const updatedRole = user.role === "guest" ? "member" : user.role;
  
  saveUser({ 
    ...user, 
    scopes: newScopes, 
    role: updatedRole 
  });
}

export function revokeScopes(scopes: Scope[], user: User = getUser()) {
  const newScopes = (user.scopes ?? []).filter((s) => !scopes.includes(s));
  
  saveUser({ 
    ...user, 
    scopes: newScopes 
  });
}

export function upgradeRole(newRole: Role, user: User = getUser()) {
  const roleHierarchy: Record<Role, number> = {
    "guest": 0,
    "member": 1,
    "creator": 2,
    "brand": 2,
    "admin": 3
  };

  if (roleHierarchy[newRole] > roleHierarchy[user.role]) {
    const additionalScopes = getScopesForRole(newRole);
    const newScopes = Array.from(new Set([...(user.scopes ?? []), ...additionalScopes]));
    
    saveUser({
      ...user,
      role: newRole,
      scopes: newScopes
    });
  }
}

// VIP-specific functions
export function isVipUser(user: User = getUser()): boolean {
  return user.vipStatus === "active" || hasScope("CABANA_VIP", user);
}

export function isVipWaitlisted(user: User = getUser()): boolean {
  return user.vipStatus === "waitlisted";
}

export function updateVipStatus(status: User["vipStatus"], user: User = getUser()) {
  saveUser({ ...user, vipStatus: status });
  
  // Grant VIP scopes when user becomes active
  if (status === "active") {
    grantScopes(["CABANA_VIP", "CREATOR_TOOLS"], user);
  }
}

// Tier checking
export function hasTier(requiredTier: "basic" | "premium" | "enterprise", user: User = getUser()): boolean {
  const tierHierarchy = { "basic": 1, "premium": 2, "enterprise": 3 };
  const userTier = user.tier || "basic";
  
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}

// React hook for reactive access control
export function useUser() {
  const [user, setUser] = React.useState(getUser);
  
  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setUser(getUser());
    });
    return unsubscribe;
  }, []);
  
  return user;
}

// For environments without React
declare global {
  var React: any;
}

if (typeof React === "undefined") {
  (globalThis as any).React = { useState: () => [null, () => {}], useEffect: () => {} };
}