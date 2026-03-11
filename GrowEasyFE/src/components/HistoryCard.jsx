import RiskBadge from "./RiskBadge";
import ScoreRing from "./ScoreRing";

// ── Markdown renderer ─────────────────────────────────────────────────────────
function inlineParse(raw) {
  return raw.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((chunk, j) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk))
      return <strong key={j} style={{ color: "var(--text)", fontWeight: 700 }}>{chunk.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(chunk))
      return <em key={j} style={{ color: "var(--text-dim)" }}>{chunk.slice(1, -1)}</em>;
    return chunk;
  });
}

function FormattedText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) { elements.push(<div key={i} style={{ height: 6 }} />); i++; continue; }
    if (/^###\s+/.test(trimmed)) {
      elements.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--green-bright)", letterSpacing: ".04em", marginTop: 10, marginBottom: 2 }}>{inlineParse(trimmed.replace(/^###\s+/, ""))}</div>);
      i++; continue;
    }
    if (/^##\s+/.test(trimmed)) {
      elements.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "var(--green)", letterSpacing: ".03em", marginTop: 12, marginBottom: 3 }}>{inlineParse(trimmed.replace(/^##\s+/, ""))}</div>);
      i++; continue;
    }
    if (/^#\s+/.test(trimmed)) {
      elements.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "var(--green)", letterSpacing: ".02em", marginTop: 14, marginBottom: 4 }}>{inlineParse(trimmed.replace(/^#\s+/, ""))}</div>);
      i++; continue;
    }
    if (/^[-*•]\s+/.test(trimmed)) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ color: "var(--green)", flexShrink: 0, marginTop: 3, fontSize: 12 }}>▸</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.75, color: "var(--text-dim)" }}>{inlineParse(trimmed.replace(/^[-*•]\s+/, ""))}</span>
        </div>
      );
      i++; continue;
    }
    elements.push(<p key={i} style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.8, color: "var(--text-dim)" }}>{inlineParse(trimmed)}</p>);
    i++;
  }
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{elements}</div>;
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.is_user;
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={{
        maxWidth: "82%",
        padding: "9px 13px",
        borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        background: isUser ? "rgba(122,171,68,.13)" : "var(--surface)",
        border: `1px solid ${isUser ? "rgba(122,171,68,.28)" : "var(--border)"}`,
        fontFamily: "var(--font-body)",
        fontSize: 13,
        color: "var(--text-dim)",
        lineHeight: 1.6,
      }}>
        {isUser ? msg.message : <FormattedText text={msg.message} />}
      </div>
    </div>
  );
}

// ── One session block ─────────────────────────────────────────────────────────
function ChatSessionBlock({ session, index, total }) {
  const { sessionId, messages, firstAt } = session;
  const shortId = sessionId.slice(0, 8).toUpperCase();
  const date    = firstAt ? new Date(firstAt).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }) : "";
  const totalMsgs = messages.length;

  return (
    <div style={{ borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
      {/* Session header */}
      <div style={{
        padding: "8px 12px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
      }}>
        {/* Coloured dot + session label */}
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0, display: "inline-block", opacity: 0.7 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", letterSpacing: ".08em", fontWeight: 600 }}>
          SESSION {index + 1} / {total}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: "var(--text-muted)", background: "var(--surface2)",
          border: "1px solid var(--border)", borderRadius: 4,
          padding: "1px 6px", letterSpacing: ".04em",
        }}>
          #{shortId}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>
          {date} · {totalMsgs} msg{totalMsgs !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Messages — scrollable */}
      <div style={{
        padding: 10,
        display: "flex", flexDirection: "column", gap: 8,
        maxHeight: 260, overflowY: "auto",
        background: "var(--surface2)",
      }}>
        {messages.map(msg => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
export default function HistoryCard({ item, isOpen, onToggle }) {
  const top3         = item.top3         ?? [];
  const chatMessages = item.chatMessages ?? [];   // flat list already scoped to this analysis
  const totalMsgs    = chatMessages.length;

  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12 }}>

      {/* ── Header ── */}
      <div onClick={onToggle} style={{ padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <ScoreRing score={item.cropScore} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>{item.locationName}</span>
            <RiskBadge level={item.riskLevel} />
            {totalMsgs > 0 && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "1px 8px" }}>
                💬 {totalMsgs} msg{totalMsgs !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            {item.date} · pH {item.ph} · {item.temperature}°C · {item.humidity}% humidity
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0 }}>▾</span>
      </div>

      {/* ── Expanded body ── */}
      {isOpen && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,20px)", animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Top-3 */}
          <div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8 }}>
            {[
              ["pH",         item.ph,          ""],
              ["Nitrogen",   item.nitrogen,     " kg/ha"],
              ["Temp",       item.temperature,  "°C"],
              ["Humidity",   item.humidity,     "%"],
              ["Rainfall",   item.rainfall,     " mm/d"],
              ["Confidence", item.probability,  "%"],
            ].map(([l, v, u]) => (
              <div key={l} style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginBottom: 4, letterSpacing: ".06em" }}>{l.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--green-bright)" }}>{v}{u}</div>
              </div>
            ))}
          </div>

          {/* Gemini AI summary */}
          {item.aiResponse && (
            <div style={{ background: "rgba(61,107,32,.08)", borderRadius: 8, padding: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>🤖 GEMINI AI SUMMARY</span>
              <div style={{ maxHeight: 220, overflowY: "auto", paddingRight: 6 }}>
                <FormattedText text={item.aiResponse} />
              </div>
            </div>
          )}

          {/* ── Chat history — one block per session ── */}
          <div style={{ borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>

            {/* Section header */}
            <div style={{ padding: "10px 14px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".08em" }}>💬 CHAT HISTORY</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>
                {totalMsgs > 0 ? `${totalMsgs} message${totalMsgs !== 1 ? "s" : ""}` : "No messages"}
              </span>
            </div>

            {/* Messages */}
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", background: "var(--surface2)" }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                  No chat messages for this analysis.
                </div>
              ) : (
                chatMessages.map(msg => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "8px 14px", background: "var(--surface)", borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber-dim)" }}>
              🔒 Session ended · Start a new analysis to chat again
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
