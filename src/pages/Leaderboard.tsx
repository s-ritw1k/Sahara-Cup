import { useStandings } from '../hooks/useData';
import { TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { StandingsEntry } from '../types';

export default function Leaderboard() {
  const { standings, loading, error } = useStandings();

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-dark-400">Loading leaderboard...</p>
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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-8 w-8 text-primary-500 mr-3" />
          <h1 className="text-4xl font-bold text-white">Tournament Leaderboard</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Current standings based on match results and performance
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 overflow-hidden">
        {/* Table Header */}
        <div className="bg-pro-dark-800 border-b border-dark-700">
          <div className="grid grid-cols-10 gap-4 px-6 py-4 text-sm font-bold text-dark-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Player</div>
            <div className="col-span-1 text-center">Matches</div>
            <div className="col-span-1 text-center">Wins</div>
            <div className="col-span-1 text-center">Losses</div>
            <div className="col-span-1 text-center">Points</div>
            <div className="col-span-2 text-center">Sets</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-dark-700">
          {standings.slice(0, 10).map((player: StandingsEntry, index: number) => (
            <div 
              key={player.playerId}
              className={clsx(
                "grid grid-cols-10 gap-4 items-center",
                "px-6 py-4 transition-all duration-300 hover:bg-dark-800",
                index < 3 ? "bg-gradient-to-r from-amber-900/10 to-transparent" : ""
              )}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center">
                {index < 3 ? (
                  <div className="flex items-center">
                    <TrophyIcon className={clsx(
                      "h-6 w-6 mr-2",
                      index === 0 ? "text-yellow-400" : 
                      index === 1 ? "text-gray-400" : 
                      "text-amber-600"
                    )} />
                    <span className="text-xl font-bold text-white">{index + 1}</span>
                  </div>
                ) : (
                  <span className="text-lg font-semibold text-dark-300">{index + 1}</span>
                )}
              </div>

              {/* Player Name */}
              <div className="col-span-3">
                <span className={clsx(
                  "font-semibold",
                  index < 3 ? "text-white text-lg" : "text-dark-200"
                )}>
                  {player.playerName}
                </span>
              </div>

              {/* Matches Played */}
              <div className="col-span-1 text-center">
                <span className="text-white font-medium">{player.matchesPlayed}</span>
              </div>

              {/* Wins */}
              <div className="col-span-1 text-center">
                <span className="text-green-400 font-medium">{player.wins}</span>
              </div>

              {/* Losses */}
              <div className="col-span-1 text-center">
                <span className="text-red-400 font-medium">{player.losses}</span>
              </div>

              {/* Points */}
              <div className="col-span-1 text-center">
                <span className="text-white font-bold">{player.points}</span>
              </div>

              {/* Sets Won/Lost */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-green-400">{player.setsWon}</span>
                  <span className="text-dark-500 mx-1">/</span>
                  <span className="text-red-400">{player.setsLost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
