import { useState, useRef } from "react";
import Sidebar   from "../components/Sidebar";
import RiskBadge from "../components/RiskBadge";
import ScoreRing from "../components/ScoreRing";
import { predict, sendChat, resetChat } from "../services/api";
import { parseAnalysis } from "../services/parseResults";

const STEPS = [
  { key: "locating",   label: "Detecting GPS Location",              icon: "📍" },
  { key: "analyzing",  label: "Fetching Weather + Soil + ML Model",  icon: "🌐" },
  { key: "gemini",     label: "Generating Gemini AI Summary",        icon: "🤖" },
  { key: "done",       label: "Results Ready",                       icon: "✅" },
];

export default function AnalyzePage({ onNav }) {
  const [step,     setStep]     = useState("idle");
  const [error,    setError]    = useState("");
  const [progress, setProgress] = useState(0);
  const [coords,   setCoords]   = useState(null);
  const [result,   setResult]   = useState(null);
  const [chat,     setChat]     = useState([]);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const endRef = useRef(null);

  const stepIdx = STEPS.findIndex(s => s.key === step);

  // ── Main flow ───────────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    setError("");
    try {
      // 1 — GPS
      setStep("locating"); setProgress(15);
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000, enableHighAccuracy: true,
        })
      );
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setCoords({ lat, lon });
      setProgress(30);

      // 2 — POST /api/predict  (BE handles weather + soil + ML + Gemini internally)
      setStep("analyzing"); setProgress(50);
      const raw = await predict(lat, lon);
      setProgress(85);

      // 3 — Parse Gemini step visually
      setStep("gemini"); setProgress(95);
      await new Promise(r => setTimeout(r, 600)); // tiny visual pause

      // 4 — Done
      setStep("done"); setProgress(100);
      const parsed = parseAnalysis(raw);
      setResult(parsed);

      // Reset chat session so Gemini uses this new analysis as context
      await resetChat().catch(() => {}); // ignore if it fails

      setChat([{
        role: "ai",
        content: `Analysis complete! 🌾 ML predicts **${parsed.predictionClass}** as your best crop (${parsed.probability}% confidence). Food security score: ${parsed.cropScore}/100 — ${parsed.riskLevel} Risk. Ask me anything!`,
      }]);

    } catch (err) {
      setStep("idle");
      if (err.code === 1) {
        setError("GPS access denied. Please allow location access in your browser and try again.");
      } else {
        setError(err.message || "Analysis failed. Make sure the backend is running.");
      }
    }
  };

  // ── Chat — POST /api/chat ───────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    setChat(prev => [...prev, { role: "user", content: msg }]);
    setTyping(true);
    try {
      // BE uses latest analysis as context via Gemini automatically
      const res = await sendChat(msg);
      setChat(prev => [...prev, { role: "ai", content: res.response }]);
    } catch (err) {
      setChat(prev => [...prev, { role: "ai", content: `Error: ${err.message}` }]);
    } finally {
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="shell">
      <Sidebar active="analyze" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">

          <button onClick={() => onNav("dashboard")} style={{ marginBottom: 22, background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>← Back</button>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>NEW LAND ANALYSIS</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 24 }}>Food Security Analysis</h1>

          {/* ── IDLE ── */}
          {step === "idle" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(40px,6vw,72px)", textAlign: "center", animation: "fadeUp .4s ease" }}>
              <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 28px" }}>
                {[0,1,2].map(i => <div key={i} style={{ position: "absolute", inset: `${i*13}px`, borderRadius: "50%", border: "1px solid rgba(122,171,68,.3)", animation: `pulse-ring 2.5s ease-out infinite ${i*.5}s` }} />)}
                <div style={{ position: "absolute", inset: "30px", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,rgba(168,212,90,.2),rgba(61,107,32,.3))", border: "1px solid rgba(122,171,68,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📍</div>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, marginBottom: 14 }}>Ready to Analyze Your Land</h2>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-dim)", fontSize: 15, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 10px" }}>
                GPS location → Open-Meteo weather → SoilGrids soil data → ML crop prediction → Gemini AI explanation, all in one click.
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 32 }}>
                Backend: <code style={{ color: "var(--green)" }}>{import.meta.env.VITE_API_URL || "http://localhost:8080"}</code>
              </p>
              {error && (
                <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 8, background: "rgba(196,90,58,.1)", border: "1px solid rgba(196,90,58,.3)", fontFamily: "var(--font-mono)", fontSize: 12, color: "#e07050", maxWidth: 480, margin: "0 auto 20px", textAlign: "left" }}>
                  ⚠️ {error}
                </div>
              )}
              <button onClick={runAnalysis} style={{ padding: "15px 52px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, boxShadow: "0 0 40px rgba(122,171,68,.32)" }}>
                ⚡ Start Analyze
              </button>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {step !== "idle" && step !== "done" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(22px,4vw,40px)", animation: "fadeUp .4s ease" }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>Processing…</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)" }}>{progress}%</span>
                </div>
                <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${progress}%`, borderRadius: 2, background: "linear-gradient(90deg,#3d6b20,#7aab44,#a8d45a)", transition: "width .8s cubic-bezier(.4,0,.2,1)", boxShadow: "0 0 8px rgba(122,171,68,.5)" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 10 }}>
                {STEPS.map((s, i) => {
                  const active = s.key === step, done = stepIdx > i;
                  return (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 10, transition: "all .3s", background: active ? "rgba(122,171,68,.08)" : done ? "rgba(122,171,68,.04)" : "transparent", border: `1px solid ${active ? "rgba(122,171,68,.3)" : done ? "rgba(122,171,68,.1)" : "var(--border)"}` }}>
                      <span style={{ fontSize: 18, opacity: done||active?1:.3, flexShrink:0 }}>{done ? "✅" : s.icon}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(11px,1.4vw,13px)", flex:1, color: active?"var(--green-bright)":done?"var(--text-dim)":"var(--text-muted)" }}>{s.label}</span>
                      {active && <div style={{ display:"flex", gap:4, flexShrink:0 }}>{[0,1,2].map(j=><div key={j} style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)", animation:`dot-pulse 1.4s ease-in-out infinite ${j*.16}s` }}/>)}</div>}
                    </div>
                  );
                })}
              </div>
              {coords && (
                <div style={{ marginTop: 18, padding: "11px 14px", borderRadius: 8, background: "rgba(122,171,68,.06)", border: "1px solid rgba(122,171,68,.15)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)" }}>
                  📍 {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
                </div>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {step === "done" && result && (
            <div className="results-cols" style={{ animation: "fadeUp .5s ease" }}>

              {/* Left — results */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(16px,3.5vw,28px)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>ANALYSIS RESULTS</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)" }}>📍 {result.locationName}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <ScoreRing score={result.cropScore} size={80} />
                    <div>
                      <RiskBadge level={result.riskLevel} />
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>Food Security Score</div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="metrics-grid">
                  {[
                    ["SOIL pH",     result.ph,          ""],
                    ["NITROGEN",    result.nitrogen,     " kg/ha"],
                    ["TEMPERATURE", result.temperature,  "°C"],
                    ["HUMIDITY",    result.humidity,     "%"],
                    ["RAINFALL",    result.rainfall,     " mm/d"],
                    ["CONFIDENCE",  result.probability,  "%"],
                  ].map(([lbl, val, unit]) => (
                    <div key={lbl} style={{ background: "var(--surface2)", borderRadius: 10, padding: "clamp(10px,1.8vw,16px)", border: "1px solid var(--border)" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".08em" }}>{lbl}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.8vw,18px)", fontWeight: 700, color: "var(--green-bright)" }}>{val}{unit}</div>
                    </div>
                  ))}
                </div>

                {/* Top-3 predictions */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 10, letterSpacing: ".08em" }}>ML TOP-3 CROP PREDICTIONS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.top3.map((c, i) => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: i===0?"var(--green-bright)":"var(--text-muted)", width: 20, flexShrink: 0 }}>#{i+1}</span>
                        <div style={{ flex: 1, height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${c.prob}%`, background: i===0?"linear-gradient(90deg,#3d6b20,#7aab44)":"var(--border)", borderRadius: 3, transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: i===0?"var(--green-bright)":"var(--text-dim)", width: 140, textAlign: "right" }}>
                          🌱 {c.name} <span style={{ color: "var(--text-muted)" }}>({c.prob}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gemini AI summary */}
                {result.aiResponse && (
                  <div style={{ background: "rgba(61,107,32,.1)", border: "1px solid rgba(122,171,68,.22)", borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "blink 1.5s infinite", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", letterSpacing: ".08em" }}>🤖 GEMINI AI SUMMARY</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.72 }}>{result.aiResponse}</p>
                  </div>
                )}
              </div>

              {/* Right — Gemini chat */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(16px,3.5vw,24px)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "blink 1.5s infinite", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Chat with Gemini AI</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Powered by Google Gemini</span>
                </div>

                <div style={{ flex: 1, minHeight: 300, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  {chat.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                      <div style={{ maxWidth: "78%", padding: "11px 15px", borderRadius: m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", background: m.role==="user"?"rgba(122,171,68,.15)":"var(--surface2)", border: `1px solid ${m.role==="user"?"rgba(122,171,68,.3)":"var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
                      {[0,1,2].map(j=><div key={j} style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", animation:`dot-pulse 1.4s ease-in-out infinite ${j*.16}s` }}/>)}
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Ask Gemini about your land…"
                    style={{ flex: 1, minWidth: 0, marginTop: 0 }}
                  />
                  <button onClick={sendMessage} style={{ padding: "11px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, flexShrink: 0 }}>Send</button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
