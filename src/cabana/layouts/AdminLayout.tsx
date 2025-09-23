import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0b0b1a,#111225)", color: "#fff" }}>
      <header style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(14px)" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/cabana" style={{ color: "#fff", textDecoration: "none" }}>Cabana</Link>
          <Link to="/cabana/admin" style={{ color: "#fff", textDecoration: "none" }}>Admin</Link>
        </nav>
      </header>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

