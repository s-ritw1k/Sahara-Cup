import { tournament } from '../../data.js';

// Simple authentication check
function authenticate(username, password) {
  return username === 'admin' && password === 'admin123';
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { matchId } = req.query;
    const { username, password, player1Score, player2Score, status, scheduledTime } = req.body;

    // Authenticate
    if (!authenticate(username, password)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = tournament.matches[matchIndex];
    
    // Update match data
    if (player1Score !== undefined) match.player1Score = parseInt(player1Score) || 0;
    if (player2Score !== undefined) match.player2Score = parseInt(player2Score) || 0;
    if (status !== undefined) match.status = status;
    if (scheduledTime !== undefined) match.scheduledTime = scheduledTime;

    // Determine winner if match is completed
    if (status === 'completed') {
      match.winnerId = match.player1Score > match.player2Score ? match.player1Id : match.player2Id;
    } else if (status !== 'completed') {
      match.winnerId = undefined;
    }

    tournament.matches[matchIndex] = match;

    res.json({
      success: true,
      match: match,
      message: 'Match updated successfully'
    });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
