import { Link, Outlet, NavLink } from "react-router-dom";

export default function PublicLayout() {
  const nav = [
    { to: ".", label: "Home", end: true },
    { to: "discover", label: "Discover" },
    { to: "feed", label: "Feed" },
    { to: "pricing", label: "Pricing" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg,#0b0b1a,#111225)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 10, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(14px) saturate(1.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
          <Link to="/cabana" style={{ textDecoration: "none", color: "#fff", fontWeight: 700 }}>CABANA</Link>
          <nav style={{ display: "flex", gap: 12 }}>
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end as any} style={({ isActive }) => ({
                color: "#fff",
                textDecoration: "none",
                padding: "6px 10px",
                borderRadius: 999,
                background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
              })}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <Link to="signin" style={{ color: "#fff" }}>Sign in</Link>
            <Link to="register" style={{ color: "#fff", padding: "6px 10px", borderRadius: 10, background: "linear-gradient(135deg,#6D28D9,#F43F5E)" }}>Create account</Link>
          </div>
        </div>
      </header>
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: 24, color: "#fff" }}>
        <Outlet />
      </main>
      <footer style={{ padding: 16, textAlign: "center", color: "#9aa3b2" }}>
        © {new Date().getFullYear()} Cabana
      </footer>
    </div>
  );
}

