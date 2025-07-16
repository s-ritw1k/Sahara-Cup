const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import tournament data
const { tournament } = require('./data');

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
  // Apply CORS
  corsMiddleware(req, res, () => {});
  
  const { method, url } = req;
  
  // Parse URL path
  const path = url.split('?')[0];
  
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
