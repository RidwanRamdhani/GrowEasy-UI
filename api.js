import { useState } from "react";
import RiskBadge from "./RiskBadge";
import ScoreRing from "./ScoreRing";
import { formatCropName } from "../services/parseResults";

export default function HistoryCard({ item, showChat = true }) {
  const [open, setOpen] = useState(false);

  // item is a parseAnalysis() result
  const top3 = item.top3 ?? [];

  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div onClick={() => setOpen(!open)} style={{ padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <ScoreRing score={item.cropScore} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>{item.locationName}</span>
            <RiskBadge level={item.riskLevel} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            {item.date} · pH {item.ph} · {item.temperature}°C · {item.humidity}% humidity
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0 }}>▾</span>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", animation: "fadeUp .3s ease" }}>
          {/* Top-3 predictions */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 10, letterSpacing: ".08em" }}>ML TOP-3 PREDICTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {top3.map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: i === 0 ? "var(--green-bright)" : "var(--text-muted)", width: 20, flexShrink: 0 }}>#{i+1}</span>
                  <div style={{ flex: 1, height: 5, background: "var(--surface)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.prob}%`, background: i === 0 ? "linear-gradient(90deg,#3d6b20,#7aab44)" : "var(--border)", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: i === 0 ? "var(--green-bright)" : "var(--text-dim)", width: 130, textAlign: "right" }}>
                    🌱 {c.name} ({c.prob}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8, marginBottom: 14 }}>
            {[
              ["pH",        item.ph,          ""],
              ["Nitrogen",  item.nitrogen,     " kg/ha"],
              ["Temp",      item.temperature,  "°C"],
              ["Humidity",  item.humidity,     "%"],
              ["Rainfall",  item.rainfall,     " mm/d"],
              ["Confidence",item.probability,  "%"],
            ].map(([l, v, u]) => (
              <div key={l} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginBottom: 4, letterSpacing: ".06em" }}>{l.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--green-bright)" }}>{v}{u}</div>
              </div>
            ))}
          </div>

          {/* Gemini AI summary */}
          {item.aiResponse && (
            <div style={{ background: "rgba(61,107,32,.08)", borderRadius: 8, padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.72, marginBottom: showChat ? 14 : 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>🤖 GEMINI AI SUMMARY</span>
              {item.aiResponse}
            </div>
          )}

          {/* Locked chat notice */}
          {showChat && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(138,106,16,.09)", border: "1px solid rgba(212,168,42,.22)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber-dim)" }}>
              🔒 This session has ended. Run a new analysis to start a fresh chat.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
