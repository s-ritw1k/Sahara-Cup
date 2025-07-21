import { tournament } from './data.js';

function calculateOverallStandings() {
  const standings = [];
  
  // Create standings entry for each player
  tournament.players.forEach(player => {
    const playerMatches = tournament.matches.filter(match => 
      (match.player1Id === player.id || match.player2Id === player.id) && 
      match.status === 'completed'
    );
    
    let wins = 0;
    let losses = 0;
    let setsWon = 0;
    let setsLost = 0;
    
    playerMatches.forEach(match => {
      if (match.player1Id === player.id) {
        setsWon += match.player1Score;
        setsLost += match.player2Score;
        if (match.winnerId === player.id) wins++;
        else losses++;
      } else {
        setsWon += match.player2Score;
        setsLost += match.player1Score;
        if (match.winnerId === player.id) wins++;
        else losses++;
      }
    });
    
    const setRatio = setsLost === 0 ? setsWon : setsWon / setsLost;
    const points = wins * 2; // 2 points for a win
    
    standings.push({
      playerId: player.id,
      playerName: player.name,
      matchesPlayed: playerMatches.length,
      wins,
      losses,
      points,
      setsWon,
      setsLost,
      setRatio: Math.round(setRatio * 100) / 100
    });
  });
  
  // Sort by points (descending), then by set ratio (descending), then by sets won (descending)
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.setRatio !== a.setRatio) return b.setRatio - a.setRatio;
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

  if (req.method === 'GET') {
    const standings = calculateOverallStandings();
    res.status(200).json(standings);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
