import { tournament } from './data.js';

// Helper function to update knockout bracket based on completed matches
function updateKnockoutBracket() {
  if (!tournament.knockoutMatches) return;
  
  // Update knockout matches with qualified players from completed matches
  tournament.knockoutMatches.forEach(koMatch => {
    // Update based on match sources
    if (koMatch.player1Source && koMatch.player1Source.type === 'match' && !koMatch.player1Id) {
      const sourceMatch = tournament.knockoutMatches.find(m => m.id === koMatch.player1Source.value);
      if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
        koMatch.player1Id = sourceMatch.winnerId;
      }
    }
    
    if (koMatch.player2Source && koMatch.player2Source.type === 'match' && !koMatch.player2Id) {
      const sourceMatch = tournament.knockoutMatches.find(m => m.id === koMatch.player2Source.value);
      if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
        koMatch.player2Id = sourceMatch.winnerId;
      }
    }
  });
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Update knockout bracket with latest results
    updateKnockoutBracket();
    
    // Return the knockout matches from the tournament data
    const knockoutMatches = tournament.knockoutMatches || [];
    
    res.status(200).json(knockoutMatches);
  } catch (error) {
    console.error('Error fetching knockout data:', error);
    res.status(500).json({ error: 'Failed to fetch knockout data' });
  }
}
