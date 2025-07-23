import { tournament } from './data.js';

// Simple authentication check
function authenticate(username, password) {
  return username === 'admin' && password === 'admin123';
}

function updateMatchStatusesBasedOnTime() {
  const now = new Date();
  const updatedMatches = [];
  
  tournament.matches.forEach((match, index) => {
    const scheduledTime = new Date(match.scheduledTime);
    const timeDiff = now.getTime() - scheduledTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Auto-start matches that are scheduled for now (within 5 minutes)
    if (match.status === 'upcoming' && minutesDiff >= -5 && minutesDiff <= 5) {
      match.status = 'live';
      tournament.matches[index] = match;
      updatedMatches.push({ ...match, reason: 'auto-started based on schedule' });
    }
  });
  
  return updatedMatches;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, matchId } = req.query;

  // Handle different admin actions
  switch (action) {
    case 'update-statuses':
      if (req.method === 'GET') {
        // Just return current time and upcoming matches for debugging
        const now = new Date();
        const upcomingMatches = tournament.matches
          .filter(m => m.status === 'upcoming')
          .map(m => ({
            id: m.id,
            scheduledTime: m.scheduledTime,
            currentTime: now.toISOString(),
            minutesUntilStart: Math.round((new Date(m.scheduledTime).getTime() - now.getTime()) / (1000 * 60))
          }));
        
        res.json({
          currentTime: now.toISOString(),
          upcomingMatches,
          totalMatches: tournament.matches.length
        });
        return;
      }

      if (req.method === 'POST') {
        try {
          const { username, password } = req.body;

          // Authenticate
          if (!authenticate(username, password)) {
            return res.status(401).json({ message: 'Unauthorized' });
          }

          const updatedMatches = updateMatchStatusesBasedOnTime();
          
          res.json({
            success: true,
            message: `Updated ${updatedMatches.length} matches`,
            updatedMatches
          });
        } catch (error) {
          console.error('Error updating match statuses:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
        return;
      }
      break;

    case 'update-match':
      if (req.method === 'PUT' && matchId) {
        try {
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
        return;
      }
      break;

    case 'start-match':
      if (req.method === 'POST' && matchId) {
        try {
          const { username, password } = req.body;

          if (!authenticate(username, password)) {
            return res.status(401).json({ message: 'Unauthorized' });
          }

          const matchIndex = tournament.matches.findIndex(m => m.id === matchId);
          if (matchIndex === -1) {
            return res.status(404).json({ message: 'Match not found' });
          }

          const match = tournament.matches[matchIndex];
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
        return;
      }
      break;

    default:
      res.status(400).json({ message: 'Invalid action. Use: update-statuses, update-match, or start-match' });
      return;
  }

  res.status(405).json({ message: 'Method not allowed for this action' });
}
