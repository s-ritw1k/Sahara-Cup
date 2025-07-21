import { tournament } from '../data.js';

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
    const liveMatches = tournament.matches.filter(match => match.status === 'live');
    res.status(200).json(liveMatches);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
