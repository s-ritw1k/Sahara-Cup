import cors from 'cors';
import jwt from 'jsonwebtoken';

// Import tournament data - use explicit path for Vercel
let tournament;
try {
  const dataModule = await import('./data.js');
  tournament = dataModule.tournament;
  console.log('Tournament data loaded successfully:', tournament?.id);
} catch (error) {
  console.error('Error loading tournament data:', error);
  // Fallback data
  tournament = {
    id: 'sahara-cup-2025',
    name: 'Sahara Cup 2025',
    description: 'Annual Table Tennis Tournament',
    players: [
      { id: 'p1', name: 'Test Player 1', email: 'test1@example.com' },
      { id: 'p2', name: 'Test Player 2', email: 'test2@example.com' }
    ],
    groups: [
      { id: 'g1', name: 'Group A', playerIds: ['p1', 'p2'] }
    ],
    matches: [],
    knockoutMatches: []
  };
}

// Store tournament data in memory
let tournamentData = { ...tournament };

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sahara-cup-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// CORS middleware
const corsMiddleware = cors({
  origin: true,
  credentials: true
});

// Main handler function for Vercel serverless
export default async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { method, url } = req;
  
  // Simple path parsing
  const path = url.split('?')[0];
  
  console.log(`API Request: ${method} ${path}`);
  
  // Parse request body for POST requests
  if (method === 'POST' && req.body === undefined) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    await new Promise(resolve => {
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          req.body = {};
        }
        resolve();
      });
    });
  }
  
  try {
    // Log for debugging
    console.log(`API Request: ${method} ${path}`);
    
    // Admin login
    if (method === 'POST' && path === '/api/auth/login') {
      const { username, password } = req.body || {};
      
      if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { username: 'admin' } });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    
    // Tournament API endpoints
    if (method === 'GET' && path === '/api/tournament') {
      return res.json(tournamentData);
    }
    
    if (method === 'GET' && path === '/api/tournament/groups') {
      return res.json(tournamentData.groups);
    }
    
    if (method === 'GET' && path === '/api/tournament/matches') {
      return res.json(tournamentData.matches);
    }
    
    if (method === 'GET' && path === '/api/tournament/players') {
      return res.json(tournamentData.players);
    }
    
    if (method === 'GET' && path === '/api/tournament/knockout') {
      return res.json(tournamentData.knockoutMatches || []);
    }
    
    // Additional API endpoints that the frontend expects
    if (method === 'GET' && path === '/api/matches') {
      return res.json(tournamentData.matches || []);
    }
    
    if (method === 'GET' && path === '/api/groups') {
      return res.json(tournamentData.groups || []);
    }
    
    if (method === 'GET' && path === '/api/matches/upcoming') {
      const upcomingMatches = (tournamentData.matches || []).filter(m => m.status === 'upcoming');
      return res.json(upcomingMatches);
    }
    
    if (method === 'GET' && path === '/api/matches/live') {
      const liveMatches = (tournamentData.matches || []).filter(m => m.status === 'live');
      return res.json(liveMatches);
    }
    
    if (method === 'GET' && path === '/api/standings') {
      // Generate basic standings from groups and matches
      const standings = [];
      (tournamentData.groups || []).forEach(group => {
        group.playerIds.forEach(playerId => {
          const player = (tournamentData.players || []).find(p => p.id === playerId);
          if (player) {
            // Calculate stats from matches
            const playerMatches = (tournamentData.matches || []).filter(m => 
              m.player1Id === playerId || m.player2Id === playerId
            );
            
            let wins = 0;
            let losses = 0;
            let setsWon = 0;
            let setsLost = 0;
            
            playerMatches.forEach(match => {
              if (match.status === 'completed') {
                if (match.player1Id === playerId) {
                  setsWon += match.player1Score;
                  setsLost += match.player2Score;
                  if (match.winnerId === playerId) wins++;
                  else losses++;
                } else {
                  setsWon += match.player2Score;
                  setsLost += match.player1Score;
                  if (match.winnerId === playerId) wins++;
                  else losses++;
                }
              }
            });
            
            const matchesPlayed = wins + losses;
            const points = wins * 3; // 3 points per win
            
            standings.push({
              playerId: player.id,
              playerName: player.name,
              matchesPlayed,
              wins,
              losses,
              points,
              setsWon,
              setsLost
            });
          }
        });
      });
      
      // Sort by points first, then by wins, then by sets won/lost ratio
      standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
        return a.setsLost - b.setsLost;
      });
      
      return res.json(standings);
    }
    
    // Group-specific standings
    if (method === 'GET' && path.startsWith('/api/standings/group/')) {
      const groupId = path.split('/').pop();
      const group = (tournamentData.groups || []).find(g => g.id === groupId);
      const standings = [];
      
      if (group) {
        group.playerIds.forEach(playerId => {
          const player = (tournamentData.players || []).find(p => p.id === playerId);
          if (player) {
            // Calculate stats from matches in this group
            const playerMatches = (tournamentData.matches || []).filter(m => 
              m.groupId === groupId && (m.player1Id === playerId || m.player2Id === playerId)
            );
            
            let wins = 0;
            let losses = 0;
            let setsWon = 0;
            let setsLost = 0;
            
            playerMatches.forEach(match => {
              if (match.status === 'completed') {
                if (match.player1Id === playerId) {
                  setsWon += match.player1Score;
                  setsLost += match.player2Score;
                  if (match.winnerId === playerId) wins++;
                  else losses++;
                } else {
                  setsWon += match.player2Score;
                  setsLost += match.player1Score;
                  if (match.winnerId === playerId) wins++;
                  else losses++;
                }
              }
            });
            
            const matchesPlayed = wins + losses;
            const points = wins * 3; // 3 points per win
            
            standings.push({
              playerId: player.id,
              playerName: player.name,
              matchesPlayed,
              wins,
              losses,
              points,
              setsWon,
              setsLost
            });
          }
        });
        
        // Sort by points first, then by wins, then by sets won/lost ratio
        standings.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
          return a.setsLost - b.setsLost;
        });
      }
      return res.json(standings);
    }
    
    if (method === 'GET' && path === '/api/knockout') {
      return res.json(tournamentData.knockoutMatches || []);
    }
    
    if (method === 'GET' && path === '/api/knockout/qualified-players') {
      // For now, return empty array - this would be calculated from group results
      return res.json([]);
    }
    
    // Health check
    if (method === 'GET' && path === '/api/health') {
      return res.json({ status: 'OK', timestamp: new Date().toISOString() });
    }
    
    // Default 404 for API routes
    if (path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For non-API routes, return 404
    return res.status(404).json({ error: 'Not Found' });
    
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      method,
      path,
      url,
      errorMessage: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      path: path
    });
  }
};
