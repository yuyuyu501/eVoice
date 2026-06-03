import { Routes, Route, Link, useLocation } from "react-router-dom";
import VoiceClone from "./pages/VoiceClone";
import Settings from "./pages/Settings";

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">eVoice</div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            语音克隆
          </Link>
          <Link
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            设置
          </Link>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<VoiceClone />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
