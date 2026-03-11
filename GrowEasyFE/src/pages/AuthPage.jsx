import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode, onNav }) {
  const { login, register } = useAuth();
  const [tab,     setTab]     = useState(mode);
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Password rules (register only)
  const PW_MIN = 8;
  const pwLen       = form.password.length;
  const pwHasUpper  = /[A-Z]/.test(form.password);
  const pwHasDigit  = /[0-9]/.test(form.password);
  const pwOk        = pwLen >= PW_MIN;
  const showPwHints = tab === "register" && form.password.length > 0;

  const handleSubmit = async () => {
    setError("");

    // Client-side validation before hitting the API
    if (tab === "register") {
      if (!form.name.trim()) { setError("Please enter your full name."); return; }
      if (!form.email.trim()) { setError("Please enter your email address."); return; }
      if (!pwOk) {
        setError(`Password must be at least ${PW_MIN} characters long.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      onNav("dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 70% at 30% 50%,rgba(61,107,32,.12),transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(24px,4vw,40px)", animation: "fadeUp .5s ease both", position: "relative", zIndex: 5 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Grow<span style={{ color: "var(--green)" }}>Easy</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Food Security Intelligence Platform</div>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".05em", background: tab === t ? "rgba(122,171,68,.15)" : "transparent", color: tab === t ? "var(--green-bright)" : "var(--text-muted)", transition: "all .2s" }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(196,90,58,.1)", border: "1px solid rgba(196,90,58,.3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "#e07050" }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "register" && (
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Farmer" />
            </div>
          )}
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>EMAIL</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@farm.com"
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ borderColor: showPwHints && !pwOk ? "rgba(196,90,58,.5)" : undefined }}
            />
            {/* Strength bar + hints — only shown during registration while typing */}
            {showPwHints && (
              <div style={{ marginTop: 8 }}>
                {/* Bar */}
                <div style={{ height: 3, borderRadius: 2, background: "var(--surface2)", marginBottom: 7, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width .3s, background .3s",
                    width: pwLen === 0 ? "0%" : pwLen < PW_MIN ? `${Math.min(80, (pwLen / PW_MIN) * 80)}%` : pwHasUpper && pwHasDigit ? "100%" : "75%",
                    background: pwLen < PW_MIN ? "#c45a3a" : pwHasUpper && pwHasDigit ? "#7aab44" : "#d4a82a",
                  }} />
                </div>
                {/* Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    [pwOk,       `At least ${PW_MIN} characters`],
                    [pwHasUpper, "One uppercase letter (recommended)"],
                    [pwHasDigit, "One number (recommended)"],
                  ].map(([ok, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: ok ? "#7aab44" : "var(--text-muted)" }}>
                      <span>{ok ? "✓" : "·"}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: 6, padding: 13, borderRadius: 8, border: "none", background: loading ? "var(--surface2)" : "linear-gradient(135deg,#7aab44,#3d6b20)", color: loading ? "var(--text-muted)" : "#fff", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}
          >
            {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {tab === "login" ? "No account yet? " : "Already have one? "}
          <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
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
