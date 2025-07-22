import { tournament } from '../../data.js';

function calculateGroupStandings(groupId) {
  const group = tournament.groups.find(g => g.id === groupId);
  if (!group) {
    return [];
  }

  const standings = group.playerIds.map(playerId => {
    const player = tournament.players.find(p => p.id === playerId);
    const playerMatches = tournament.matches.filter(match => 
      (match.player1Id === playerId || match.player2Id === playerId) && 
      match.status === 'completed' && 
      match.groupId === groupId
    );

    let wins = 0;
    let losses = 0;
    let setsWon = 0;
    let setsLost = 0;

    playerMatches.forEach(match => {
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
    });

    const setDifference = setsWon - setsLost;
    const points = wins * 2; // 2 points for a win

    return {
      playerId,
      playerName: player.name,
      matchesPlayed: playerMatches.length,
      wins,
      losses,
      points,
      setsWon,
      setsLost,
      setDifference: setDifference
    };
  });

  // Sort by points (descending), then by set difference (descending), then by sets won (descending)
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.setDifference !== a.setDifference) return b.setDifference - a.setDifference;
    return b.setsWon - a.setsWon;
  });

  return standings;
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
    const { groupId } = req.query;
    
    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const standings = calculateGroupStandings(groupId);
    
    if (standings.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(standings);
  } catch (error) {
    console.error('Error calculating group standings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
