export default function SignIn() {
  return (
    <section style={{ maxWidth: 420 }}>
      <h1>Sign in</h1>
      <div style={{
        display: "grid",
        gap: 12,
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(18px)",
      }}>
        <input placeholder="Email" style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", color: "#fff" }} />
        <input placeholder="Password" type="password" style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", color: "#fff" }} />
        <button style={{ padding: "10px 14px", borderRadius: 10, color: "#fff", background: "linear-gradient(135deg,#6D28D9,#F43F5E)", border: 0 }}>Sign in</button>
      </div>
    </section>
  );
}

