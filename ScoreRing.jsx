import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HistoryCard from "../components/HistoryCard";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../services/api";
import { parseAnalysis } from "../services/parseResults";

export default function DashboardPage({ onNav }) {
  const { user } = useAuth();
  const [latest,  setLatest]  = useState(null);
  const [stats,   setStats]   = useState({ total: 0, bestScore: "—", crops: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(res => {
        const items = (res.data ?? []).map(parseAnalysis);
        if (items.length) {
          setLatest(items[0]);
          const bestScore = Math.max(...items.map(i => i.cropScore));
          const crops = new Set(items.flatMap(i => i.top3.map(t => t.name))).size;
          setStats({ total: items.length, bestScore, crops });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="shell">
      <Sidebar active="dashboard" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>WELCOME BACK</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-.03em" }}>
              Hello, {user?.name ?? "Farmer"} 👋
            </h1>
          </div>

          {/* CTA */}
          <div style={{ borderRadius: 16, padding: "clamp(20px,4vw,36px)", marginBottom: "clamp(16px,2.5vw,28px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,rgba(61,107,32,.4) 0%,rgba(19,23,16,.85) 100%)", border: "1px solid rgba(122,171,68,.3)" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(122,171,68,.04)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", letterSpacing: ".1em", marginBottom: 10 }}>◉ GPS LAND ANALYSIS</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,2.5vw,26px)", fontWeight: 700, marginBottom: 8 }}>Start a New Analysis</h2>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-dim)", fontSize: "clamp(13px,1.4vw,15px)", marginBottom: 22, maxWidth: 500, lineHeight: 1.72 }}>
                Enable GPS to fetch real soil &amp; weather data, then get ML-powered crop recommendations with a Gemini AI explanation.
              </p>
              <button onClick={() => onNav("analyze")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                ⚡ Start Analyze
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: "Total Analyses",  value: stats.total,     icon: "📊", sub: "Since joining" },
              { label: "Best Score",      value: stats.bestScore, icon: "🏆", sub: "Food security" },
              { label: "Crops Predicted", value: stats.crops,     icon: "🌾", sub: "Unique varieties" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "clamp(16px,2.5vw,24px)" }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: "var(--green-bright)" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Latest analysis */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "clamp(16px,2.5vw,24px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700 }}>Latest Analysis</h3>
              <button onClick={() => onNav("history")} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", background: "none", border: "none" }}>View All →</button>
            </div>
            {loading && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>Loading…</div>}
            {!loading && !latest && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>No analyses yet. Run your first one! ⚡</div>}
            {!loading && latest && <HistoryCard item={latest} showChat={false} />}
          </div>

        </div>
      </div>
    </div>
  );
}
