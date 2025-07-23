import { tournament } from './data.js';

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
    const { status, type } = req.query;
    
    // Combine group matches and knockout matches
    let allMatches = [...tournament.matches, ...tournament.knockoutMatches];
    
    // Filter by status if provided (upcoming, live, completed)
    if (status) {
      allMatches = allMatches.filter(match => match.status === status);
    }
    
    // Handle knockout matches only
    if (type === 'knockout') {
      let knockoutMatches = tournament.knockoutMatches;
      if (status) {
        knockoutMatches = knockoutMatches.filter(match => match.status === status);
      }
      res.status(200).json(knockoutMatches);
      return;
    }
    
    // Handle group matches only
    if (type === 'group') {
      let groupMatches = tournament.matches;
      if (status) {
        groupMatches = groupMatches.filter(match => match.status === status);
      }
      res.status(200).json(groupMatches);
      return;
    }
    
    // Return all matches by default
    res.status(200).json(allMatches);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}