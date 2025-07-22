export interface Player {
  id: string;
  name: string;
  email?: string;
}

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  player1SetScores?: number[]; // Individual set scores like [11, 8, 11] for 3 sets
  player2SetScores?: number[]; // Individual set scores like [4, 11, 6] for 3 sets
  scheduledTime: string;
  status: 'upcoming' | 'live' | 'completed';
  groupId: string;
  winnerId?: string;
  round: number;
}

// New knockout match interface
export interface KnockoutMatch {
  id: string;
  round: 'round16' | 'quarterfinal' | 'semifinal' | 'final';
  matchNumber: number; // 1, 2, 3, 4 for round16/quarterfinals, 1, 2 for semifinals, 1 for final
  player1Id?: string; // Can be TBD initially
  player2Id?: string; // Can be TBD initially
  player1Score: number;
  player2Score: number;
  player1SetScores?: number[]; // Individual set scores
  player2SetScores?: number[]; // Individual set scores
  status: 'upcoming' | 'live' | 'completed';
  winnerId?: string;
  scheduledTime?: string;
  // References to previous matches that feed into this match
  player1Source?: { type: 'group' | 'match', value: string, position?: number }; // e.g., { type: 'group', value: 'Group A', position: 1 }
  player2Source?: { type: 'group' | 'match', value: string, position?: number };
}

export interface Group {
  id: string;
  name: string;
  playerIds: string[];
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  groups: Group[];
  matches: Match[];
  players: Player[];
  status: 'upcoming' | 'active' | 'completed';
  knockoutMatches?: KnockoutMatch[]; // Add knockout matches to tournament
}

export interface StandingsEntry {
  playerId: string;
  playerName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  setsWon: number;
  setsLost: number;
  setDifference: number;
}

export interface MatchWithPlayers extends Match {
  player1: Player;
  player2: Player;
}
