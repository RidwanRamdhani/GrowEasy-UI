export default function RiskBadge({ level }) {
  const map = {
    Low:    ["rgba(196,90,58,.15)",  "#c45a3a", "#e07050", "Low Score"],
    Medium: ["rgba(212,168,42,.15)", "#d4a82a", "#f0c040", "Medium Score"],
    High:   ["rgba(122,171,68,.15)", "#7aab44", "#a8d45a", "High Score"],
  };
  const [bg, border, color, label] = map[level] || map.Medium;
  return (
    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 500, padding: "2px 10px", borderRadius: 20, letterSpacing: ".08em", background: bg, border: `1px solid ${border}`, color, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}
