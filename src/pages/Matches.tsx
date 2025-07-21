import { useState } from 'react';
import { useMatchesWithPlayers } from '../hooks/useData';
import { format } from 'date-fns';
import { ClockIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

type MatchFilter = 'all' | 'live' | 'upcoming' | 'completed';

export default function Matches() {
  const { matches, loading, error } = useMatchesWithPlayers();
  const [filter, setFilter] = useState<MatchFilter>('all');

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const statusCounts = {
    all: matches.length,
    live: matches.filter(m => m.status === 'live').length,
    upcoming: matches.filter(m => m.status === 'upcoming').length,
    completed: matches.filter(m => m.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-400">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <PlayIcon className="h-4 w-4" />;
      case 'upcoming':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'upcoming':
        return 'status-upcoming';
      case 'completed':
        return 'status-completed';
      default:
        return 'bg-dark-600 text-dark-300';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center mb-4">
          <ClockIcon className="h-8 w-8 text-table-green-500 mr-3 animate-float-gentle" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-table-green-200 to-white bg-clip-text text-transparent">
            All Matches
          </h1>
        </div>
        <p className="text-pro-dark-300 text-lg">
          Track all tournament matches across all groups and rounds
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-dark-800/50 p-1 rounded-xl shadow-lg backdrop-blur-sm border border-dark-700">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status as MatchFilter)}
            className={clsx(
              'flex-1 py-4 px-6 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden group transform hover:scale-105',
              filter === status
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-500/20'
                : 'text-dark-300 hover:text-white hover:bg-gradient-to-r hover:from-dark-700 hover:to-primary-900/30 hover:shadow-lg'
            )}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="capitalize text-lg">{status}</span>
              <span className={clsx(
                "text-sm px-3 py-1 rounded-full font-bold min-w-[2rem] text-center",
                filter === status
                  ? 'bg-white/20 text-white'
                  : 'bg-dark-600 text-dark-300 group-hover:bg-primary-800/50 group-hover:text-primary-200'
              )}>
                {count}
              </span>
            </div>
            {filter === status && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="card p-8 text-center">
            <ClockIcon className="h-12 w-12 mx-auto mb-4 text-dark-600" />
            <p className="text-dark-400">No matches found for the selected filter</p>
          </div>
        ) : (
          filteredMatches
            .sort((a, b) => {
              // Sort by status priority (live, upcoming, completed) then by time
              const statusPriority = { live: 0, upcoming: 1, completed: 2 };
              const aPriority = statusPriority[a.status as keyof typeof statusPriority];
              const bPriority = statusPriority[b.status as keyof typeof statusPriority];
              
              if (aPriority !== bPriority) {
                return aPriority - bPriority;
              }
              
              return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
            })
            .map((match, index) => {
              return (
                <div 
                  key={match.id} 
                  className="card-hover p-6 animate-slide-up transition-all duration-500 relative overflow-hidden border-l-4 border-table-green-600/30 hover:border-table-green-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >

                  
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  {/* Match Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 group">
                            <h3 className="text-lg font-semibold transition-colors duration-300 text-white group-hover:text-table-green-300">
                              {match.player1.name}
                            </h3>
                          </div>
                          <div className="mx-8 text-center relative">
                            {match.status === 'completed' || match.status === 'live' ? (
                              <div className="space-y-2">
                                <div className="text-3xl font-bold score-display">
                                  <span className={clsx(
                                    "transition-all duration-300",
                                    match.winnerId === match.player1Id ? "text-champion-gold-400 scale-110" : "text-pro-dark-300"
                                  )}>
                                    {match.player1Score}
                                  </span>
                                  <span className="text-pro-dark-500 mx-2">-</span>
                                  <span className={clsx(
                                    "transition-all duration-300",
                                    match.winnerId === match.player2Id ? "text-champion-gold-400 scale-110" : "text-pro-dark-300"
                                  )}>
                                    {match.player2Score}
                                  </span>
                                </div>
                                {/* Individual Set Scores */}
                                {match.player1SetScores && match.player2SetScores && (
                                  <div className="text-sm text-pro-dark-400 space-y-1">
                                    {match.player1SetScores.map((p1Score, setIndex) => (
                                      <div key={setIndex} className="flex items-center justify-center">
                                        <span className={`${p1Score > match.player2SetScores![setIndex] ? 'text-table-green-400 font-semibold' : 'text-pro-dark-500'}`}>
                                          {p1Score}
                                        </span>
                                        <span className="text-pro-dark-600 mx-2">-</span>
                                        <span className={`${match.player2SetScores![setIndex] > p1Score ? 'text-table-green-400 font-semibold' : 'text-pro-dark-500'}`}>
                                          {match.player2SetScores![setIndex]}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xl font-medium animate-float-gentle text-pro-dark-500">
                                vs
                              </div>
                            )}
                            {match.status === 'live' && (
                              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full animate-pulse-glow bg-red-500"></div>
                            )}
                          </div>
                          <div className="flex-1 text-right group">
                            <h3 className="text-lg font-semibold transition-colors duration-300 text-white group-hover:text-table-green-300">
                              {match.player2.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <p className="text-sm text-pro-dark-400 mb-2">
                        {format(new Date(match.scheduledTime), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {format(new Date(match.scheduledTime), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {/* Status and Winner */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <span className={clsx(getStatusColor(match.status), 'mb-3')}>
                        {getStatusIcon(match.status)}
                        {match.status.toUpperCase()}
                      </span>
                      
                      {match.status === 'completed' && match.winnerId && (
                        <div className="mt-3">
                          <p className="text-sm text-dark-400 mb-1">Winner</p>
                          <p className="font-semibold text-primary-400">
                            {match.winnerId === match.player1.id ? match.player1.name : match.player2.name}
                          </p>
                        </div>
                      )}

                      {match.status === 'live' && (
                        <div className="mt-3">
                          <div className="flex justify-center">
                            <span className="animate-pulse-slow h-2 w-2 bg-red-500 rounded-full"></span>
                          </div>
                          <p className="text-xs text-red-400 mt-1">
                            Match in Progress
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>                </div>
              );
            })
        )}
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="card p-6 text-center">
          <FireIcon className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {statusCounts.live}
          </div>
          <p className="text-dark-400">Live Matches</p>
        </div>

        <div className="card p-6 text-center">
          <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {statusCounts.upcoming}
          </div>
          <p className="text-dark-400">Upcoming</p>
        </div>

        <div className="card p-6 text-center">
          <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">
            {statusCounts.completed}
          </div>
          <p className="text-dark-400">Completed</p>
        </div>

        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-500 mb-1">
            {Math.round((statusCounts.completed / statusCounts.all) * 100)}%
          </div>
          <p className="text-dark-400">Progress</p>
        </div>
      </div>
    </div>
  );
}
