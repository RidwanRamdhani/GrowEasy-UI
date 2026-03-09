import { HISTORY } from "../MockData";
import Sidebar from "../components/Sidebar";
import HistoryCard from "../components/HistoryCard";


export default function HistoryPage({ onNav }) {
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
