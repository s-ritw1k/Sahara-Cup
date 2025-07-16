import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { socketService } from './services/socket';
import Layout from './components/Layout';
import Home from './pages/Home';
import Knockout from './pages/Knockout';
import Leaderboard from './pages/Leaderboard';
import Matches from './pages/Matches';
import Groups from './pages/Groups';

function App() {
  useEffect(() => {
    // Connect to socket when app starts
    socketService.connect();

    return () => {
      // Cleanup socket connection
      socketService.disconnect();
    };
  }, []);

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
