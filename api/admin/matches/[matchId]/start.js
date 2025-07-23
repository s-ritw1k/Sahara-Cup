import { tournament } from '../../../data.js';

// Simple authentication check
function authenticate(username, password) {
  return username === 'admin' && password === 'admin123';
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { matchId } = req.query;
    const { username, password } = req.body;

    // Authenticate
    if (!authenticate(username, password)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = tournament.matches[matchIndex];
    
    // Set match to live
    match.status = 'live';
    tournament.matches[matchIndex] = match;

    res.json({
      success: true,
      match: match,
      message: 'Match started successfully'
    });
  } catch (error) {
    console.error('Error starting match:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
