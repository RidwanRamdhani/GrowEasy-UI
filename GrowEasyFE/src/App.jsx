import { useState, useEffect, useRef } from "react";

// FONTS
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
document.head.appendChild(fontLink);

// GLOBAL CSS
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #0c0f0a;
    --surface:      #131710;
    --surface2:     #1a1f15;
    --border:       #2a3022;
    --green:        #7aab44;
    --green-bright: #a8d45a;
    --amber:        #d4a82a;
    --amber-dim:    #7a5a08;
    --text:         #d8e4c8;
    --text-dim:     #7a8a68;
    --text-muted:   #445038;
    --accent:       #3d6b20;
    --font-display: 'Syne', sans-serif;
    --font-mono:    'DM Mono', monospace;
    --font-body:    'Lora', serif;
  }

  /* ── Make the entire browser window fill-able ── */
  html {
    height: 100%;
    background: #0c0f0a;
  }
  body {
    height: 100%;
    background: #0c0f0a;
    color: #d8e4c8;
    font-family: 'Lora', serif;
    overflow-x: hidden;
  }
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); }
  }
  @keyframes dot-pulse {
    0%, 80%, 100% { transform: scale(0); opacity: 0; }
    40%           { transform: scale(1); opacity: 1; }
  }

  /* ── Full-screen shell (sidebar + main) ── */
  .shell {
    display: flex;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  /* Sidebar */
  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 28px 16px;
    height: 100%;
    overflow-y: auto;
    transition: width 0.25s ease;
  }
  .sidebar-label { white-space: nowrap; overflow: hidden; }

  /* Main scrollable area */
  .main-scroll {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .main-inner {
    flex: 1;
    padding: clamp(20px, 3.5vw, 48px);
    width: 100%;
  }

  /* ── Landing page fills the entire #root ── */
  .landing-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .landing-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: clamp(14px, 2.5vw, 24px) clamp(20px, 5vw, 64px);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .landing-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: clamp(40px, 6vw, 100px) clamp(20px, 5vw, 64px);
  }

  /* ── Responsive grids ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(10px, 2vw, 20px);
    margin-bottom: clamp(16px, 2.5vw, 28px);
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: clamp(8px, 1.5vw, 14px);
    margin-bottom: clamp(14px, 2vw, 22px);
  }

  /* ── Auth page centers without fixed height ── */
  .auth-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow-y: auto;
  }

  /* Inputs */
  input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-top: 6px;
  }
  input:focus {
    border-color: rgba(122,171,68,0.55);
    box-shadow: 0 0 0 3px rgba(122,171,68,0.09);
  }
  button { cursor: pointer; transition: opacity 0.15s; }
  button:hover { opacity: 0.84; }

  /* ── Breakpoints ── */
  @media (max-width: 860px) {
    .sidebar { width: 64px; padding: 20px 10px; align-items: center; }
    .sidebar-label, .sidebar-logo-text { display: none !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .metrics-grid { grid-template-columns: repeat(3, 1fr); }
    .results-cols { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 600px) {
    .stats-grid   { grid-template-columns: 1fr 1fr; }
    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .hero-stats   { flex-wrap: wrap; gap: 24px !important; }
    .result-head  { flex-direction: column !important; }
  }
  @media (max-width: 420px) {
    .stats-grid   { grid-template-columns: 1fr; }
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

// MOCK DATA
const HISTORY = [
  {
    id: "H001", date: "2025-11-14", location: "Bogor, West Java",
    cropScore: 82, riskLevel: "Low", soilPH: 6.4, moisture: 68,
    rainfall: "1240 mm/yr", temp: "26°C", nitrogen: 78, phosphorus: 52, potassium: 61,
    recommendation: "Rice, Cassava, Corn",
    aiSummary: "Land conditions strongly support food crop cultivation. Soil nitrogen is optimal and rainfall is consistent year-round. The slightly acidic pH of 6.4 is ideal for rice and corn. Maintain organic mulch to preserve moisture during dry spells.",
    chat: [
      { role: "user", content: "What should I watch out for next planting season?" },
      { role: "ai",   content: "Focus on drainage management during peak rainy season (Jan–Feb). The 68% soil moisture is ideal — maintain it with organic mulch and avoid over-irrigation." },
    ],
  },
  {
    id: "H002", date: "2025-09-03", location: "Bogor, West Java",
    cropScore: 61, riskLevel: "Medium", soilPH: 5.8, moisture: 42,
    rainfall: "980 mm/yr", temp: "28°C", nitrogen: 55, phosphorus: 38, potassium: 47,
    recommendation: "Cassava, Sweet Potato",
    aiSummary: "Soil moisture is below optimal. Moderate drought risk detected. A drip irrigation system is recommended. Cassava and sweet potato are the most resilient choices given current conditions.",
    chat: [
      { role: "user", content: "Is cassava a good fit here?" },
      { role: "ai",   content: "Yes — cassava is highly drought-tolerant and pH 5.8 is still acceptable. Ensure a minimum planting distance of 80 cm for optimal yield." },
    ],
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// SMALL COMPONENTS
function RiskBadge({ level }) {
  const map = {
    Low:    ["rgba(122,171,68,.15)", "#7aab44", "#a8d45a"],
    Medium: ["rgba(212,168,42,.15)", "#d4a82a", "#f0c040"],
    High:   ["rgba(196,90,58,.15)",  "#c45a3a", "#e07050"],
  };
  const [bg, border, color] = map[level] || map.Medium;
  return (
    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 500, padding: "2px 10px", borderRadius: 20, letterSpacing: "0.08em", background: bg, border: `1px solid ${border}`, color, whiteSpace: "nowrap" }}>
      {level} Risk
    </span>
  );
}

function ScoreRing({ score, size = 80 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#7aab44" : score >= 45 ? "#d4a82a" : "#c45a3a";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1f15" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
      <text x={size/2} y={size/2} fill={color} fontSize={size > 70 ? 16 : 13} fontWeight="700"
        fontFamily="Syne,sans-serif" textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px` }}>
        {score}
      </text>
    </svg>
  );
}

// SIDEBAR
function Sidebar({ active, onNav }) {
  const items = [
    { key: "dashboard", icon: "⬡", label: "Dashboard" },
    { key: "analyze",   icon: "⚡", label: "New Analysis" },
    { key: "history",   icon: "◫", label: "History" },
  ];
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 20, flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="#7aab44" strokeWidth="1.2" strokeDasharray="2 2"/>
          <path d="M12 5c0 0-5 3.5-5 8c0 3 2.5 5 5 5s5-2 5-5c0-4.5-5-8-5-8z" fill="rgba(122,171,68,.2)" stroke="#7aab44" strokeWidth="1"/>
        </svg>
        <span className="sidebar-logo-text" style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
          Grow<span style={{ color: "var(--green)" }}>Easy</span>
        </span>
      </div>

      {items.map(it => (
        <button key={it.key} onClick={() => onNav(it.key)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
          border: "none", width: "100%", textAlign: "left",
          background: active === it.key ? "rgba(122,171,68,.12)" : "transparent",
          color: active === it.key ? "var(--green-bright)" : "var(--text-muted)",
          fontFamily: "var(--font-mono)", fontSize: 13,
          borderLeft: active === it.key ? "2px solid var(--green)" : "2px solid transparent",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 17, flexShrink: 0 }}>{it.icon}</span>
          <span className="sidebar-label">{it.label}</span>
        </button>
      ))}

      <div style={{ marginTop: "auto" }}>
        <button onClick={() => onNav("landing")} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", width: "100%",
          border: "none", background: "transparent", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12,
        }}>
          <span style={{ flexShrink: 0 }}>←</span>
          <span className="sidebar-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// LANDING PAGE
function LandingPage({ onNav }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const h = (e) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <div className="landing-wrap">
      {/* Parallax bg */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 60% 50% at ${30 + mouse.x*20}% ${20 + mouse.y*15}%, rgba(61,107,32,.2) 0%, transparent 70%),
          radial-gradient(ellipse 45% 60% at ${72 - mouse.x*15}% ${68 - mouse.y*10}%, rgba(122,171,68,.08) 0%, transparent 70%)
        `,
        transition: "background 0.25s",
      }} />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Nav */}
      <nav className="landing-nav" style={{ position: "relative", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg viewBox="0 0 32 32" fill="none" width="30" height="30">
            <circle cx="16" cy="16" r="14" stroke="#7aab44" strokeWidth="1.5" strokeDasharray="3 3"/>
            <path d="M16 8c0 0-6 4-6 10c0 4 3 6 6 6s6-2 6-6c0-6-6-10-6-10z" fill="rgba(122,171,68,.2)" stroke="#7aab44" strokeWidth="1.2"/>
            <line x1="16" y1="8" x2="16" y2="24" stroke="#7aab44" strokeWidth=".8" strokeDasharray="2 2"/>
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px,2.2vw,19px)", fontWeight: 700 }}>
            Grow<span style={{ color: "var(--green)" }}>Easy</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onNav("login")} style={{ padding: "8px clamp(12px,2vw,20px)", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Sign In</button>
          <button onClick={() => onNav("register")} style={{ padding: "8px clamp(12px,2vw,20px)", borderRadius: 6, border: "1px solid var(--green)", background: "rgba(122,171,68,.12)", color: "var(--green-bright)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Get Started</button>
        </div>
      </nav>

      {/* Hero — takes all remaining vertical space */}
      <div className="landing-hero" style={{ position: "relative", zIndex: 5 }}>
        {/* Orb */}
        <div style={{ position: "relative", width: "clamp(110px,16vw,175px)", height: "clamp(110px,16vw,175px)", margin: "0 auto clamp(28px,4vw,48px)", animation: "float 4s ease-in-out infinite" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ position: "absolute", inset: `${i*10}px`, borderRadius: "50%", border: "1px solid rgba(122,171,68,.22)", animation: `pulse-ring 2.6s ease-out infinite ${i*.5}s` }} />
          ))}
          <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, rgba(168,212,90,.28), rgba(61,107,32,.4) 55%, rgba(10,15,8,.85))", border: "1px solid rgba(122,171,68,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 80 80" width="58%" height="58%" fill="none">
              <path d="M40 15c0 0-20 13-20 30c0 13 9 20 20 20s20-7 20-20c0-17-20-30-20-30z" fill="rgba(122,171,68,.22)" stroke="#7aab44" strokeWidth="1.5"/>
              <line x1="40" y1="15" x2="40" y2="65" stroke="#7aab44" strokeWidth="1" strokeDasharray="3 3" opacity=".5"/>
              <path d="M25 42 Q35 37 40 42 Q45 47 55 42" stroke="#a8d45a" strokeWidth="1.2" fill="none"/>
            </svg>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(122,171,68,.12)", animation: "spin-slow 12s linear infinite" }}>
            {[0,60,120,180,240,300].map(d => (
              <div key={d} style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: "var(--green)", top: "50%", left: "50%", opacity: .5, transform: `rotate(${d}deg) translateX(calc(50% + 14px)) translateY(-50%)` }} />
            ))}
          </div>
        </div>

        {/* Text block */}
        <div style={{ animation: "fadeUp .8s ease both .1s", opacity: 0, width: "100%", maxWidth: 800 }}>
          <div style={{ display: "inline-block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".2em", color: "var(--green)", background: "rgba(122,171,68,.08)", border: "1px solid rgba(122,171,68,.22)", padding: "4px 16px", borderRadius: 20, marginBottom: 22 }}>
            ◈ AI-POWERED FOOD SECURITY EDUCATION
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.04em", marginBottom: 22, fontSize: "clamp(28px, 6.5vw, 78px)" }}>
            Understand Your<br />
            <span style={{ background: "linear-gradient(135deg,#a8d45a,#7aab44,#3d6b20)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Land's Potential
            </span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--text-dim)", lineHeight: 1.75, fontSize: "clamp(14px,1.8vw,18px)", maxWidth: 520, margin: "0 auto 38px" }}>
            Use soil data, weather patterns, and artificial intelligence to deeply understand the food security potential of your farmland, with just a few clicks!
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => onNav("register")} style={{ padding: "clamp(11px,1.5vw,14px) clamp(22px,3.5vw,36px)", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 600, boxShadow: "0 0 40px rgba(122,171,68,.28)" }}>
              Start Analyzing →
            </button>
            <button onClick={() => onNav("login")} style={{ padding: "clamp(11px,1.5vw,14px) clamp(22px,3.5vw,36px)", borderRadius: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,.03)", color: "var(--text-dim)", fontFamily: "var(--font-display)", fontSize: "clamp(13px,1.4vw,15px)" }}>
              View Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats" style={{ display: "flex", gap: "clamp(28px,5vw,64px)", marginTop: "clamp(44px,6vw,80px)", animation: "fadeUp .8s ease both .4s", opacity: 0, justifyContent: "center" }}>
          {[["94%","Prediction Accuracy"],["12k+","Analyses Done"],["34","Crop Varieties"]].map(([v,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 800, color: "var(--green-bright)" }}>{v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 4, letterSpacing: ".05em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AUTH PAGE
function AuthPage({ mode, onNav }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="auth-wrap" style={{ position: "relative", background: "var(--bg)" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 70% at 30% 50%, rgba(61,107,32,.12), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ width: "100%", maxWidth: 420, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(24px,4vw,40px)", animation: "fadeUp .5s ease both", position: "relative", zIndex: 5 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Grow<span style={{ color: "var(--green)" }}>Easy</span></div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>Food Security Intelligence Platform</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 8, padding: 4, marginBottom: 24 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".05em", background: tab===t ? "rgba(122,171,68,.15)" : "transparent", color: tab===t ? "var(--green-bright)" : "var(--text-muted)", transition: "all .2s" }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "register" && (
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Farmer" />
            </div>
          )}
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>EMAIL</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@farm.com" />
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".08em" }}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button onClick={() => onNav("dashboard")} style={{ marginTop: 6, padding: 13, borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7aab44,#3d6b20)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>
            {tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {tab === "login" ? "No account yet? " : "Already have one? "}
          <button onClick={() => setTab(tab==="login"?"register":"login")} style={{ background: "none", border: "none", color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
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

// HISTORY CARD
function HistoryCard({ item, showChat = true }) {
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

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardPage({ onNav }) {
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
          <div style={{ borderRadius: 16, padding: "clamp(20px,4vw,32px)", marginBottom: "clamp(16px,2.5vw,24px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,rgba(61,107,32,.4) 0%,rgba(19,23,16,.85) 100%)", border: "1px solid rgba(122,171,68,.3)" }}>
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

// ANALYZE PAGE
function AnalyzePage({ onNav }) {
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

// HISTORY PAGE
function HistoryPage({ onNav }) {
  return (
    <div className="shell">
      <Sidebar active="history" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">
          <div style={{ width: "100%" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>HISTORY</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 24 }}>Previous Analyses</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 14 }}>
              {HISTORY.map(item => <HistoryCard key={item.id} item={item} showChat />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ROOT
export default function App() {
  const [page, setPage] = useState("landing");
  const go = (p) => setPage(p);
  return (
    <>
      {page === "landing"   && <LandingPage   onNav={go} />}
      {page === "login"     && <AuthPage mode="login"    onNav={go} />}
      {page === "register"  && <AuthPage mode="register" onNav={go} />}
      {page === "dashboard" && <DashboardPage onNav={go} />}
      {page === "analyze"   && <AnalyzePage   onNav={go} />}
      {page === "history"   && <HistoryPage   onNav={go} />}
    </>
  );
}