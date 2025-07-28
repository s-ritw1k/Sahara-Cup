import { tournament, defaultAdmin } from '../../../data.js';
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Authenticate request
  const authError = authenticateAPI(req, res);
  if (authError) {
    return res.status(authError.status).json({ message: authError.error });
  }

  const { matchId } = req.query;
  
  if (!tournament.knockoutMatches) {
    return res.status(404).json({ message: 'Knockout matches not initialized' });
  }

  const matchIndex = tournament.knockoutMatches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Knockout match not found' });
  }

  tournament.knockoutMatches[matchIndex].status = 'live';
  const match = tournament.knockoutMatches[matchIndex];

  // Save data to file after update
  await saveTournamentDataToFile(tournament);

  res.status(200).json(match);
}
