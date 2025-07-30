import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Knockout from "./pages/Knockout";
import Leaderboard from "./pages/Leaderboard";
import Matches from "./pages/Matches";
import Groups from "./pages/Groups";
import CurtainLoader from "./components/CurtainLoader";

function App() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // For testing: uncomment the line below to always show curtains
    // sessionStorage.removeItem('sahara-cup-curtain-seen');
    
    // Check if user has already seen the curtain in this session
    const curtainSeen = sessionStorage.getItem('sahara-cup-curtain-seen');
    
    if (curtainSeen) {
      // Skip curtain if already seen in this session
      setShowCurtain(false);
      setAppReady(true);
    } else {
      // Fallback timer in case curtain doesn't complete properly
      const fallbackTimer = setTimeout(() => {
        setShowCurtain(false);
        setAppReady(true);
        sessionStorage.setItem('sahara-cup-curtain-seen', 'true');
      }, 5000); // 5 second fallback

      return () => clearTimeout(fallbackTimer);
    }
  }, []);

  const handleCurtainComplete = () => {
    // Mark curtain as seen for this session only after it completes
    sessionStorage.setItem('sahara-cup-curtain-seen', 'true');
    setShowCurtain(false);
    setTimeout(() => setAppReady(true), 300);
  };

  if (showCurtain) {
    return <CurtainLoader onComplete={handleCurtainComplete} />;
  }

  if (!appReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="knockout" element={<Knockout />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="matches" element={<Matches />} />
            <Route path="groups" element={<Groups />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
