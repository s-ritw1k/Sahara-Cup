import { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { tournamentApi } from '../services/api';
import { SupabaseAPI } from '../services/supabase-api';
import type { KnockoutMatch, Player } from '../types';
import { AnimatedPingPongBall, AnimatedPaddle, AnimatedTrophy, BouncingBall, PingPongSpinner } from '../components/AnimatedSVGs';
import { MatchDetailsModal } from '../components/MatchDetailsModal';

export default function Knockout() {
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<KnockoutMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMatchDetails = (match: KnockoutMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeMatchDetails = () => {
    setSelectedMatch(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
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

    fetchData();

    // Setup Supabase real-time subscriptions
    const subscription = SupabaseAPI.subscribeToKnockoutMatches((matches) => {
      setKnockoutMatches(matches);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Helper function to get player name by ID
  const getPlayerName = (playerId?: string): string => {
    if (!playerId) return 'TBD';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'TBD';
  };

  // Get current live match
  const getCurrentLiveMatch = (): KnockoutMatch | null => {
    return knockoutMatches.find(m => m.status === 'live') || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <PingPongSpinner className="h-12 w-12" />
            <AnimatedPaddle className="h-12 w-12" />
          </div>
          <div className="text-white text-xl flex items-center justify-center space-x-2">
            <span>Loading knockout bracket</span>
            <BouncingBall className="h-5 w-5" />
          </div>
        </div>
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
  const round16Matches = knockoutMatches.filter(m => m.round === 'round16').sort((a, b) => a.matchNumber - b.matchNumber);
  const quarterfinalMatches = knockoutMatches.filter(m => m.round === 'quarterfinal').sort((a, b) => a.matchNumber - b.matchNumber);
  const semifinalMatches = knockoutMatches.filter(m => m.round === 'semifinal').sort((a, b) => a.matchNumber - b.matchNumber);
  const finalMatch = knockoutMatches.find(m => m.round === 'final');
  return (
    <div className="min-h-screen p-6 bg-slate-900">
      {/* Header with Live Match Info */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-3 mb-2">
          <AnimatedPaddle className="h-8 w-8" />
          <h1 className="text-3xl font-bold text-white">KNOCKOUT STAGE</h1>
          <AnimatedTrophy className="h-8 w-8" />
        </div>
        <div className="flex justify-center items-center space-x-2">
          <p className="text-slate-400">Single Elimination Tournament</p>
          <BouncingBall className="h-4 w-4" />
        </div>
        {liveMatch && (
          <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <AnimatedPingPongBall className="h-5 w-5" />
            <span>🔴 LIVE: {getPlayerName(liveMatch.player1Id)} vs {getPlayerName(liveMatch.player2Id)}</span>
            {liveMatch.player1Score > 0 || liveMatch.player2Score > 0 ? 
              <span>(${liveMatch.player1Score}-${liveMatch.player2Score})</span> : null
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
            {round16Matches.map((match) => (
              <div 
                key={match.id} 
                className={`bg-slate-800 border rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-105 hover:shadow-lg ${
                  match.status === 'live' ? 'border-red-500 border-2' : 
                  match.status === 'completed' ? 'border-green-500' : 'border-slate-600'
                }`}
                onClick={() => openMatchDetails(match)}
              >
                <div className={`text-center text-sm font-semibold mb-2 ${
                  match.status === 'live' ? 'text-red-400' : 
                  match.status === 'completed' ? 'text-green-400' : 'text-slate-400'
                }`}>
                  MATCH {match.matchNumber} {match.status === 'live' ? '(LIVE)' : ''}
                </div>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player1Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{getPlayerName(match.player1Id)}</div>
                        <div className="text-xs text-slate-400">
                          {match.player1Source?.type === 'group' ? 
                            `#${match.player1Source.position} ${match.player1Source.value}` : 
                            match.player1Source?.value || 'Qualified'
                          }
                        </div>
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player1Score}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-xs text-slate-500">VS</div>
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player2Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{getPlayerName(match.player2Id)}</div>
                        <div className="text-xs text-slate-400">
                          {match.player2Source?.type === 'group' ? 
                            `#${match.player2Source.position} ${match.player2Source.value}` : 
                            match.player2Source?.value || 'Qualified'
                          }
                        </div>
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player2Score}</div>
                      )}
                    </div>
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
            {quarterfinalMatches.map((match) => (
              <div 
                key={match.id} 
                className={`bg-slate-800 border rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-105 hover:shadow-lg ${
                  match.status === 'live' ? 'border-red-500 border-2' : 
                  match.status === 'completed' ? 'border-orange-500' : 'border-slate-600'
                }`}
                onClick={() => openMatchDetails(match)}
              >
                <div className={`text-center text-sm font-semibold mb-2 ${
                  match.status === 'live' ? 'text-red-400' : 'text-orange-400'
                }`}>
                  QUARTER FINAL {match.matchNumber} {match.status === 'live' ? '(LIVE)' : ''}
                </div>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player1Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{getPlayerName(match.player1Id)}</div>
                        <div className="text-xs text-slate-400">
                          {match.player1Source?.value || 'TBD'}
                        </div>
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player1Score}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-xs text-slate-500">VS</div>
                  <div className={`p-2 rounded text-sm ${
                    match.status === 'completed' && match.winnerId === match.player2Id ? 
                    'bg-green-700 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{getPlayerName(match.player2Id)}</div>
                        <div className="text-xs text-slate-400">
                          {match.player2Source?.value || 'TBD'}
                        </div>
                      </div>
                      {match.status !== 'upcoming' && (
                        <div className="text-lg font-bold">{match.player2Score}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semi Finals - Side by Side */}
        {semifinalMatches.length > 0 && (
          <div className="mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center mb-6">
              SEMI FINALS
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {semifinalMatches.map((match) => (
                <div 
                  key={match.id} 
                  className={`bg-slate-800 border rounded-lg p-6 cursor-pointer transition-all hover:transform hover:scale-105 hover:shadow-lg ${
                    match.status === 'live' ? 'border-red-500 border-2' : 
                    match.status === 'completed' ? 'border-blue-500' : 'border-slate-600'
                  }`}
                  onClick={() => openMatchDetails(match)}
                >
                  <div className={`text-center text-lg font-semibold mb-6 ${
                    match.status === 'live' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    SEMI FINAL {match.matchNumber} {match.status === 'live' ? '🔴 LIVE' : ''}
                  </div>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg text-sm ${
                      match.status === 'completed' && match.winnerId === match.player1Id ? 
                      'bg-blue-700 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">{getPlayerName(match.player1Id)}</div>
                          <div className="text-xs text-slate-400">
                            {match.player1Source?.value || 'TBD'}
                          </div>
                        </div>
                        {match.status !== 'upcoming' && (
                          <div className="text-2xl font-bold text-blue-400">{match.player1Score}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-center text-slate-400 font-bold text-lg">VS</div>
                    <div className={`p-4 rounded-lg text-sm ${
                      match.status === 'completed' && match.winnerId === match.player2Id ? 
                      'bg-blue-700 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">{getPlayerName(match.player2Id)}</div>
                          <div className="text-xs text-slate-400">
                            {match.player2Source?.value || 'TBD'}
                          </div>
                        </div>
                        {match.status !== 'upcoming' && (
                          <div className="text-2xl font-bold text-blue-400">{match.player2Score}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'upcoming' ? 'bg-blue-600 text-white' :
                      match.status === 'live' ? 'bg-red-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {match.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center text-sm text-slate-400 mt-2">
                    {match.scheduledTime && new Date(match.scheduledTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final */}
        {finalMatch && (
          <div className="mb-8">
            <div className="bg-yellow-600 text-white px-4 py-2 rounded font-semibold text-center mb-6">
              CHAMPIONSHIP FINAL
            </div>
            <div className="max-w-lg mx-auto">
              <div 
                className={`bg-slate-800 border rounded-lg p-6 cursor-pointer transition-all hover:transform hover:scale-105 hover:shadow-lg ${
                  finalMatch.status === 'live' ? 'border-red-500 border-2' : 
                  finalMatch.status === 'completed' ? 'border-yellow-500 border-2' : 'border-yellow-500'
                }`}
                onClick={() => openMatchDetails(finalMatch)}
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <TrophyIcon className="h-8 w-8 text-yellow-400 mr-2" />
                    <span className={`text-xl font-bold ${
                      finalMatch.status === 'live' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      SAHARA CUP FINAL {finalMatch.status === 'live' ? '🔴 LIVE' : ''}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg text-sm ${
                    finalMatch.status === 'completed' && finalMatch.winnerId === finalMatch.player1Id ? 
                    'bg-yellow-700 text-white border-2 border-yellow-400' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-lg">{getPlayerName(finalMatch.player1Id)}</div>
                        <div className="text-xs text-slate-400">
                          {finalMatch.player1Source?.value || 'Winner of SF1'}
                        </div>
                      </div>
                      {finalMatch.status !== 'upcoming' && (
                        <div className="text-2xl font-bold text-yellow-400">{finalMatch.player1Score}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-slate-400 font-bold text-lg">VS</div>
                  <div className={`p-4 rounded-lg text-sm ${
                    finalMatch.status === 'completed' && finalMatch.winnerId === finalMatch.player2Id ? 
                    'bg-yellow-700 text-white border-2 border-yellow-400' : 'bg-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-lg">{getPlayerName(finalMatch.player2Id)}</div>
                        <div className="text-xs text-slate-400">
                          {finalMatch.player2Source?.value || 'Winner of SF2'}
                        </div>
                      </div>
                      {finalMatch.status !== 'upcoming' && (
                        <div className="text-2xl font-bold text-yellow-400">{finalMatch.player2Score}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  {finalMatch.status === 'completed' && finalMatch.winnerId ? (
                    <div className="space-y-2">
                      <div className="text-yellow-400 font-bold text-2xl">
                        🏆 SAHARA CUP CHAMPION 🏆
                      </div>
                      <div className="text-white font-bold text-xl">
                        {getPlayerName(finalMatch.winnerId)}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        finalMatch.status === 'upcoming' ? 'bg-yellow-600 text-white' :
                        finalMatch.status === 'live' ? 'bg-red-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {finalMatch.status.toUpperCase()}
                      </span>
                      <div className="text-yellow-400 font-bold text-lg">🏆 SAHARA CUP WINNER 🏆</div>
                    </div>
                  )}
                </div>
                <div className="text-center text-sm text-slate-400 mt-2">
                  {finalMatch.scheduledTime && new Date(finalMatch.scheduledTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          players={players}
          isOpen={isModalOpen}
          onClose={closeMatchDetails}
        />
      )}
    </div>
  );
}
