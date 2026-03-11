import { useState } from "react";
import "./styles/global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage   from "./pages/LandingPage";
import AuthPage      from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzePage   from "./pages/AnalyzePage";
import HistoryPage   from "./pages/HistoryPage";

function Router() {
  const { user } = useAuth();
  const [page, setPage] = useState(user ? "dashboard" : "landing");

  const go = (p) => {
    if (p === "logout") { setPage("landing"); return; }
    setPage(p);
  };

  // Auth guard at render time — always uses current user, never stale
  const protected_ = ["dashboard", "analyze", "history"];
  const effectivePage = protected_.includes(page) && !user ? "login" : page;

  return (
    <>
      {effectivePage === "landing"   && <LandingPage   onNav={go} />}
      {effectivePage === "login"     && <AuthPage      mode="login"    onNav={go} />}
      {effectivePage === "register"  && <AuthPage      mode="register" onNav={go} />}
      {effectivePage === "dashboard" && <DashboardPage onNav={go} />}
      {effectivePage === "analyze"   && <AnalyzePage   onNav={go} />}
      {effectivePage === "history"   && <HistoryPage   onNav={go} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
