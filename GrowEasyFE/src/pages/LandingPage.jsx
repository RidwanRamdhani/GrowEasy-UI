import { useState, useEffect } from "react";

export default function LandingPage({ onNav }) {
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