import { useState } from "react"; // Kritis: useState harus diimport
import ScoreRing from "./ScoreRing"; // Import komponen pendukung
import RiskBadge from "./RiskBadge"; // Import komponen pendukung

export default function HistoryCard({ item, showChat = true }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <ScoreRing score={item.cropScore} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>{item.location}</span>
            <RiskBadge level={item.riskLevel} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            #{item.id} · {item.date} · pH {item.soilPH} · Moisture {item.moisture}%
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0 }}>▾</span>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", animation: "fadeUp .3s ease" }}>
          {/* Crops */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 8, letterSpacing: ".08em" }}>RECOMMENDED CROPS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {item.recommendation.split(", ").map(c => (
                <span key={c} style={{ padding: "4px 12px", borderRadius: 20, fontFamily: "var(--font-mono)", fontSize: 11, background: "rgba(122,171,68,.1)", border: "1px solid rgba(122,171,68,.22)", color: "var(--green-bright)" }}>🌱 {c}</span>
              ))}
            </div>
          </div>
          {/* AI summary */}
          <div style={{ background: "rgba(61,107,32,.08)", borderRadius: 8, padding: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.72, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", letterSpacing: ".08em", display: "block", marginBottom: 6 }}>AI SUMMARY</span>
            {item.aiSummary}
          </div>
          {/* Chat history */}
          {showChat && item.chat.length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 8, letterSpacing: ".08em" }}>CHAT HISTORY ({item.chat.length} messages)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {item.chat.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                    <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role==="user"?"10px 10px 2px 10px":"10px 10px 10px 2px", background: m.role==="user"?"rgba(122,171,68,.1)":"var(--surface)", border: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>{m.content}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(138,106,16,.09)", border: "1px solid rgba(212,168,42,.22)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber-dim)" }}>
                🔒 This chat session has ended. Start a new analysis to continue.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}