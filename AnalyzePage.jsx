import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HistoryCard from "../components/HistoryCard";
import { getHistory } from "../services/api";
import { parseAnalysis } from "../services/parseResults";

export default function HistoryPage({ onNav }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    getHistory()
      .then(res => setItems((res.data ?? []).map(parseAnalysis)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="shell">
      <Sidebar active="history" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>HISTORY</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 24 }}>
            Previous Analyses
          </h1>

          {loading && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>
              Loading history…
            </div>
          )}

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(196,90,58,.1)", border: "1px solid rgba(196,90,58,.3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "#e07050", marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No analyses yet</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-dim)", marginBottom: 24 }}>Run your first land analysis to see results here.</div>
              <button onClick={() => onNav("analyze")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>
                ⚡ Start Analyze
              </button>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(420px,1fr))", gap: 14 }}>
              {items.map(item => (
                <HistoryCard key={item.id} item={item} showChat />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
