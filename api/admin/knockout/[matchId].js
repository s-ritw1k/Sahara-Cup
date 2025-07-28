import { tournament, defaultAdmin } from '../../data.js';
import fs from 'fs';
import path from 'path';

// Function to save tournament data to file
async function saveTournamentDataToFile(updatedTournament) {
  try {
    const dataFilePath = path.join(process.cwd(), 'server', 'src', 'data', 'tournament-data.js');
    
    // Create the export string with proper formatting
    const dataContent = `export const tournament = ${JSON.stringify(updatedTournament, null, 4)};

                        export const defaultAdmin = {
                            id: 'admin1',
                            username: 'admin',
                            password: '$2a$10$rQzXZo.gOGNVUYyiVRvPE.eJVx3V/wJWD4y8QR4U4F0.F6qFsGz1K', // bcrypt hash of 'admin123'
                            name: 'Tournament Admin'
                        };`;

    await fs.promises.writeFile(dataFilePath, dataContent, 'utf8');
    console.log('Tournament data saved to file successfully');
  } catch (error) {
    console.error('Error saving tournament data to file:', error);
  }
}

// Simple authentication middleware
function authenticateAPI(req, res) {
  const { username, password } = req.body;
  
  // Check if credentials are provided in the request body
  if (!username || !password) {
    return { error: 'Username and password required in request body', status: 401 };
  }

  // Verify credentials with simple string comparison
  if (username !== defaultAdmin.username || password !== 'admin123') {
    return { error: 'Invalid credentials', status: 401 };
  }
  
  return null; // Authentication successful
}

// Helper function to update knockout bracket based on completed matches
function updateKnockoutBracket(tournamentData) {
  if (!tournamentData.knockoutMatches) return;
  
  // Update knockout matches with qualified players from completed matches
  tournamentData.knockoutMatches.forEach(koMatch => {
    // Update based on match sources
    if (koMatch.player1Source && koMatch.player1Source.type === 'match' && !koMatch.player1Id) {
      const sourceMatch = tournamentData.knockoutMatches.find(m => m.id === koMatch.player1Source.value);
      if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
        koMatch.player1Id = sourceMatch.winnerId;
      }
    }
    
    if (koMatch.player2Source && koMatch.player2Source.type === 'match' && !koMatch.player2Id) {
      const sourceMatch = tournamentData.knockoutMatches.find(m => m.id === koMatch.player2Source.value);
      if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
        koMatch.player2Id = sourceMatch.winnerId;
      }
    }
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { matchId } = req.query;

  if (req.method === 'PUT') {
    // Authenticate request
    const authError = authenticateAPI(req, res);
    if (authError) {
      return res.status(authError.status).json({ message: authError.error });
    }

    const { player1Score, player2Score, status, scheduledTime, player1SetScores, player2SetScores } = req.body;

    if (!tournament.knockoutMatches) {
      return res.status(404).json({ message: 'Knockout matches not initialized' });
    }

    const matchIndex = tournament.knockoutMatches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Knockout match not found' });
    }

    const match = tournament.knockoutMatches[matchIndex];
    
    // Update match data
    if (player1Score !== undefined) match.player1Score = parseInt(player1Score) || 0;
    if (player2Score !== undefined) match.player2Score = parseInt(player2Score) || 0;
    if (status !== undefined) match.status = status;
    if (scheduledTime !== undefined) match.scheduledTime = scheduledTime;
    if (player1SetScores !== undefined) match.player1SetScores = player1SetScores;
    if (player2SetScores !== undefined) match.player2SetScores = player2SetScores;

    // Determine winner if match is completed
    if (status === 'completed') {
      match.winnerId = match.player1Score > match.player2Score ? match.player1Id : match.player2Id;
      // Update the bracket to propagate winner to next round
      updateKnockoutBracket(tournament);
    } else {
      match.winnerId = undefined;
    }

    tournament.knockoutMatches[matchIndex] = match;

    // Save data to file after update
    await saveTournamentDataToFile(tournament);

    res.status(200).json(match);
  } else if (req.method === 'GET') {
    // Get specific knockout match
    if (!tournament.knockoutMatches) {
      return res.status(404).json({ message: 'Knockout matches not initialized' });
    }

    const match = tournament.knockoutMatches.find(m => m.id === matchId);
    if (!match) {
      return res.status(404).json({ message: 'Knockout match not found' });
    }

    res.status(200).json(match);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
