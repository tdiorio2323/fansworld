export default function HomePage() {
  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
        padding: 24,
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(18px) saturate(1.2)",
        boxShadow: "0 22px 68px rgba(0,0,0,.55), 0 6px 20px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Welcome to Cabana</h1>
        <p style={{ margin: 0, color: "#9aa3b2" }}>A modern creator platform — demo shell.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <a href="/cabana/discover" style={{ color: "#fff", textDecoration: "none", padding: "10px 14px", borderRadius: 10, background: "linear-gradient(135deg,#6D28D9,#F43F5E)" }}>Discover</a>
          <a href="/cabana/signin" style={{ color: "#fff", textDecoration: "none", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>Sign in</a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {[
          "Feed",
          "Creators",
          "Messages",
          "Subscriptions",
          "Analytics",
          "Settings",
        ].map((t) => (
          <div key={t} style={{
            display: "grid",
            placeItems: "center",
            height: 140,
            borderRadius: 16,
            color: "#fff",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          }}>
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

