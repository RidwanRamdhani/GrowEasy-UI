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
    // Guard protected pages — redirect to login if not authed
    const protected_ = ["dashboard", "analyze", "history"];
    if (protected_.includes(p) && !user) {
      setPage("login");
      return;
    }
    // Redirect away from auth pages if already logged in
    if ((p === "login" || p === "register") && user) {
      setPage("dashboard");
      return;
    }
    setPage(p);
  };

  return (
    <>
      {page === "landing"   && <LandingPage   onNav={go} />}
      {page === "login"     && <AuthPage      mode="login"    onNav={go} />}
      {page === "register"  && <AuthPage      mode="register" onNav={go} />}
      {page === "dashboard" && <DashboardPage onNav={go} />}
      {page === "analyze"   && <AnalyzePage   onNav={go} />}
      {page === "history"   && <HistoryPage   onNav={go} />}
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
