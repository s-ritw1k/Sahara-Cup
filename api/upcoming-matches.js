import { tournament } from './data.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET all upcoming matches
  if (req.method === 'GET') {
    const upcomingGroupMatches = tournament.matches.filter(m => m.status === 'upcoming');
    const upcomingKnockoutMatches = tournament.knockoutMatches.filter(m => m.status === 'upcoming');
    
    return res.json({
      groupMatches: upcomingGroupMatches,
      knockoutMatches: upcomingKnockoutMatches,
      total: upcomingGroupMatches.length + upcomingKnockoutMatches.length
    });
  }

  // PUT - Bulk reschedule upcoming matches with time gaps
  if (req.method === 'PUT') {
    const { startDate, timeGapMinutes = 30, onlyKnockout = false } = req.body;
    
    if (!startDate) {
      return res.status(400).json({ error: 'startDate is required (ISO 8601 format)' });
    }

    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid startDate format. Use ISO 8601 format (e.g., 2025-07-18T14:00:00Z)' });
    }

    const results = [];
    let currentTime = new Date(date);

    // Update upcoming group matches (unless onlyKnockout is true)
    if (!onlyKnockout) {
      const upcomingGroupMatches = tournament.matches.filter(m => m.status === 'upcoming');
      
      for (const match of upcomingGroupMatches) {
        const matchIndex = tournament.matches.findIndex(m => m.id === match.id);
        tournament.matches[matchIndex].scheduledTime = currentTime.toISOString();
        
        results.push({
          matchId: match.id,
          type: 'group',
          oldTime: match.scheduledTime,
          newTime: currentTime.toISOString(),
          players: [match.player1Id, match.player2Id]
        });
        
        // Add time gap for next match
        currentTime = new Date(currentTime.getTime() + timeGapMinutes * 60 * 1000);
      }
    }

    // Update upcoming knockout matches
    const upcomingKnockoutMatches = tournament.knockoutMatches.filter(m => m.status === 'upcoming');
    
    for (const match of upcomingKnockoutMatches) {
      const matchIndex = tournament.knockoutMatches.findIndex(m => m.id === match.id);
      tournament.knockoutMatches[matchIndex].scheduledTime = currentTime.toISOString();
      
      results.push({
        matchId: match.id,
        type: 'knockout',
        round: match.round,
        oldTime: match.scheduledTime,
        newTime: currentTime.toISOString(),
        players: [match.player1Id, match.player2Id]
      });
      
      // Add time gap for next match
      currentTime = new Date(currentTime.getTime() + timeGapMinutes * 60 * 1000);
    }

    return res.json({
      success: true,
      message: `Successfully rescheduled ${results.length} upcoming matches`,
      startDate: startDate,
      timeGapMinutes: timeGapMinutes,
      rescheduled: results.length,
      matches: results
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
