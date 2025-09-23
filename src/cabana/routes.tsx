import React, { Suspense, lazy, ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy helpers
const Load = (C: any) => (
  <Suspense fallback={null}>
    <C />
  </Suspense>
);
const lazyPage = (p: string) => lazy(() => import(`./pages/${p}`));

// Fake auth guards (replace with real one if needed)
const useAuth = () => ({ authed: false, role: "user" as "user" | "admin" });
function RequireAuth({ children }: { children: ReactNode }) {
  const { authed } = useAuth();
  return authed ? <>{children}</> : <Navigate to="/cabana/signin" replace />;
}
function RequireAdmin({ children }: { children: ReactNode }) {
  const { authed, role } = useAuth();
  return authed && role === "admin" ? <>{children}</> : <Navigate to="/cabana/signin" replace />;
}

// Layouts
const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const CreatorLayout = lazy(() => import("./layouts/CreatorLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// Simple helper
const route = (path: string, file: string) => ({ path, element: Load(lazyPage(file)) });

// 404
const NotFound = lazyPage("errors/404");

export function CabanaRoutes() {
  return (
    <Routes>
      {/* Public area under /cabana */}
      <Route element={Load(PublicLayout)}>
        {/** index -> /cabana */}
        <Route index element={Load(lazyPage("home/HomePage"))} />

        {/* Public marketing/info */}
        <Route {...route("about", "public/about")} />
        <Route {...route("features", "public/features")} />
        <Route {...route("pricing", "public/pricing")} />
        <Route {...route("creators", "public/creators")} />

        {/* Discover & feed */}
        <Route {...route("discover", "discover/index")} />
        <Route {...route("feed", "feed/index")} />

        {/* Payments */}
        <Route {...route("subscription-plans", "payments/plans")} />
        <Route {...route("payment-success", "payments/success")} />
        <Route {...route("payment-failed", "payments/failure")} />

        {/* Auth */}
        <Route {...route("signin", "auth/signin")} />
        <Route {...route("register", "auth/register")} />
      </Route>

      {/* User area */}
      <Route element={<RequireAuth>{Load(UserLayout)}</RequireAuth>}>
        <Route {...route("user", "user/home")} />
      </Route>

      {/* Creator area */}
      <Route element={<RequireAuth>{Load(CreatorLayout)}</RequireAuth>}>
        <Route {...route("creator/dashboard", "creator/dashboard/index")} />
      </Route>

      {/* Admin area */}
      <Route element={<RequireAdmin>{Load(AdminLayout)}</RequireAdmin>}>
        <Route {...route("admin", "admin/dashboard")} />
      </Route>

      {/* 404 fallback scoped to /cabana */}
      <Route path="*" element={Load(NotFound)} />
    </Routes>
  );
}

