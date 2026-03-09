import { HISTORY, sleep } from "../MockData";
import { useState, useEffect, useRef } from "react"; 
import Sidebar from "../components/Sidebar";
import ScoreRing from "../components/ScoreRing";
import RiskBadge from "../components/RiskBadge";

export default function AnalyzePage({ onNav }) {
  const [step, setStep]         = useState("idle");
  const [location, setLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult]     = useState(null);
  const [chat, setChat]         = useState([]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const endRef = useRef(null);

  const STEPS = [
    { key: "locating",   label: "Detecting GPS Location",         icon: "📍" },
    { key: "fetching",   label: "Fetching Soil & Weather Data",   icon: "🌐" },
    { key: "processing", label: "Running ML Prediction (Python)", icon: "⚙️" },
    { key: "ai",         label: "Generating AI Explanation",      icon: "🤖" },
    { key: "done",       label: "Results Ready",                  icon: "✅" },
  ];

  const run = async () => {
    setStep("locating"); setProgress(10); await sleep(1800);
    setLocation({ lat: -6.5971, lng: 106.806, name: "Bogor, West Java" }); setProgress(25);
    setStep("fetching"); await sleep(2000); setProgress(50);
    setStep("processing"); await sleep(2200); setProgress(75);
    setStep("ai"); await sleep(1800); setProgress(100);
    setStep("done");
    setResult({
      location: "Bogor, West Java", cropScore: 78, riskLevel: "Low",
      soilPH: 6.2, moisture: 63, rainfall: "1180 mm/yr", temp: "27°C",
      nitrogen: 72, phosphorus: 45, potassium: 58,
      recommendation: ["Rice","Cassava","Sweet Corn"],
      aiSummary: "Land conditions in Bogor, West Java show strong potential for food cultivation. A soil pH of 6.2 is ideal for most tropical crops. Soil moisture at 63% and 1180mm/yr rainfall support optimal plant growth. Food security score: 78/100.",
    });
    setChat([{ role: "ai", content: "Hi! Analysis complete for Bogor, West Java. Score: 78/100 (Low Risk). Top picks are rice, cassava, and sweet corn. What would you like to know?" }]);
  };

  const send = async () => {
    if (!input.trim()) return;
    const msg = input; setInput("");
    setChat(p => [...p, { role: "user", content: msg }]);
    setTyping(true); await sleep(1400);
    const replies = [
      "Based on 63% moisture and pH 6.2, paddy rice could thrive with rotational irrigation. The IR64 variety adapts well here.",
      "Nitrogen at 72% is healthy, but phosphorus (45%) needs a boost — apply SP-36 at ~100 kg/ha before planting.",
      "Moderate flood risk detected. Build drainage channels along the field perimeter to prevent waterlogging in rainy season.",
    ];
    setTyping(false);
    setChat(p => [...p, { role: "ai", content: replies[Math.floor(Math.random()*replies.length)] }]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const stepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <div className="shell">
      <Sidebar active="analyze" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">
          <div style={{ width: "100%" }}>
            <button onClick={() => onNav("dashboard")} style={{ marginBottom: 22, background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>← Back</button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>NEW LAND ANALYSIS</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 24 }}>Food Security Analysis</h1>

            {/* IDLE */}
            {step === "idle" && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(28px,6vw,52px)", textAlign: "center", animation: "fadeUp .4s ease" }}>
                <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 26px" }}>
                  {[0,1,2].map(i => <div key={i} style={{ position: "absolute", inset: `${i*12}px`, borderRadius: "50%", border: "1px solid rgba(122,171,68,.3)", animation: `pulse-ring 2.5s ease-out infinite ${i*.5}s` }} />)}
                  <div style={{ position: "absolute", inset: "28px", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,rgba(168,212,90,.2),rgba(61,107,32,.3))", border: "1px solid rgba(122,171,68,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📍</div>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 700, marginBottom: 12 }}>Ready to Analyze Your Land</h2>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--text-dim)", fontSize: 14, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 28px" }}>
                  The system will access GPS, pull real soil & weather data, run ML predictions, and generate an AI explanation of your land's potential.
                </p>
                <button onClick={run} style={{ padding: "14px 44px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, boxShadow: "0 0 40px rgba(122,171,68,.32)" }}>
                  ⚡ Start Analyze
                </button>
              </div>
            )}

            {/* PROCESSING */}
            {step !== "idle" && step !== "done" && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(22px,4vw,40px)", animation: "fadeUp .4s ease" }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>Processing...</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)" }}>{progress}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--surface2)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${progress}%`, borderRadius: 2, background: "linear-gradient(90deg,#3d6b20,#7aab44,#a8d45a)", transition: "width .8s cubic-bezier(.4,0,.2,1)", boxShadow: "0 0 8px rgba(122,171,68,.5)" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                  {STEPS.map((s, i) => {
                    const active = s.key === step, done = stepIdx > i;
                    return (
                      <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 10, transition: "all .3s", background: active?"rgba(122,171,68,.08)":done?"rgba(122,171,68,.04)":"transparent", border: `1px solid ${active?"rgba(122,171,68,.3)":done?"rgba(122,171,68,.1)":"var(--border)"}` }}>
                        <span style={{ fontSize: 18, opacity: done||active?1:.3, flexShrink: 0 }}>{done?"✅":s.icon}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(11px,1.4vw,13px)", flex: 1, color: active?"var(--green-bright)":done?"var(--text-dim)":"var(--text-muted)" }}>{s.label}</span>
                        {active && (
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            {[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: `dot-pulse 1.4s ease-in-out infinite ${j*.16}s` }} />)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {location && (
                  <div style={{ marginTop: 18, padding: "11px 14px", borderRadius: 8, background: "rgba(122,171,68,.06)", border: "1px solid rgba(122,171,68,.15)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)" }}>
                    📍 {location.name} — {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>
            )}

            {/* RESULTS */}
            {step === "done" && result && (
              <div className="results-cols" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20, animation: "fadeUp .5s ease" }}>
                {/* Result card */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(16px,3.5vw,28px)" }}>
                  <div className="result-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>ANALYSIS RESULTS</div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,2.5vw,20px)", fontWeight: 700 }}>📍 {result.location}</h2>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <ScoreRing score={result.cropScore} size={80} />
                      <div>
                        <RiskBadge level={result.riskLevel} />
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>Food Security Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="metrics-grid">
                    {[
                      ["SOIL pH",     result.soilPH,    ""],
                      ["MOISTURE",    result.moisture,   "%"],
                      ["RAINFALL",    result.rainfall,   ""],
                      ["TEMPERATURE", result.temp,       ""],
                      ["NITROGEN",    result.nitrogen,   "%"],
                      ["PHOSPHORUS",  result.phosphorus, "%"],
                    ].map(([lbl, val, unit]) => (
                      <div key={lbl} style={{ background: "var(--surface2)", borderRadius: 10, padding: "clamp(10px,1.8vw,14px)", border: "1px solid var(--border)" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".08em" }}>{lbl}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,2.2vw,20px)", fontWeight: 700, color: "var(--green-bright)" }}>{val}{unit}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 10, letterSpacing: ".08em" }}>RECOMMENDED CROPS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.recommendation.map(c => (
                        <span key={c} style={{ padding: "6px 16px", borderRadius: 20, fontFamily: "var(--font-mono)", fontSize: 12, background: "rgba(122,171,68,.12)", border: "1px solid rgba(122,171,68,.3)", color: "var(--green-bright)" }}>🌱 {c}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "rgba(61,107,32,.1)", border: "1px solid rgba(122,171,68,.22)", borderRadius: 10, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "blink 1.5s infinite", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--green)", letterSpacing: ".08em" }}>AI EXPLANATION</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-dim)", lineHeight: 1.72 }}>{result.aiSummary}</p>
                  </div>
                </div>

                {/* Chat */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(16px,3.5vw,24px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: "blink 1.5s infinite", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Chat with AI</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Ask anything about your results</span>
                  </div>
                  <div style={{ height: 280, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {chat.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth: "78%", padding: "11px 15px", borderRadius: m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", background: m.role==="user"?"rgba(122,171,68,.15)":"var(--surface2)", border: `1px solid ${m.role==="user"?"rgba(122,171,68,.3)":"var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>{m.content}</div>
                      </div>
                    ))}
                    {typing && (
                      <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: `dot-pulse 1.4s ease-in-out infinite ${j*.16}s` }} />)}
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()} placeholder="Ask about your land..." style={{ flex: 1, minWidth: 0, marginTop: 0 }} />
                    <button onClick={send} style={{ padding: "11px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, flexShrink: 0 }}>Send</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}