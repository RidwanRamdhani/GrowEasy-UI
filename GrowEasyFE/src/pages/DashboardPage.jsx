import { useState, useEffect, useRef } from "react";
import Sidebar    from "../components/Sidebar";
import RiskBadge  from "../components/RiskBadge";
import ScoreRing  from "../components/ScoreRing";
import { useAuth } from "../context/AuthContext";
import { getHistory, getChatHistory, sendChat } from "../services/api";
import { parseAnalysis } from "../services/parseResults";

// ── Markdown renderer (same as AnalyzePage) ──────────────────────────────────
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
  const els = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (!t) { els.push(<div key={i} style={{ height: 6 }} />); i++; continue; }
    if (/^###\s+/.test(t)) { els.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--green-bright)", marginTop: 10, marginBottom: 2 }}>{inlineParse(t.replace(/^###\s+/, ""))}</div>); i++; continue; }
    if (/^##\s+/.test(t))  { els.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "var(--green)", marginTop: 12, marginBottom: 3 }}>{inlineParse(t.replace(/^##\s+/, ""))}</div>); i++; continue; }
    if (/^#\s+/.test(t))   { els.push(<div key={i} style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "var(--green)", marginTop: 14, marginBottom: 4 }}>{inlineParse(t.replace(/^#\s+/, ""))}</div>); i++; continue; }
    if (/^[-*•]\s+/.test(t)) {
      els.push(<div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ color: "var(--green)", flexShrink: 0, marginTop: 3 }}>▸</span><span style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.75, color: "var(--text-dim)" }}>{inlineParse(t.replace(/^[-*•]\s+/, ""))}</span></div>);
      i++; continue;
    }
    els.push(<p key={i} style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.8, color: "var(--text-dim)" }}>{inlineParse(t)}</p>);
    i++;
  }
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{els}</div>;
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user" || msg.is_user;
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: isUser ? "rgba(122,171,68,.15)" : "var(--surface2)", border: `1px solid ${isUser ? "rgba(122,171,68,.3)" : "var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
        {isUser ? (msg.content ?? msg.message) : <FormattedText text={msg.content ?? msg.message} />}
      </div>
    </div>
  );
}

// ── Latest Analysis Panel ────────────────────────────────────────────────────
function LatestAnalysisPanel({ latest, chatHistory, onNav }) {
  const [chat,   setChat]   = useState(() => chatHistory.map(m => ({ role: m.is_user ? "user" : "ai", content: m.message, id: m.id })));
  const [input,  setInput]  = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    setChat(prev => [...prev, { role: "user", content: msg }]);
    setTyping(true);
    try {
      const res = await sendChat(msg);
      setChat(prev => [...prev, { role: "ai", content: res.response }]);
    } catch (e) {
      setChat(prev => [...prev, { role: "ai", content: `Error: ${e.message}` }]);
    } finally {
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  };

  const top3 = latest.top3 ?? [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, height: 560 }}>

      {/* ── Left: results ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "clamp(14px,2.5vw,22px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          <ScoreRing score={latest.cropScore} size={70} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>{latest.locationName}</span>
              <RiskBadge level={latest.riskLevel} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
              {latest.date} · pH {latest.ph} · {latest.temperature}°C · {latest.humidity}%
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, paddingRight: 4, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[["pH", latest.ph, ""], ["Nitrogen", latest.nitrogen, " g/kg"], ["Temp", latest.temperature, "°C"], ["Humidity", latest.humidity, "%"], ["Rainfall", latest.rainfall, " mm/d"], ["Confidence", latest.probability, "%"]].map(([l, v, u]) => (
              <div key={l} style={{ background: "var(--surface2)", borderRadius: 8, padding: "9px 11px", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginBottom: 4, letterSpacing: ".06em" }}>{l.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--green-bright)" }}>{v}{u}</div>
              </div>
            ))}
          </div>

          {/* Top-3 */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 8, letterSpacing: ".08em" }}>ML TOP-3 PREDICTIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {top3.map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: i === 0 ? "var(--green-bright)" : "var(--text-muted)", width: 20, flexShrink: 0 }}>#{i+1}</span>
                  <div style={{ flex: 1, height: 5, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.prob}%`, background: i === 0 ? "linear-gradient(90deg,#3d6b20,#7aab44)" : "var(--border)", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: i === 0 ? "var(--green-bright)" : "var(--text-dim)", width: 130, textAlign: "right" }}>
                    🌱 {c.name} ({c.prob}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI summary */}
          {latest.aiResponse && (
            <div style={{ background: "rgba(61,107,32,.08)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)", letterSpacing: ".08em", marginBottom: 8 }}>🤖 GEMINI AI SUMMARY</div>
              <div style={{ maxHeight: 160, overflowY: "auto", paddingRight: 4 }}>
                <FormattedText text={latest.aiResponse} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Gemini chat ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "clamp(14px,2.5vw,22px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "blink 1.5s infinite" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Chat with Gemini AI</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>Latest session</span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {chat.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
              No chat yet for this analysis.
            </div>
          )}
          {chat.map((m, i) => <ChatBubble key={m.id ?? i} msg={m} />)}
          {typing && (
            <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>
              {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: `dot-pulse 1.4s ease-in-out infinite ${j*.16}s` }} />)}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask Gemini about your land…"
            style={{ flex: 1, minWidth: 0, marginTop: 0 }}
          />
          <button onClick={send} style={{ padding: "11px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, flexShrink: 0 }}>
            Send
          </button>
        </div>
      </div>

    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage({ onNav }) {
  const { user } = useAuth();
  const [latest,      setLatest]      = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [stats,       setStats]       = useState({ total: 0, bestScore: "—", crops: 0 });
  const [loading,     setLoading]     = useState(true);
  const [open,        setOpen]        = useState(false);

  useEffect(() => {
    Promise.all([getHistory(), getChatHistory(true)])
      .then(([histRes, chatRes]) => {
        const rawAnalyses = histRes.data ?? [];
        const items       = rawAnalyses.map(parseAnalysis);
        if (!items.length) return;

        const bestScore = Math.max(...items.map(i => i.cropScore));
        const crops     = new Set(items.flatMap(i => i.top3.map(t => t.name))).size;
        setStats({ total: items.length, bestScore, crops });

        const latestParsed = items[0];
        setLatest(latestParsed);

        // ── Assign chat messages to latest analysis by time window ──
        const allMessages = Object.values(chatRes.data ?? {})
          .flat()
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // Sort analyses oldest→newest to build windows
        const sortedRaw = [...rawAnalyses]
          .map((r, i) => ({ parsed: items[i], t: new Date(r.created_at).getTime() }))
          .sort((a, b) => a.t - b.t);

        // Window for latest analysis = [latestAnalysis.created_at, +Infinity)
        const latestRaw   = sortedRaw[sortedRaw.length - 1];
        const windowStart = latestRaw.t;

        const latestMsgs = allMessages.filter(m =>
          new Date(m.created_at).getTime() >= windowStart
        );
        setChatHistory(latestMsgs);
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
          <div style={{ borderRadius: 16, padding: "clamp(20px,4vw,32px)", marginBottom: "clamp(16px,2.5vw,24px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(77,179,61,0.2) 0%, rgba(255,255,255,1) 100%)", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(77,179,61,0.08)" }}>
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

          {/* Latest analysis — collapsible */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>

            {/* Header — always visible, click to toggle */}
            <div
              onClick={() => !loading && latest && setOpen(o => !o)}
              style={{ padding: "clamp(14px,2.5vw,20px) clamp(16px,2.5vw,24px)", display: "flex", alignItems: "center", gap: 12, cursor: loading || !latest ? "default" : "pointer" }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, flex: 1, margin: 0 }}>Latest Analysis</h3>
              {/* Location preview when collapsed */}
              {!open && latest && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                  {latest.locationName} · {latest.date}
                </span>
              )}
              <button onClick={e => { e.stopPropagation(); onNav("history"); }} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", background: "none", border: "none", flexShrink: 0 }}>
                View All →
              </button>
              {latest && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0 }}>▾</span>
              )}
            </div>

            {/* Body — shown only when open */}
            {loading && (
              <div style={{ padding: "40px 0", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>Loading…</div>
            )}
            {!loading && !latest && (
              <div style={{ padding: "40px 0", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
                No analyses yet. Run your first one! ⚡
              </div>
            )}
            {!loading && latest && open && (
              <div style={{ borderTop: "1px solid var(--border)", padding: "clamp(14px,2.5vw,22px) clamp(16px,2.5vw,24px)", animation: "fadeUp .3s ease" }}>
                <LatestAnalysisPanel latest={latest} chatHistory={chatHistory} onNav={onNav} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
