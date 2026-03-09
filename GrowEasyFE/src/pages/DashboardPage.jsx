import Sidebar from "../components/Sidebar";
import HistoryCard from "../components/HistoryCard"; 
import { HISTORY } from "../MockData";

export default function DashboardPage({ onNav }) {
  return (
    <div className="shell">
      <Sidebar active="dashboard" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>WELCOME BACK</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 800, letterSpacing: "-.03em" }}>Hello, John 👋</h1>
          </div>

          {/* CTA card */}
          <div style={{ borderRadius: 16, padding: "clamp(20px,4vw,32px)", marginBottom: "clamp(16px,2.5vw,24px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(77, 179, 61, 0.2) 0%, rgba(255, 255, 255, 1) 100%)", border: "1px solid var(--border)",boxShadow: "0 10px 30px rgba(77, 179, 61, 0.08)" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(122,171,68,.04)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", letterSpacing: ".1em", marginBottom: 10 }}>◉ GPS LAND ANALYSIS</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,2.5vw,22px)", fontWeight: 700, marginBottom: 8 }}>Start a New Analysis</h2>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-dim)", fontSize: "clamp(13px,1.4vw,14px)", marginBottom: 20, maxWidth: 440, lineHeight: 1.72 }}>
                Enable GPS to analyze soil conditions, weather patterns, and get AI-powered crop recommendations for your land.
              </p>
              <button onClick={() => onNav("analyze")} style={{ padding: "12px 28px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                ⚡ Start Analyze
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: "Total Analyses",  value: "2",  icon: "📊", sub: "Since joining" },
              { label: "Best Score",      value: "82", icon: "🏆", sub: "Low Risk" },
              { label: "Crops Suggested", value: "4",  icon: "🌾", sub: "Unique varieties" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "clamp(14px,2.5vw,20px)" }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "var(--green-bright)" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "clamp(16px,2.5vw,24px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Latest Analysis</h3>
              <button onClick={() => onNav("history")} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", background: "none", border: "none" }}>View All →</button>
            </div>
            <HistoryCard item={HISTORY[0]} showChat={false} />
          </div>
        </div>
      </div>
    </div>
  );
}