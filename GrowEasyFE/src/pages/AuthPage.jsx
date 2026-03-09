import { useState } from "react";

export default function AuthPage({ mode, onNav }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="auth-wrap" style={{ position: "relative", background: "var(--bg)" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 70% at 30% 50%, rgba(61,107,32,.12), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(24px,4vw,40px)", animation: "fadeUp .5s ease both", position: "relative", zIndex: 5 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Grow<span style={{ color: "var(--green)" }}>Easy</span></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Food Security Intelligence Platform</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".05em", background: tab===t ? "rgba(122,171,68,.15)" : "transparent", color: tab===t ? "var(--green-bright)" : "var(--text-muted)", transition: "all .2s" }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "register" && (
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Farmer" />
            </div>
          )}
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>EMAIL</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@farm.com" />
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button onClick={() => onNav("dashboard")} style={{ marginTop: 6, padding: 13, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>
            {tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {tab === "login" ? "No account yet? " : "Already have one? "}
          <button onClick={() => setTab(tab==="login"?"register":"login")} style={{ background: "none", border: "none", color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            {tab === "login" ? "Register" : "Sign In"}
          </button>
        </p>
        <button onClick={() => onNav("landing")} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          ← Back to home
        </button>
      </div>
    </div>
  );
}