import { tournament } from '../../data.js';

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
    const allMatches = [...tournament.matches, ...(tournament.knockoutMatches || [])];
    const liveMatches = allMatches.filter(m => m.status === 'live');
    
    res.status(200).json(liveMatches);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
}
