import { tournament } from '../../data.js';

// Simple authentication check
function authenticate(username, password) {
  return username === 'admin' && password === 'admin123';
}

function updateMatchStatusesBasedOnTime() {
  const now = new Date();
  const updatedMatches = [];
  
  tournament.matches.forEach((match, index) => {
    const scheduledTime = new Date(match.scheduledTime);
    const timeDiff = now.getTime() - scheduledTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Auto-start matches that are scheduled for now (within 5 minutes)
    if (match.status === 'upcoming' && minutesDiff >= -5 && minutesDiff <= 5) {
      match.status = 'live';
      tournament.matches[index] = match;
      updatedMatches.push({ ...match, reason: 'auto-started based on schedule' });
    }
    
    // Auto-complete matches that have been live for more than 60 minutes (failsafe)
    // This is optional - you might want to remove this
    // if (match.status === 'live' && minutesDiff > 60) {
    //   match.status = 'upcoming'; // Reset to upcoming for manual intervention
    //   tournament.matches[index] = match;
    //   updatedMatches.push({ ...match, reason: 'auto-reset after 60 minutes' });
    // }
  });
  
  return updatedMatches;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Just return current time and upcoming matches for debugging
    const now = new Date();
    const upcomingMatches = tournament.matches
      .filter(m => m.status === 'upcoming')
      .map(m => ({
        id: m.id,
        scheduledTime: m.scheduledTime,
        minutesUntilStart: (new Date(m.scheduledTime).getTime() - now.getTime()) / (1000 * 60)
      }));
    
    res.json({
      currentTime: now.toISOString(),
      upcomingMatches
    });
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Authenticate
    if (!authenticate(username, password)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedMatches = updateMatchStatusesBasedOnTime();

    res.json({
      success: true,
      updatedMatches,
      message: `Updated ${updatedMatches.length} matches based on scheduled time`
    });
  } catch (error) {
    console.error('Error updating match statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
