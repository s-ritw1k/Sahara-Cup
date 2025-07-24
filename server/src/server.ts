import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import { tournament, defaultAdmin } from './data/tournament-data.js';
import { Match, StandingsEntry, KnockoutMatch, Group, Player, Tournament } from './types';

dotenv.config();

// Extend Request interface to include admin property
interface AuthenticatedRequest extends Request {
  admin?: any;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? true  // Allow all origins in production
      : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow all origins in production (Vercel will handle CORS)
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// In-memory data store (in production, use a real database)
let tournamentData: Tournament = { ...tournament } as Tournament;

// Calculate standings for a group
function calculateGroupStandings(groupId: string): StandingsEntry[] {
  const group: Group | undefined = tournamentData.groups.find((g: Group) => g.id === groupId);
  if (!group) return [];

  const standings: StandingsEntry[] = group.playerIds.map((playerId: string) => {
    const player: Player | undefined = tournamentData.players.find((p: Player) => p.id === playerId)!;
    const playerMatches: Match[] = tournamentData.matches.filter(
      (m: Match) => (m.player1Id === playerId || m.player2Id === playerId) && 
           m.groupId === groupId && 
           m.status === 'completed'
    );

    let wins = 0;
    let losses = 0;
    let setsWon = 0;
    let setsLost = 0;

    playerMatches.forEach((match: Match) => {
      if (match.player1Id === playerId) {
        setsWon += match.player1Score;
        setsLost += match.player2Score;
        if (match.winnerId === playerId) wins++;
        else losses++;
      } else {
        setsWon += match.player2Score;
        setsLost += match.player1Score;
        if (match.winnerId === playerId) wins++;
        else losses++;
      }
    });

    return {
      playerId,
      playerName: player.name,
      matchesPlayed: playerMatches.length,
      wins,
      losses,
      points: wins * 2, // 2 points per win
      setsWon,
      setsLost,
      setDifference: setsWon - setsLost
    };
  });

  // Sort by points, then by set difference
  return standings.sort((a: StandingsEntry, b: StandingsEntry) => {
    if (a.points !== b.points) return b.points - a.points;
    return b.setDifference - a.setDifference;
  });
}

// Calculate overall standings
function calculateOverallStandings(): StandingsEntry[] {
  // Get group stage standings
  const groupStandings: StandingsEntry[] = tournamentData.groups.flatMap((group: Group) => 
    calculateGroupStandings(group.id)
  );

  // Create a map of player stats from group stage
  const playerStatsMap = new Map<string, StandingsEntry>();
  groupStandings.forEach(standing => {
    playerStatsMap.set(standing.playerId, { ...standing });
  });

  // Add knockout stage results
  if (tournamentData.knockoutMatches) {
    tournamentData.knockoutMatches
      .filter((match: KnockoutMatch) => match.status === 'completed')
      .forEach((match: KnockoutMatch) => {
        // Update player1 stats
        if (match.player1Id) {
          const player1Stats = playerStatsMap.get(match.player1Id);
          if (player1Stats) {
            player1Stats.matchesPlayed += 1;
            player1Stats.setsWon += match.player1Score;
            player1Stats.setsLost += match.player2Score;
            player1Stats.setDifference = player1Stats.setsWon - player1Stats.setsLost;
            
            if (match.winnerId === match.player1Id) {
              player1Stats.wins += 1;
              player1Stats.points += 2; // 2 points per win
            } else {
              player1Stats.losses += 1;
            }
          }
        }

        // Update player2 stats
        if (match.player2Id) {
          const player2Stats = playerStatsMap.get(match.player2Id);
          if (player2Stats) {
            player2Stats.matchesPlayed += 1;
            player2Stats.setsWon += match.player2Score;
            player2Stats.setsLost += match.player1Score;
            player2Stats.setDifference = player2Stats.setsWon - player2Stats.setsLost;
            
            if (match.winnerId === match.player2Id) {
              player2Stats.wins += 1;
              player2Stats.points += 2; // 2 points per win
            } else {
              player2Stats.losses += 1;
            }
          }
        }
      });
  }

  // Convert map back to array and sort
  const allStandings = Array.from(playerStatsMap.values());
  
  return allStandings.sort((a: StandingsEntry, b: StandingsEntry) => {
    if (a.points !== b.points) return b.points - a.points;
    return b.setDifference - a.setDifference;
  });
}

// Simple authentication middleware for direct API calls
function authenticateAPI(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  
  console.log('Authentication attempt:', { username, password });
  console.log('Expected:', { username: defaultAdmin.username, password: 'admin123' });
  
  // Check if credentials are provided in the request body
  if (!username || !password) {
    console.log('Missing credentials');
    return res.status(401).json({ message: 'Username and password required in request body' });
  }

  // Verify credentials with simple string comparison
  if (username !== defaultAdmin.username || password !== 'admin123') {
    console.log('Invalid credentials');
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  console.log('Authentication successful');
  // Authentication successful, proceed to the route handler
  req.admin = { username: defaultAdmin.username, name: defaultAdmin.name };
  next();
}

// Helper function to get qualified players from group standings
function getQualifiedPlayersFromGroups(): { [groupId: string]: { winner: string, runnerUp: string } } {
  const qualifiedPlayers: { [groupId: string]: { winner: string, runnerUp: string } } = {};
  
  tournamentData.groups.forEach((group: Group) => {
    const standings = calculateGroupStandings(group.id);
    if (standings.length >= 2) {
      qualifiedPlayers[group.id] = {
        winner: standings[0].playerId,
        runnerUp: standings[1].playerId
      };
    }
  });
  
  return qualifiedPlayers;
}

// Helper function to update knockout bracket based on completed matches
function updateKnockoutBracket() {
  if (!tournamentData.knockoutMatches) return;
  
  const qualifiedPlayers = getQualifiedPlayersFromGroups();
  
  // Update knockout matches with qualified players
  tournamentData.knockoutMatches?.forEach((koMatch: KnockoutMatch) => {
    // Update player1
    if (koMatch.player1Source && !koMatch.player1Id) {
      if (koMatch.player1Source.type === 'group') {
        const groupId = koMatch.player1Source.value;
        if (qualifiedPlayers[groupId]) {
          if (koMatch.round === 'round16' && (koMatch.matchNumber === 1 || koMatch.matchNumber === 2)) {
            // For matches 1&2, player1 comes from group winner
            koMatch.player1Id = qualifiedPlayers[groupId].winner;
          }
        }
      } else if (koMatch.player1Source.type === 'match') {
        // Find the completed source match
        const sourceMatch: KnockoutMatch | undefined = tournamentData.knockoutMatches?.find((m: KnockoutMatch) => m.id === koMatch.player1Source!.value);
        if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
          koMatch.player1Id = sourceMatch.winnerId;
        }
      }
    }
    
    // Update player2
    if (koMatch.player2Source && !koMatch.player2Id) {
      if (koMatch.player2Source.type === 'group') {
        const groupId = koMatch.player2Source.value;
        if (qualifiedPlayers[groupId]) {
          if (koMatch.round === 'round16' && (koMatch.matchNumber === 1 || koMatch.matchNumber === 2)) {
            // For matches 1&2, player2 comes from group runner-up
            koMatch.player2Id = qualifiedPlayers[groupId].runnerUp;
          }
        }
      } else if (koMatch.player2Source.type === 'match') {
        // Find the completed source match
        const sourceMatch: KnockoutMatch | undefined = tournamentData.knockoutMatches?.find((m: KnockoutMatch) => m.id === koMatch.player2Source!.value);
        if (sourceMatch && sourceMatch.status === 'completed' && sourceMatch.winnerId) {
          koMatch.player2Id = sourceMatch.winnerId;
        }
      }
    }
  });
}

// Routes

// Public routes
app.get('/api/tournament', (req, res) => {
  res.json({
    ...tournamentData,
    // Don't send sensitive admin data
    players: tournamentData.players.map((p: Player) => ({ ...p, email: undefined }))
  });
});

app.get('/api/matches', (req, res) => {
  const { status, type } = req.query as { status?: string; type?: string };
  
  // Combine group matches and knockout matches
  let allMatches = [...tournamentData.matches, ...(tournamentData.knockoutMatches || [])];
  
  // Filter by status if provided (upcoming, live, completed)
  if (status) {
    allMatches = allMatches.filter(match => match.status === status);
  }
  
  // Handle knockout matches only
  if (type === 'knockout') {
    let knockoutMatches: KnockoutMatch[] = tournamentData.knockoutMatches || [];
    if (status) {
      knockoutMatches = knockoutMatches.filter((match: KnockoutMatch) => match.status === status);
    }
    res.json(knockoutMatches);
    return;
  }
  
  // Handle group matches only
  if (type === 'group') {
    let groupMatches: Match[] = tournamentData.matches;
    if (status) {
      groupMatches = groupMatches.filter((match: Match) => match.status === status);
    }
    res.json(groupMatches);
    return;
  }
  
  // Return all matches by default
  res.json(allMatches);
});

app.get('/api/matches/upcoming', (req, res) => {
  const allMatches = [...tournamentData.matches, ...(tournamentData.knockoutMatches || [])];
  const upcomingMatches = allMatches
    .filter(m => m.status === 'upcoming' && m.scheduledTime)
    .sort((a, b) => new Date(a.scheduledTime!).getTime() - new Date(b.scheduledTime!).getTime());
  
  res.json(upcomingMatches);
});

app.get('/api/matches/live', (req, res) => {
  const allMatches = [...tournamentData.matches, ...(tournamentData.knockoutMatches || [])];
  const liveMatches = allMatches.filter(m => m.status === 'live');
  res.json(liveMatches);
});

app.get('/api/standings', (req, res) => {
  const overallStandings = calculateOverallStandings();
  res.json(overallStandings);
});

app.get('/api/standings/group/:groupId', (req, res) => {
  const { groupId } = req.params;
  const groupStandings = calculateGroupStandings(groupId);
  res.json(groupStandings);
});

app.get('/api/groups', (req, res) => {
  res.json(tournamentData.groups);
});

// Knockout routes
app.get('/api/knockout', (req, res) => {
  // Update knockout bracket with latest results
  updateKnockoutBracket();
  res.json(tournamentData.knockoutMatches || []);
});

app.get('/api/knockout/qualified-players', (req, res) => {
  const qualifiedPlayers = getQualifiedPlayersFromGroups();
  res.json(qualifiedPlayers);
});

// Remove the admin login endpoint and verification
// Admin routes now use direct authentication

// Update match scores and status (with username/password in request body)
app.put('/api/admin/matches/:matchId', authenticateAPI, (req: AuthenticatedRequest, res: Response) => {
  const { matchId } = req.params;
  const { player1Score, player2Score, status, scheduledTime } = req.body;

  const matchIndex: number = tournamentData.matches.findIndex((m: Match) => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Match not found' });
  }

  const match = tournamentData.matches[matchIndex];
  
  // Update match data
  if (player1Score !== undefined) match.player1Score = parseInt(player1Score) || 0;
  if (player2Score !== undefined) match.player2Score = parseInt(player2Score) || 0;
  if (status !== undefined) match.status = status;
  if (scheduledTime !== undefined) match.scheduledTime = scheduledTime;

  // Determine winner if match is completed
  if (status === 'completed') {
    match.winnerId = match.player1Score > match.player2Score ? match.player1Id : match.player2Id;
  } else {
    match.winnerId = undefined;
  }

  tournamentData.matches[matchIndex] = match;

  // Emit update to all connected clients
  io.emit('matchUpdated', match);
  io.emit('standingsUpdated', calculateOverallStandings());

  // Update knockout bracket when group matches complete
  if (status === 'completed') {
    updateKnockoutBracket();
    io.emit('knockoutBracketUpdated', tournamentData.knockoutMatches);
  }

  res.json(match);
});

app.post('/api/admin/matches/:matchId/start', authenticateAPI, (req: AuthenticatedRequest, res: Response) => {
  const { matchId } = req.params;
  
  const matchIndex: number = tournamentData.matches.findIndex((m: Match) => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Match not found' });
  }

  tournamentData.matches[matchIndex].status = 'live';
  const match = tournamentData.matches[matchIndex];

  io.emit('matchUpdated', match);
  res.json(match);
});

// Knockout match management endpoints
app.put('/api/admin/knockout/:matchId', authenticateAPI, (req: AuthenticatedRequest, res: Response) => {
  const { matchId } = req.params;
  const { player1Score, player2Score, status, scheduledTime } = req.body;

  if (!tournamentData.knockoutMatches) {
    return res.status(404).json({ message: 'Knockout matches not initialized' });
  }

  const matchIndex: number = tournamentData.knockoutMatches.findIndex((m: KnockoutMatch) => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Knockout match not found' });
  }

  const match = tournamentData.knockoutMatches[matchIndex];
  
  // Update match data
  if (player1Score !== undefined) match.player1Score = parseInt(player1Score) || 0;
  if (player2Score !== undefined) match.player2Score = parseInt(player2Score) || 0;
  if (status !== undefined) match.status = status;
  if (scheduledTime !== undefined) match.scheduledTime = scheduledTime;

  // Determine winner if match is completed
  if (status === 'completed') {
    match.winnerId = match.player1Score > match.player2Score ? match.player1Id : match.player2Id;
    // Update the bracket to propagate winner to next round
    updateKnockoutBracket();
  } else {
    match.winnerId = undefined;
  }

  tournamentData.knockoutMatches[matchIndex] = match;

  // Emit update to all connected clients
  io.emit('knockoutMatchUpdated', match);
  io.emit('knockoutBracketUpdated', tournamentData.knockoutMatches);

  res.json(match);
});

app.post('/api/admin/knockout/:matchId/start', authenticateAPI, (req: AuthenticatedRequest, res: Response) => {
  const { matchId } = req.params;
  
  if (!tournamentData.knockoutMatches) {
    return res.status(404).json({ message: 'Knockout matches not initialized' });
  }

  const matchIndex: number = tournamentData.knockoutMatches.findIndex((m: KnockoutMatch) => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Knockout match not found' });
  }

  tournamentData.knockoutMatches[matchIndex].status = 'live';
  const match = tournamentData.knockoutMatches[matchIndex];

  io.emit('knockoutMatchUpdated', match);
  res.json(match);
});

// Admin endpoint to manually set knockout match players (useful for manual bracket setup)
app.put('/api/admin/knockout/:matchId/players', authenticateAPI, (req: AuthenticatedRequest, res: Response) => {
  const { matchId } = req.params;
  const { player1Id, player2Id } = req.body;

  if (!tournamentData.knockoutMatches) {
    return res.status(404).json({ message: 'Knockout matches not initialized' });
  }

  const matchIndex: number = tournamentData.knockoutMatches.findIndex((m: KnockoutMatch) => m.id === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ message: 'Knockout match not found' });
  }

  const match = tournamentData.knockoutMatches[matchIndex];
  
  // Validate players exist
  if (player1Id && !tournamentData.players.find((p: Player) => p.id === player1Id)) {
    return res.status(400).json({ message: 'Player 1 not found' });
  }
  if (player2Id && !tournamentData.players.find((p: Player) => p.id === player2Id)) {
    return res.status(400).json({ message: 'Player 2 not found' });
  }

  match.player1Id = player1Id;
  match.player2Id = player2Id;
  
  tournamentData.knockoutMatches[matchIndex] = match;

  // Emit update to all connected clients
  io.emit('knockoutMatchUpdated', match);
  io.emit('knockoutBracketUpdated', tournamentData.knockoutMatches);

  res.json(match);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Send current data to newly connected client
  socket.emit('tournamentData', tournamentData);
  socket.emit('standingsUpdate', calculateOverallStandings());
});

// Start server (only in development or when not running on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`🏓 Sahara Cup server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
  });
}

export default app;
