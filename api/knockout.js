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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return the knockout matches from the tournament data
    const knockoutMatches = tournament.knockoutMatches || [];
    
    res.status(200).json(knockoutMatches);
  } catch (error) {
    console.error('Error fetching knockout data:', error);
    res.status(500).json({ error: 'Failed to fetch knockout data' });
  }
}
