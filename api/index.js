const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import tournament data - use explicit path for Vercel
let tournament;
try {
  tournament = require('./data').tournament;
} catch (error) {
  console.error('Error loading tournament data:', error);
  // Fallback data
  tournament = {
    id: 'sahara-cup-2025',
    name: 'Sahara Cup 2025',
    players: [],
    groups: [],
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

// Main handler function for Vercel
module.exports = async (req, res) => {
  // Set CORS headers manually
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { method, url } = req;
  
  // Parse URL path - handle both full URLs and relative paths
  let path = url;
  if (url.includes('://')) {
    path = new URL(url).pathname;
  } else {
    path = url.split('?')[0];
  }
  
  // Ensure path starts with /api for our routing
  if (!path.startsWith('/api')) {
    path = '/api' + (path.startsWith('/') ? path : '/' + path);
  }
  
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
