import { tournament } from './data.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { matchId } = req.query;

  // GET all matches
  if (req.method === 'GET' && !matchId) {
    return res.json({
      groupMatches: tournament.matches,
      knockoutMatches: tournament.knockoutMatches
    });
  }

  // GET specific match
  if (req.method === 'GET' && matchId) {
    const groupMatch = tournament.matches.find(m => m.id === matchId);
    const knockoutMatch = tournament.knockoutMatches.find(m => m.id === matchId);
    
    const match = groupMatch || knockoutMatch;
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    return res.json(match);
  }

  // PUT - Update match schedule
  if (req.method === 'PUT' && matchId) {
    const { scheduledTime } = req.body;
    
    if (!scheduledTime) {
      return res.status(400).json({ error: 'scheduledTime is required' });
    }

    // Validate date format
    const date = new Date(scheduledTime);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format (e.g., 2025-07-18T14:00:00Z)' });
    }

    // Find and update group match
    const groupMatchIndex = tournament.matches.findIndex(m => m.id === matchId);
    if (groupMatchIndex !== -1) {
      // Only allow updating upcoming matches
      if (tournament.matches[groupMatchIndex].status !== 'upcoming') {
        return res.status(400).json({ error: 'Can only update schedule for upcoming matches' });
      }
      
      tournament.matches[groupMatchIndex].scheduledTime = scheduledTime;
      return res.json({
        success: true,
        message: 'Group match schedule updated successfully',
        match: tournament.matches[groupMatchIndex]
      });
    }

    // Find and update knockout match
    const knockoutMatchIndex = tournament.knockoutMatches.findIndex(m => m.id === matchId);
    if (knockoutMatchIndex !== -1) {
      // Only allow updating upcoming matches
      if (tournament.knockoutMatches[knockoutMatchIndex].status !== 'upcoming') {
        return res.status(400).json({ error: 'Can only update schedule for upcoming matches' });
      }
      
      tournament.knockoutMatches[knockoutMatchIndex].scheduledTime = scheduledTime;
      return res.json({
        success: true,
        message: 'Knockout match schedule updated successfully',
        match: tournament.knockoutMatches[knockoutMatchIndex]
      });
    }

    return res.status(404).json({ error: 'Match not found' });
  }

  // POST - Bulk update multiple matches
  if (req.method === 'POST') {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'updates array is required' });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      const { matchId: id, scheduledTime } = update;
      
      if (!id || !scheduledTime) {
        errors.push({ matchId: id, error: 'matchId and scheduledTime are required' });
        continue;
      }

      // Validate date format
      const date = new Date(scheduledTime);
      if (isNaN(date.getTime())) {
        errors.push({ matchId: id, error: 'Invalid date format' });
        continue;
      }

      // Update group match
      const groupMatchIndex = tournament.matches.findIndex(m => m.id === id);
      if (groupMatchIndex !== -1) {
        if (tournament.matches[groupMatchIndex].status !== 'upcoming') {
          errors.push({ matchId: id, error: 'Can only update upcoming matches' });
          continue;
        }
        
        tournament.matches[groupMatchIndex].scheduledTime = scheduledTime;
        results.push({
          matchId: id,
          type: 'group',
          success: true,
          newScheduledTime: scheduledTime
        });
        continue;
      }

      // Update knockout match
      const knockoutMatchIndex = tournament.knockoutMatches.findIndex(m => m.id === id);
      if (knockoutMatchIndex !== -1) {
        if (tournament.knockoutMatches[knockoutMatchIndex].status !== 'upcoming') {
          errors.push({ matchId: id, error: 'Can only update upcoming matches' });
          continue;
        }
        
        tournament.knockoutMatches[knockoutMatchIndex].scheduledTime = scheduledTime;
        results.push({
          matchId: id,
          type: 'knockout',
          success: true,
          newScheduledTime: scheduledTime
        });
        continue;
      }

      errors.push({ matchId: id, error: 'Match not found' });
    }

    return res.json({
      success: results.length > 0,
      updated: results.length,
      failed: errors.length,
      results,
      errors
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
