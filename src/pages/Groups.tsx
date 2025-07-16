import { useState } from 'react';
import { useTournament } from '../hooks/useData';
import { tournamentApi } from '../services/api';
import { 
  UserGroupIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import type { StandingsEntry } from '../types';

export default function Groups() {
  const { tournament, loading } = useTournament();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [groupStandings, setGroupStandings] = useState<StandingsEntry[]>([]);
  const [loadingGroupStandings, setLoadingGroupStandings] = useState(false);

  const fetchGroupStandings = async (groupId: string) => {
    setLoadingGroupStandings(true);
    try {
      const standings = await tournamentApi.getGroupStandings(groupId);
      setGroupStandings(standings);
      setSelectedGroup(groupId);
    } catch (error) {
      console.error('Failed to fetch group standings:', error);
    } finally {
      setLoadingGroupStandings(false);
    }
  };

  const getGroupStats = (groupId: string) => {
    const groupMatches = tournament?.matches.filter(m => m.groupId === groupId) || [];
    const completedMatches = groupMatches.filter(m => m.status === 'completed');
    const liveMatches = groupMatches.filter(m => m.status === 'live');
    const upcomingMatches = groupMatches.filter(m => m.status === 'upcoming');
    const progress = groupMatches.length > 0 ? (completedMatches.length / groupMatches.length) * 100 : 0;
    
    return {
      totalMatches: groupMatches.length,
      completed: completedMatches.length,
      live: liveMatches.length,
      upcoming: upcomingMatches.length,
      progress,
      nextMatch: upcomingMatches.sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0]
    };
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-table-green-600 mx-auto"></div>
          <p className="mt-4 text-pro-dark-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load tournament data</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {!selectedGroup ? (
        // Groups Overview - Show all groups in a grid
        <>
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-table-green-500 mr-3 animate-float-gentle" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-table-green-200 to-white bg-clip-text text-transparent">
                  Tournament Groups
                </h1>
              </div>
              <div className="flex items-center space-x-2 bg-pro-dark-800/50 px-4 py-2 rounded-tournament">
                <TrophyIcon className="h-5 w-5 text-table-green-400" />
                <span className="text-table-green-400 text-sm font-medium">{tournament.groups.length} Groups</span>
              </div>
            </div>
            <p className="text-pro-dark-300 text-lg">
              Click on any group to view detailed standings, match results, and upcoming fixtures
            </p>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tournament.groups.map((group, index) => {
              const stats = getGroupStats(group.id);
              const isCompleted = stats.progress === 100;
              const hasLiveMatches = stats.live > 0;
              
              return (
                <div 
                  key={group.id}
                  className="group cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => fetchGroupStandings(group.id)}
                >
                  <div className={`
                    card-hover p-6 transition-all duration-500 relative overflow-hidden h-full
                    ${hasLiveMatches ? 'border-l-4 border-red-500 bg-gradient-to-r from-red-900/20 via-pro-dark-900 to-pro-dark-900 shadow-glow-red' : 
                      isCompleted ? 'border-l-4 border-table-green-500 bg-gradient-to-r from-table-green-900/20 via-pro-dark-900 to-pro-dark-900' :
                      'border-l-4 border-table-green-600/30 hover:border-table-green-500'}
                    group-hover:scale-105 group-hover:shadow-tournament-xl
                  `}>
                    
                    {/* Live indicator */}
                    {hasLiveMatches && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-glow"></div>
                          <span className="text-xs text-red-400 font-bold">LIVE</span>
                        </div>
                      </div>
                    )}

                    {/* Completion badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-6 h-6 bg-table-green-500 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Group Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-table-green-300 transition-colors duration-300">
                        {group.name}
                      </h3>
                      <div className="flex items-center text-pro-dark-400 text-sm">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>{group.playerIds.length} Players</span>
                      </div>
                    </div>

                    {/* Players Preview */}
                    <div className="mb-6 space-y-3">
                      {group.playerIds.slice(0, 3).map((playerId, playerIndex) => {
                        const player = tournament.players.find(p => p.id === playerId);
                        return (
                          <div key={playerId} className="flex items-center text-sm">
                            <div className={`w-3 h-3 rounded-full mr-3 border-2 ${
                              playerIndex === 0 ? 'bg-champion-gold-400 border-champion-gold-300 shadow-glow-gold' :
                              playerIndex === 1 ? 'bg-gray-300 border-gray-200 shadow-lg' :
                              'bg-orange-400 border-orange-300 shadow-lg'
                            }`}></div>
                            <span className="text-pro-dark-200 group-hover:text-white transition-colors duration-300 font-medium">
                              {player?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Match Statistics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-table-green-400">{stats.completed}</div>
                        <div className="text-xs text-pro-dark-400">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{stats.upcoming}</div>
                        <div className="text-xs text-pro-dark-400">Upcoming</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{stats.live}</div>
                        <div className="text-xs text-pro-dark-400">Live</div>
                      </div>
                    </div>

                    {/* Next Match Info */}
                    {stats.nextMatch && (
                      <div className="mt-4 pt-4 border-t border-pro-dark-700">
                        <div className="flex items-center text-xs text-pro-dark-400">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>Next: {format(new Date(stats.nextMatch.scheduledTime), 'MMM dd, HH:mm')}</span>
                        </div>
                      </div>
                    )}

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-table-green-500/5 via-transparent to-table-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="card p-6 text-center">
              <FireIcon className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {tournament.groups.reduce((acc, group) => acc + getGroupStats(group.id).live, 0)}
              </div>
              <p className="text-pro-dark-400">Live Matches</p>
            </div>

            <div className="card p-6 text-center">
              <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {tournament.groups.reduce((acc, group) => acc + getGroupStats(group.id).upcoming, 0)}
              </div>
              <p className="text-pro-dark-400">Upcoming</p>
            </div>

            <div className="card p-6 text-center">
              <CheckCircleIcon className="h-8 w-8 text-table-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {tournament.groups.reduce((acc, group) => acc + getGroupStats(group.id).completed, 0)}
              </div>
              <p className="text-pro-dark-400">Completed</p>
            </div>

            <div className="card p-6 text-center">
              <TrophyIcon className="h-8 w-8 text-champion-gold-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-champion-gold-400 mb-1">
                {tournament.groups.filter(group => getGroupStats(group.id).progress === 100).length}
              </div>
              <p className="text-pro-dark-400">Groups Complete</p>
            </div>
          </div>
        </>
      ) : (
        // Group Detail View - Show detailed information for selected group
        <>
          {/* Back Button and Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setSelectedGroup('')}
                className="flex items-center text-table-green-400 hover:text-table-green-300 transition-colors duration-300 group"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Groups</span>
              </button>
              
              {loadingGroupStandings && (
                <div className="flex items-center text-pro-dark-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-table-green-600 mr-2"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-4">
              <TrophyIcon className="h-8 w-8 text-table-green-500 mr-3 animate-float-gentle" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-table-green-200 to-white bg-clip-text text-transparent">
                {tournament.groups.find(g => g.id === selectedGroup)?.name} Details
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standings Table */}
            <div className="lg:col-span-2">
              <div className="card p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <ChartBarIcon className="h-6 w-6 mr-2 text-table-green-500" />
                    Group Standings
                  </h2>
                </div>

                {loadingGroupStandings ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-table-green-600 mx-auto mb-4"></div>
                    <p className="text-pro-dark-400">Loading standings...</p>
                  </div>
                ) : groupStandings.length === 0 ? (
                  <div className="text-center py-12">
                    <ChartBarIcon className="h-12 w-12 text-pro-dark-600 mx-auto mb-4" />
                    <p className="text-pro-dark-400">No standings data available yet</p>
                    <p className="text-sm text-pro-dark-500 mt-2">Matches need to be completed first</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-pro-dark-700">
                          <th className="text-left py-4 px-4 text-pro-dark-400 font-semibold">Rank</th>
                          <th className="text-left py-4 px-4 text-pro-dark-400 font-semibold">Player</th>
                          <th className="text-center py-4 px-4 text-pro-dark-400 font-semibold">MP</th>
                          <th className="text-center py-4 px-4 text-pro-dark-400 font-semibold">W</th>
                          <th className="text-center py-4 px-4 text-pro-dark-400 font-semibold">L</th>
                          <th className="text-center py-4 px-4 text-pro-dark-400 font-semibold">Points</th>
                          <th className="text-center py-4 px-4 text-pro-dark-400 font-semibold">Sets Won/Lost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pro-dark-700">
                        {groupStandings.map((player, index) => (
                          <tr key={player.playerId} className="table-row group hover:bg-pro-dark-800/50 transition-colors duration-300">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 transition-all duration-300
                                  ${index === 0 ? 'bg-champion-gold-500 text-champion-gold-900 shadow-glow-gold' :
                                    index === 1 ? 'bg-gray-400 text-gray-900 shadow-lg' :
                                    index === 2 ? 'bg-amber-600 text-amber-900 shadow-lg' :
                                    'bg-pro-dark-600 text-white'}
                                `}>
                                  {index + 1}
                                </div>
                                {index === 0 && <TrophyIcon className="h-5 w-5 text-champion-gold-400 animate-float-gentle" />}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className={`font-semibold transition-colors duration-300 ${
                                  index === 0 ? 'text-champion-gold-200' : 'text-white group-hover:text-table-green-300'
                                }`}>
                                  {player.playerName}
                                </p>
                                <p className="text-sm text-pro-dark-400">
                                  Record: {player.wins}W-{player.losses}L
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center text-white font-medium">
                              {player.matchesPlayed}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-table-green-400 font-bold text-lg">
                                {player.wins}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="text-red-400 font-bold text-lg">
                                {player.losses}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`font-bold text-xl ${
                                index === 0 ? 'text-champion-gold-400' : 'text-table-green-400'
                              }`}>
                                {player.points}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <span className="text-table-green-400 font-semibold">{player.setsWon}</span>
                                <span className="text-pro-dark-500">/</span>
                                <span className="text-red-400 font-semibold">{player.setsLost}</span>
                                <span className="text-xs text-pro-dark-400 ml-2">
                                  ({player.setRatio.toFixed(2)})
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Group Matches */}
            <div className="lg:col-span-2">
              <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-table-green-500" />
                  Group Matches
                </h3>
                
                <div className="space-y-4">
                  {tournament.matches
                    .filter(match => match.groupId === selectedGroup)
                    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                    .map((match, index) => {
                      const player1 = tournament.players.find(p => p.id === match.player1Id);
                      const player2 = tournament.players.find(p => p.id === match.player2Id);
                      
                      return (
                        <div 
                          key={match.id} 
                          className={`
                            p-4 rounded-tournament transition-all duration-300 hover:shadow-tournament
                            ${match.status === 'live' ? 'bg-gradient-to-r from-red-900/30 via-pro-dark-800 to-pro-dark-800 border border-red-500/30' :
                              match.status === 'completed' ? 'bg-gradient-to-r from-table-green-900/20 via-pro-dark-800 to-pro-dark-800 border border-table-green-600/30' :
                              'bg-pro-dark-800 border border-pro-dark-700 hover:border-table-green-600'}
                          `}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-semibold transition-colors duration-300 ${
                                  match.winnerId === match.player1Id ? 'text-champion-gold-300' : 'text-white'
                                }`}>
                                  {player1?.name}
                                </span>
                                <div className="mx-4">
                                  {match.status === 'completed' || match.status === 'live' ? (
                                    <div className="text-2xl font-bold">
                                      <span className={match.winnerId === match.player1Id ? 'text-champion-gold-400' : 'text-pro-dark-300'}>
                                        {match.player1Score}
                                      </span>
                                      <span className="text-pro-dark-500 mx-2">-</span>
                                      <span className={match.winnerId === match.player2Id ? 'text-champion-gold-400' : 'text-pro-dark-300'}>
                                        {match.player2Score}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-pro-dark-500 text-lg">vs</div>
                                  )}
                                </div>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  match.winnerId === match.player2Id ? 'text-champion-gold-300' : 'text-white'
                                }`}>
                                  {player2?.name}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-pro-dark-400">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  <span>{format(new Date(match.scheduledTime), 'MMM dd, yyyy HH:mm')}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  {match.status === 'live' && (
                                    <div className="flex items-center mr-3">
                                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-glow mr-1"></div>
                                      <PlayIcon className="h-4 w-4 text-red-400" />
                                    </div>
                                  )}
                                  <span className={`
                                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                    ${match.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                      match.status === 'completed' ? 'bg-table-green-500/20 text-table-green-400 border border-table-green-500/30' :
                                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'}
                                  `}>
                                    {match.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
