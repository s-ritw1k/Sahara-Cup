import { useStandings } from '../hooks/useData';
import { TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

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
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="bg-dark-800 px-6 py-4 border-b border-dark-700">
          <div className="grid grid-cols-11 gap-4 text-sm font-semibold text-dark-300 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Player</div>
            <div className="col-span-1 text-center">Matches</div>
            <div className="col-span-1 text-center">Wins</div>
            <div className="col-span-1 text-center">Losses</div>
            <div className="col-span-1 text-center">Points</div>
            <div className="col-span-1 text-center">Sets</div>
            <div className="col-span-2 text-center">Ratio</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-dark-700">
          {standings.slice(0, 10).map((player, index) => (
            <div 
              key={player.playerId}
              className={clsx(
                "px-6 py-4 transition-all duration-300 hover:bg-dark-800",
                index === 0 && "bg-gradient-to-r from-yellow-900/20 to-yellow-800/10",
                index === 1 && "bg-gradient-to-r from-gray-800/20 to-gray-700/10",
                index === 2 && "bg-gradient-to-r from-orange-900/20 to-orange-800/10"
              )}
            >
              <div className="grid grid-cols-11 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1">
                  <div className="flex items-center">
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0 && "bg-yellow-500 text-black",
                      index === 1 && "bg-gray-400 text-black",
                      index === 2 && "bg-orange-500 text-black",
                      index > 2 && "bg-dark-600 text-white"
                    )}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <TrophyIcon className={clsx(
                        "h-4 w-4 ml-2",
                        index === 0 && "text-yellow-500",
                        index === 1 && "text-gray-400",
                        index === 2 && "text-orange-500"
                      )} />
                    )}
                  </div>
                </div>

                {/* Player Name */}
                <div className="col-span-3">
                  <div className="font-semibold text-white text-lg">
                    {player.playerName}
                  </div>
                </div>

                {/* Matches Played */}
                <div className="col-span-1 text-center">
                  <span className="text-white font-medium">
                    {player.matchesPlayed}
                  </span>
                </div>

                {/* Wins */}
                <div className="col-span-1 text-center">
                  <span className="text-green-400 font-semibold">
                    {player.wins}
                  </span>
                </div>

                {/* Losses */}
                <div className="col-span-1 text-center">
                  <span className="text-red-400 font-semibold">
                    {player.losses}
                  </span>
                </div>

                {/* Points */}
                <div className="col-span-1 text-center">
                  <span className="text-primary-400 font-bold text-lg">
                    {player.points}
                  </span>
                </div>

                {/* Sets Won/Lost */}
                <div className="col-span-1 text-center">
                  <div className="text-sm">
                    <span className="text-green-400">{player.setsWon}</span>
                    <span className="text-dark-500 mx-1">/</span>
                    <span className="text-red-400">{player.setsLost}</span>
                  </div>
                </div>

                {/* Set Ratio */}
                <div className="col-span-2 text-center">
                  <span className="text-white font-medium">
                    {player.setRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
