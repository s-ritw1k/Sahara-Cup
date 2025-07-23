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
    
    let matches = tournament.matches;
    
    // Filter by status if provided (upcoming, live, completed)
    if (status) {
      matches = matches.filter(match => match.status === status);
    }
    
    // Handle knockout matches
    if (type === 'knockout') {
      res.status(200).json(tournament.knockoutMatches);
      return;
    }
    
    res.status(200).json(matches);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}