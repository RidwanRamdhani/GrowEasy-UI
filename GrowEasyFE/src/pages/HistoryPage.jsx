import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HistoryCard from "../components/HistoryCard";
import { getHistory, getChatHistory } from "../services/api";
import { parseAnalysis } from "../services/parseResults";

export default function HistoryPage({ onNav }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [openId,  setOpenId]  = useState(null);

  useEffect(() => {
    Promise.all([
      getHistory(),
      getChatHistory(true),
    ])
      .then(([histRes, chatRes]) => {
        const rawAnalyses = histRes.data ?? [];
        const analyses    = rawAnalyses.map(parseAnalysis);

        // ── Flatten ALL messages from all sessions into one list, sorted by time ──
        // We cannot trust session_id for grouping because the BE's ResetSession
        // never persists the new UUID — GetOrCreateSessionID always re-uses the
        // last saved message's session_id, so all chats end up on the same session_id.
        const allMessages = Object.values(chatRes.data ?? {})
          .flat()
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // ── Build time windows from analyses ──
        // Sort analyses oldest → newest so we can define windows
        const sortedRaw = [...rawAnalyses]
          .map((r, i) => ({ raw: r, parsed: analyses[i], t: new Date(r.created_at).getTime() }))
          .sort((a, b) => a.t - b.t);

        // Window for analysis[i] = [analysis[i].created_at, analysis[i+1].created_at)
        // Window for last analysis = [analysis[last].created_at, +Infinity)
        const windows = sortedRaw.map((item, idx) => ({
          id:    item.parsed.id,
          start: item.t,
          end:   idx + 1 < sortedRaw.length ? sortedRaw[idx + 1].t : Infinity,
        }));

        // ── Assign each message to its analysis window ──
        const msgMap = {}; // analysisId → ChatMessage[]
        windows.forEach(w => { msgMap[w.id] = []; });

        allMessages.forEach(msg => {
          const t = new Date(msg.created_at).getTime();
          const win = windows.find(w => t >= w.start && t < w.end);
          if (win) msgMap[win.id].push(msg);
          // Messages before the first analysis are ignored (shouldn't exist)
        });

        // ── Merge into analyses (keep BE newest-first order) ──
        const merged = analyses.map(a => ({
          ...a,
          chatMessages: msgMap[a.id] ?? [],
        }));

        setItems(merged);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleCard = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div className="shell">
      <Sidebar active="history" onNav={onNav} />
      <div className="main-scroll">
        <div className="main-inner">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, letterSpacing: ".1em" }}>HISTORY</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3.5vw,32px)", fontWeight: 800, letterSpacing: "-.03em", marginBottom: 24 }}>
            Previous Analyses
          </h1>

          {loading && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>Loading history…</div>}

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
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map(item => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => toggleCard(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
