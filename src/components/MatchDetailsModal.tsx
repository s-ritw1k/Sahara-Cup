import React from 'react';
import { XMarkIcon, TrophyIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import type { KnockoutMatch, Player } from '../types';
import { AnimatedPingPongBall, BouncingBall } from './AnimatedSVGs';

interface MatchDetailsModalProps {
  match: KnockoutMatch;
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  players,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const getPlayerName = (playerId?: string): string => {
    if (!playerId) return 'TBD';
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'TBD';
  };

  const getRoundDisplayName = (round: string): string => {
    switch (round) {
      case 'round16': return 'Round of 16';
      case 'quarterfinal': return 'Quarter Final';
      case 'semifinal': return 'Semi Final';
      case 'final': return 'Final';
      default: return round;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-400 bg-red-900/30';
      case 'upcoming': return 'text-blue-400 bg-blue-900/30';
      case 'completed': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const maxSets = Math.max(
    match.player1SetScores?.length || 0,
    match.player2SetScores?.length || 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-6 rounded-t-2xl border-b border-slate-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <TrophyIcon className="h-8 w-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">
              {getRoundDisplayName(match.round)} - Match {match.matchNumber}
            </h2>
            {match.status === 'live' && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-semibold">LIVE</span>
              </div>
            )}
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
            {match.status.toUpperCase()}
          </div>
        </div>

        {/* Match Info */}
        <div className="p-6">
          {/* Date and Time */}
          {match.scheduledTime && (
            <div className="flex items-center justify-center space-x-6 mb-6 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">
                  {format(new Date(match.scheduledTime), 'EEEE, MMMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300">
                  {format(new Date(match.scheduledTime), 'h:mm a')}
                </span>
              </div>
            </div>
          )}

          {/* Players */}
          <div className="space-y-4 mb-6">
            {/* Player 1 */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              match.status === 'completed' && match.winnerId === match.player1Id
                ? 'bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getPlayerName(match.player1Id)}
                    {match.status === 'completed' && match.winnerId === match.player1Id && (
                      <span className="ml-2 text-yellow-400">👑</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {match.player1Source?.type === 'group' 
                      ? `#${match.player1Source.position} ${match.player1Source.value}`
                      : match.player1Source?.value || 'Qualified'
                    }
                  </p>
                </div>
                {(match.status === 'completed' || match.status === 'live') && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">
                      {match.player1Score}
                      {match.status === 'live' && (
                        <AnimatedPingPongBall className="inline h-6 w-6 ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-slate-400">Sets Won</div>
                  </div>
                )}
              </div>
            </div>

            {/* VS Divider */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-full">
                <span className="text-slate-300 font-bold">VS</span>
                {match.status === 'live' && <BouncingBall className="h-4 w-4" />}
              </div>
            </div>

            {/* Player 2 */}
            <div className={`p-4 rounded-lg border-2 transition-all ${
              match.status === 'completed' && match.winnerId === match.player2Id
                ? 'bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20'
                : 'bg-slate-700/50 border-slate-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {getPlayerName(match.player2Id)}
                    {match.status === 'completed' && match.winnerId === match.player2Id && (
                      <span className="ml-2 text-yellow-400">👑</span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {match.player2Source?.type === 'group' 
                      ? `#${match.player2Source.position} ${match.player2Source.value}`
                      : match.player2Source?.value || 'Qualified'
                    }
                  </p>
                </div>
                {(match.status === 'completed' || match.status === 'live') && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">
                      {match.player2Score}
                      {match.status === 'live' && (
                        <AnimatedPingPongBall className="inline h-6 w-6 ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-slate-400">Sets Won</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Set Scores */}
          {maxSets > 0 && (match.status === 'completed' || match.status === 'live') && (
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span>Individual Set Scores</span>
                {match.status === 'live' && (
                  <span className="ml-2 text-red-400 text-sm">(Live)</span>
                )}
              </h4>
              
              <div className="space-y-3">
                {Array.from({ length: maxSets }, (_, setIndex) => {
                  const p1Score = match.player1SetScores?.[setIndex];
                  const p2Score = match.player2SetScores?.[setIndex];
                  const setWinner = p1Score !== undefined && p2Score !== undefined 
                    ? (p1Score > p2Score ? 'player1' : 'player2')
                    : null;

                  return (
                    <div key={setIndex} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="text-slate-400 font-medium min-w-[80px]">
                        Set {setIndex + 1}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Player 1 Score */}
                        <div className={`text-right min-w-[60px] ${
                          setWinner === 'player1' 
                            ? 'text-green-400 font-bold' 
                            : 'text-slate-300'
                        }`}>
                          {getPlayerName(match.player1Id).split(' ')[0]}
                        </div>
                        
                        <div className={`text-2xl font-bold px-3 py-1 rounded ${
                          setWinner === 'player1' 
                            ? 'text-green-400 bg-green-900/30' 
                            : 'text-slate-300'
                        }`}>
                          {p1Score ?? '-'}
                        </div>
                        
                        <div className="text-slate-500 font-bold">-</div>
                        
                        <div className={`text-2xl font-bold px-3 py-1 rounded ${
                          setWinner === 'player2' 
                            ? 'text-green-400 bg-green-900/30' 
                            : 'text-slate-300'
                        }`}>
                          {p2Score ?? '-'}
                        </div>
                        
                        {/* Player 2 Score */}
                        <div className={`text-left min-w-[60px] ${
                          setWinner === 'player2' 
                            ? 'text-green-400 font-bold' 
                            : 'text-slate-300'
                        }`}>
                          {getPlayerName(match.player2Id).split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {match.status === 'completed' && match.winnerId && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-green-400 font-semibold text-lg mb-1">
                      🏆 Match Winner
                    </div>
                    <div className="text-white font-bold text-xl">
                      {getPlayerName(match.winnerId)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No scores yet */}
          {maxSets === 0 && match.status === 'upcoming' && (
            <div className="text-center py-8 text-slate-400">
              <div className="mb-4">
                <TrophyIcon className="h-12 w-12 mx-auto text-slate-600" />
              </div>
              <p>Match hasn't started yet</p>
              <p className="text-sm">Set scores will appear here once the match begins</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
