import { useState, useEffect } from 'react';
import { TrophyIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { tournamentApi, adminApi } from '../services/api';
import type { KnockoutMatch, Player } from '../types';

export default function KnockoutAdmin() {
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [knockoutData, tournamentData] = await Promise.all([
        tournamentApi.getKnockout(),
        tournamentApi.getTournament(),
      ]);
      
      setKnockoutMatches(knockoutData);
      setPlayers(tournamentData.players);
    } catch (err) {
      setError('Failed to load knockout data');
      console.error('Error fetching knockout data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get player name by ID
  const getPlayerName = (playerId?: string): string => {
    if (!playerId) return 'TBD';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'TBD';
  };

  const handleStartMatch = async (matchId: string) => {
    if (!credentials.username || !credentials.password) {
      alert('Please enter admin credentials');
      return;
    }

    try {
      await adminApi.startKnockoutMatch(matchId, credentials);
      await fetchData(); // Refresh data
      alert('Match started successfully!');
    } catch (err) {
      alert('Failed to start match. Check credentials.');
      console.error('Error starting match:', err);
    }
  };

  const handleUpdateMatch = async (matchId: string, player1Score: number, player2Score: number, status: string) => {
    if (!credentials.username || !credentials.password) {
      alert('Please enter admin credentials');
      return;
    }

    try {
      await adminApi.updateKnockoutMatch(matchId, {
        player1Score,
        player2Score,
        status,
        username: credentials.username,
        password: credentials.password,
      });
      await fetchData(); // Refresh data
      alert('Match updated successfully!');
    } catch (err) {
      alert('Failed to update match. Check credentials.');
      console.error('Error updating match:', err);
    }
  };

  const handleSetPlayers = async (matchId: string, player1Id?: string, player2Id?: string) => {
    if (!credentials.username || !credentials.password) {
      alert('Please enter admin credentials');
      return;
    }

    try {
      await adminApi.setKnockoutMatchPlayers(matchId, {
        player1Id,
        player2Id,
        username: credentials.username,
        password: credentials.password,
      });
      await fetchData(); // Refresh data
      alert('Players set successfully!');
    } catch (err) {
      alert('Failed to set players. Check credentials.');
      console.error('Error setting players:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading knockout admin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">KNOCKOUT ADMIN PANEL</h1>
          <p className="text-slate-400">Manage Tournament Matches & Scores</p>
        </div>

        {/* Admin Credentials */}
        <div className="bg-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Admin Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter admin username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>
          </div>
        </div>

        {/* Knockout Matches */}
        <div className="space-y-8">
          {/* Round of 16 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <div className="bg-green-600 px-3 py-1 rounded mr-3">R16</div>
              Round of 16 Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knockoutMatches.filter(m => m.round === 'round16').map((match) => (
                <MatchAdminCard
                  key={match.id}
                  match={match}
                  players={players}
                  onStartMatch={handleStartMatch}
                  onUpdateMatch={handleUpdateMatch}
                  onSetPlayers={handleSetPlayers}
                  getPlayerName={getPlayerName}
                />
              ))}
            </div>
          </div>

          {/* Quarter Finals */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <div className="bg-orange-600 px-3 py-1 rounded mr-3">QF</div>
              Quarter Final Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knockoutMatches.filter(m => m.round === 'quarterfinal').map((match) => (
                <MatchAdminCard
                  key={match.id}
                  match={match}
                  players={players}
                  onStartMatch={handleStartMatch}
                  onUpdateMatch={handleUpdateMatch}
                  onSetPlayers={handleSetPlayers}
                  getPlayerName={getPlayerName}
                />
              ))}
            </div>
          </div>

          {/* Semi Finals */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <div className="bg-blue-600 px-3 py-1 rounded mr-3">SF</div>
              Semi Final Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knockoutMatches.filter(m => m.round === 'semifinal').map((match) => (
                <MatchAdminCard
                  key={match.id}
                  match={match}
                  players={players}
                  onStartMatch={handleStartMatch}
                  onUpdateMatch={handleUpdateMatch}
                  onSetPlayers={handleSetPlayers}
                  getPlayerName={getPlayerName}
                />
              ))}
            </div>
          </div>

          {/* Final */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-400 mr-2" />
              <div className="bg-yellow-600 text-black px-3 py-1 rounded mr-3">F</div>
              Championship Final
            </h2>
            <div className="max-w-2xl mx-auto">
              {knockoutMatches.filter(m => m.round === 'final').map((match) => (
                <MatchAdminCard
                  key={match.id}
                  match={match}
                  players={players}
                  onStartMatch={handleStartMatch}
                  onUpdateMatch={handleUpdateMatch}
                  onSetPlayers={handleSetPlayers}
                  getPlayerName={getPlayerName}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Match Admin Card Component
interface MatchAdminCardProps {
  match: KnockoutMatch;
  players: Player[];
  onStartMatch: (matchId: string) => void;
  onUpdateMatch: (matchId: string, player1Score: number, player2Score: number, status: string) => void;
  onSetPlayers: (matchId: string, player1Id?: string, player2Id?: string) => void;
  getPlayerName: (playerId?: string) => string;
}

function MatchAdminCard({ 
  match, 
  players, 
  onStartMatch, 
  onUpdateMatch, 
  onSetPlayers, 
  getPlayerName 
}: MatchAdminCardProps) {
  const [player1Score, setPlayer1Score] = useState(match.player1Score);
  const [player2Score, setPlayer2Score] = useState(match.player2Score);
  const [selectedPlayer1, setSelectedPlayer1] = useState(match.player1Id || '');
  const [selectedPlayer2, setSelectedPlayer2] = useState(match.player2Id || '');

  useEffect(() => {
    setPlayer1Score(match.player1Score);
    setPlayer2Score(match.player2Score);
    setSelectedPlayer1(match.player1Id || '');
    setSelectedPlayer2(match.player2Id || '');
  }, [match]);

  const getRoundColor = () => {
    switch (match.round) {
      case 'round16': return 'border-green-500';
      case 'quarterfinal': return 'border-orange-500';
      case 'semifinal': return 'border-blue-500';
      case 'final': return 'border-yellow-500';
      default: return 'border-slate-600';
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'live': return 'border-red-500 border-2';
      case 'completed': return getRoundColor();
      default: return 'border-slate-600';
    }
  };

  return (
    <div className={`bg-slate-800 border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">
          {match.round.toUpperCase()} {match.matchNumber}
        </h3>
        <div className={`px-2 py-1 rounded text-xs font-semibold ${
          match.status === 'live' ? 'bg-red-600 text-white' :
          match.status === 'completed' ? 'bg-green-600 text-white' :
          'bg-slate-600 text-slate-300'
        }`}>
          {match.status.toUpperCase()}
        </div>
      </div>

      {/* Player Selection (for manually setting players) */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Player 1</label>
          <select
            value={selectedPlayer1}
            onChange={(e) => setSelectedPlayer1(e.target.value)}
            className="w-full p-2 bg-slate-700 text-white rounded text-sm border border-slate-600"
          >
            <option value="">Select Player 1</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Player 2</label>
          <select
            value={selectedPlayer2}
            onChange={(e) => setSelectedPlayer2(e.target.value)}
            className="w-full p-2 bg-slate-700 text-white rounded text-sm border border-slate-600"
          >
            <option value="">Select Player 2</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
        </div>
        {(selectedPlayer1 !== match.player1Id || selectedPlayer2 !== match.player2Id) && (
          <button
            onClick={() => onSetPlayers(match.id, selectedPlayer1, selectedPlayer2)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
          >
            Set Players
          </button>
        )}
      </div>

      {/* Current Match Display */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-white font-semibold">{getPlayerName(match.player1Id)}</span>
          <input
            type="number"
            value={player1Score}
            onChange={(e) => setPlayer1Score(parseInt(e.target.value) || 0)}
            className="w-16 p-1 bg-slate-600 text-white text-center rounded"
            min="0"
          />
        </div>
        <div className="text-center text-slate-400 text-sm">VS</div>
        <div className="flex justify-between items-center bg-slate-700 p-2 rounded">
          <span className="text-white font-semibold">{getPlayerName(match.player2Id)}</span>
          <input
            type="number"
            value={player2Score}
            onChange={(e) => setPlayer2Score(parseInt(e.target.value) || 0)}
            className="w-16 p-1 bg-slate-600 text-white text-center rounded"
            min="0"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {match.status === 'upcoming' && match.player1Id && match.player2Id && (
          <button
            onClick={() => onStartMatch(match.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Start Match
          </button>
        )}
        
        {match.status === 'live' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateMatch(match.id, player1Score, player2Score, 'live')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
            >
              Update Score
            </button>
            <button
              onClick={() => onUpdateMatch(match.id, player1Score, player2Score, 'completed')}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
            >
              <StopIcon className="h-4 w-4 mr-1" />
              End Match
            </button>
          </div>
        )}

        {match.status === 'completed' && (
          <div className="text-center text-green-400 font-semibold">
            Winner: {getPlayerName(match.winnerId)}
          </div>
        )}
      </div>
    </div>
  );
}
