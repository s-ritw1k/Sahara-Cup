import { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { tournamentApi } from '../services/api';
import { socketService } from '../services/socket';
import type { KnockoutMatch, Player } from '../types';

export default function Knockout() {
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [qualifiedPlayers, setQualifiedPlayers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [knockoutData, tournamentData, qualifiedData] = await Promise.all([
          tournamentApi.getKnockout(),
          tournamentApi.getTournament(),
          tournamentApi.getQualifiedPlayers(),
        ]);
        
        setKnockoutMatches(knockoutData);
        setPlayers(tournamentData.players);
        setQualifiedPlayers(qualifiedData);
      } catch (err) {
        setError('Failed to load knockout data');
        console.error('Error fetching knockout data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup socket for real-time updates
    socketService.connect();
    
    const handleKnockoutMatchUpdate = (match: KnockoutMatch) => {
      setKnockoutMatches(prev => 
        prev.map(m => m.id === match.id ? match : m)
      );
    };

    const handleKnockoutBracketUpdate = (matches: KnockoutMatch[]) => {
      setKnockoutMatches(matches);
    };

    socketService.on('knockoutMatchUpdated', handleKnockoutMatchUpdate);
    socketService.on('knockoutBracketUpdated', handleKnockoutBracketUpdate);

    return () => {
      socketService.off('knockoutMatchUpdated', handleKnockoutMatchUpdate);
      socketService.off('knockoutBracketUpdated', handleKnockoutBracketUpdate);
    };
  }, []);

  // Helper function to get player name by ID
  const getPlayerName = (playerId?: string): string => {
    if (!playerId) return 'TBD';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'TBD';
  };

  // Helper function to get match by round and number
  const getMatch = (round: string, matchNumber: number): KnockoutMatch | undefined => {
    return knockoutMatches.find(m => m.round === round && m.matchNumber === matchNumber);
  };

  // Get current live match
  const getCurrentLiveMatch = (): KnockoutMatch | null => {
    return knockoutMatches.find(m => m.status === 'live') || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading knockout bracket...</div>
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

  const liveMatch = getCurrentLiveMatch();
  const round16Matches = knockoutMatches.filter(m => m.round === 'round16');
  const quarterfinalMatches = knockoutMatches.filter(m => m.round === 'quarterfinal');
  const semifinalMatches = knockoutMatches.filter(m => m.round === 'semifinal');
  const finalMatch = knockoutMatches.find(m => m.round === 'final');
  return (
    <div className="min-h-screen p-6 bg-slate-900">
      {/* Header with Live Match Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">KNOCKOUT STAGE</h1>
        <p className="text-slate-400">Single Elimination Tournament</p>
        {liveMatch && (
          <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg inline-block">
            🔴 LIVE: {getPlayerName(liveMatch.player1Id)} vs {getPlayerName(liveMatch.player2Id)}
            {liveMatch.player1Score > 0 || liveMatch.player2Score > 0 ? 
              ` (${liveMatch.player1Score}-${liveMatch.player2Score})` : ''
            }
          </div>
        )}
      </div>

      {/* Clean Tournament Bracket - No Arrows */}
      <div className="max-w-6xl mx-auto">
        
        {/* Round of 16 */}
        <div className="mb-8">
          <div className="bg-green-600 text-white px-4 py-2 rounded font-semibold text-center mb-4">
            ROUND OF 16
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {round16Matches.map((match, index) => (
              <div key={match.id} className={`bg-slate-800 border rounded-lg p-4 ${
                match.status === 'live' ? 'border-red-500 border-2' : 
                match.status === 'completed' ? 'border-green-500' : 'border-slate-600'
              }`}>
                <div className={`text-center text-sm font-semibold mb-2 ${
                  match.status === 'live' ? 'text-red-400' : 
                  match.status === 'completed' ? 'text-green-400' : 'text-slate-400'
                }`}>
                  MATCH {index + 1} {match.status === 'live' ? '(LIVE)' : ''}
                </div>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player1Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="font-semibold">{getPlayerName(match.player1Id)}</div>
                    <div className="text-xs text-slate-400">
                      {match.player1Source?.type === 'group' ? 
                        `#1 Group ${match.player1Source.value.slice(-1).toUpperCase()}` : 
                        'Qualified'
                      }
                    </div>
                    {match.status !== 'upcoming' && (
                      <div className="text-lg font-bold">{match.player1Score}</div>
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-500">VS</div>
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player2Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="font-semibold">{getPlayerName(match.player2Id)}</div>
                    <div className="text-xs text-slate-400">
                      {match.player2Source?.type === 'group' ? 
                        `#2 Group ${match.player2Source.value.slice(-1).toUpperCase()}` : 
                        'Qualified'
                      }
                    </div>
                    {match.status !== 'upcoming' && (
                      <div className="text-lg font-bold">{match.player2Score}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarter Finals */}
        <div className="mb-8">
          <div className="bg-orange-600 text-white px-4 py-2 rounded font-semibold text-center mb-4">
            QUARTER FINALS
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {quarterfinalMatches.map((match, index) => (
              <div key={match.id} className={`bg-slate-800 border rounded-lg p-4 ${
                match.status === 'live' ? 'border-red-500 border-2' : 
                match.status === 'completed' ? 'border-orange-500' : 'border-slate-600'
              }`}>
                <div className={`text-center text-sm font-semibold mb-2 ${
                  match.status === 'live' ? 'text-red-400' : 'text-orange-400'
                }`}>
                  QUARTER FINAL {index + 1} {match.status === 'live' ? '(LIVE)' : ''}
                </div>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player1Id ? 
                    'bg-orange-700 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <div className="font-semibold">{getPlayerName(match.player1Id)}</div>
                    <div className="text-xs text-slate-500">
                      {match.player1Id ? 'Qualified' : 'Winner of Match 1'}
                    </div>
                    {match.status !== 'upcoming' && (
                      <div className="text-lg font-bold">{match.player1Score}</div>
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-500">VS</div>
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player2Id ? 
                    'bg-orange-700 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <div className="font-semibold">{getPlayerName(match.player2Id)}</div>
                    <div className="text-xs text-slate-500">
                      {match.player2Id ? 'Qualified' : 'Winner of Match 2'}
                    </div>
                    {match.status !== 'upcoming' && (
                      <div className="text-lg font-bold">{match.player2Score}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semi Finals */}
        {semifinalMatches.length > 0 && (
          <div className="mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center mb-4">
              SEMI FINALS
            </div>
            <div className="max-w-md mx-auto">
              {semifinalMatches.map((match) => (
                <div key={match.id} className={`bg-slate-800 border rounded-lg p-4 ${
                  match.status === 'live' ? 'border-red-500 border-2' : 
                  match.status === 'completed' ? 'border-blue-500' : 'border-slate-600'
                }`}>
                  <div className={`text-center text-sm font-semibold mb-2 ${
                    match.status === 'live' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    SEMI FINAL {match.status === 'live' ? '(LIVE)' : ''}
                  </div>
                  <div className="space-y-2">
                    <div className={`p-2 rounded text-sm ${
                      match.status === 'completed' && match.winnerId === match.player1Id ? 
                      'bg-blue-700 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      <div className="font-semibold">{getPlayerName(match.player1Id)}</div>
                      <div className="text-xs text-slate-500">
                        {match.player1Id ? 'Qualified' : 'Winner of QF1'}
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player1Score}</div>
                      )}
                    </div>
                    <div className="text-center text-xs text-slate-500">VS</div>
                    <div className={`p-2 rounded text-sm ${
                      match.status === 'completed' && match.winnerId === match.player2Id ? 
                      'bg-blue-700 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      <div className="font-semibold">{getPlayerName(match.player2Id)}</div>
                      <div className="text-xs text-slate-500">
                        {match.player2Id ? 'Qualified' : 'Winner of QF2'}
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player2Score}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final */}
        {finalMatch && (
          <div className="mb-8">
            <div className="bg-yellow-600 text-black px-4 py-2 rounded font-semibold text-center mb-4">
              FINAL
            </div>
            <div className="max-w-md mx-auto">
              <div className={`bg-slate-800 border-2 rounded-lg p-6 ${
                finalMatch.status === 'live' ? 'border-red-500' : 
                finalMatch.status === 'completed' ? 'border-yellow-500' : 'border-yellow-500'
              }`}>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <TrophyIcon className="h-6 w-6 text-yellow-400 mr-2" />
                    <span className={`text-lg font-bold ${
                      finalMatch.status === 'live' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      CHAMPIONSHIP MATCH {finalMatch.status === 'live' ? '(LIVE)' : ''}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className={`p-3 rounded text-center ${
                    finalMatch.status === 'completed' && finalMatch.winnerId === finalMatch.player1Id ? 
                    'bg-yellow-700 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <div className="font-semibold">{getPlayerName(finalMatch.player1Id)}</div>
                    <div className="text-sm text-slate-500">
                      {finalMatch.player1Id ? 'Champion Finalist' : 'Winner of Semi Final'}
                    </div>
                    {finalMatch.status !== 'upcoming' && (
                      <div className="text-xl font-bold">{finalMatch.player1Score}</div>
                    )}
                  </div>
                  <div className="text-center text-yellow-400 font-bold">VS</div>
                  <div className={`p-3 rounded text-center ${
                    finalMatch.status === 'completed' && finalMatch.winnerId === finalMatch.player2Id ? 
                    'bg-yellow-700 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <div className="font-semibold">{getPlayerName(finalMatch.player2Id)}</div>
                    <div className="text-sm text-slate-500">
                      {finalMatch.player2Id ? 'Champion Finalist' : 'Winner of Semi Final'}
                    </div>
                    {finalMatch.status !== 'upcoming' && (
                      <div className="text-xl font-bold">{finalMatch.player2Score}</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  {finalMatch.status === 'completed' && finalMatch.winnerId ? (
                    <div className="text-yellow-400 font-bold text-xl">
                      🏆 CHAMPION: {getPlayerName(finalMatch.winnerId)} 🏆
                    </div>
                  ) : (
                    <div className="text-yellow-400 font-bold">🏆 SAHARA CUP WINNER 🏆</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
