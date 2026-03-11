import { useAuth } from "../context/AuthContext"; 

const NAV_ITEMS = [
  { key: "dashboard", icon: "⬡", label: "Dashboard" },
  { key: "analyze",   icon: "⚡", label: "New Analysis" },
  { key: "history",   icon: "◫", label: "History" },
];

export default function Sidebar({ active, onNav }) {

   const { logout } = useAuth();

  return (

    <aside className="sidebar">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 20, flexShrink: 0 }}>
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="#7aab44" strokeWidth="1.2" strokeDasharray="2 2" />
          <path d="M12 5c0 0-5 3.5-5 8c0 3 2.5 5 5 5s5-2 5-5c0-4.5-5-8-5-8z"
            fill="rgba(122,171,68,.2)" stroke="#7aab44" strokeWidth="1" />
        </svg>
        <span className="sidebar-logo-text" style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>
          Grow<span style={{ color: "var(--green)" }}>Easy</span>
        </span>
      </div>

      {/* Nav links */}
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => onNav(item.key)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            width: "100%", textAlign: "left",
            background: active === item.key ? "rgba(122,171,68,.12)" : "transparent",
            color: active === item.key ? "var(--green-bright)" : "var(--text-muted)",
            fontFamily: "var(--font-mono)", fontSize: 13,
            borderLeft: active === item.key ? "2px solid var(--green)" : "2px solid transparent",
            transition: "all .2s",
          }}
        >
          <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </button>
      ))}

      {/* Sign out */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => {
          logout();        // ← clears token + user from localStorage and state
          onNav("logout");
        }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", width: "100%",
            border: "none", background: "transparent",
            color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12,
          }}
        >
          <span style={{ flexShrink: 0 }}>←</span>
          <span className="sidebar-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
