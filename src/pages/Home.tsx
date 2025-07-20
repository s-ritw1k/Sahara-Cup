import { useStandings, useMatchesWithPlayers } from '../hooks/useData';
import { format } from 'date-fns';
import { TrophyIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { AnimatedPingPongBall, AnimatedPaddle, AnimatedTable, BouncingBall, AnimatedTrophy, PingPongSpinner } from '../components/AnimatedSVGs';

export default function Home() {
  const { standings, loading: standingsLoading } = useStandings();
  const { matches, loading: matchesLoading } = useMatchesWithPlayers();

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
    .slice(0, 3);

  const topPlayers = standings.slice(0, 3);

  if (standingsLoading || matchesLoading) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <PingPongSpinner className="h-12 w-12" />
            <AnimatedTable className="h-8 w-12" />
            <AnimatedPaddle className="h-12 w-12" />
          </div>
          <p className="mt-4 text-dark-400 flex items-center justify-center space-x-2">
            <span>Loading tournament data</span>
            <BouncingBall className="h-4 w-4" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Matches */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2">
                <FireIcon className="h-6 w-6 text-red-500" />
                <AnimatedPingPongBall className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-2">Live Matches</h2>
              {liveMatches.length > 0 && (
                <span className="ml-2 inline-flex items-center">
                  <span className="animate-pulse-slow h-2 w-2 bg-red-500 rounded-full"></span>
                  <span className="ml-1 text-sm text-red-400">LIVE</span>
                </span>
              )}
            </div>

            {liveMatches.length === 0 ? (
              <div className="text-center py-8 text-dark-400">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <ClockIcon className="h-12 w-12 text-dark-600" />
                  <AnimatedTable className="h-8 w-12" />
                </div>
                <p className="flex items-center justify-center space-x-2">
                  <span>No live matches at the moment</span>
                  <BouncingBall className="h-4 w-4" />
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveMatches.map((match) => (
                  <div key={match.id} className="card-hover p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {match.player1.name}
                          </span>
                          <span className="text-2xl font-bold text-primary-400 mx-4">
                            {match.player1Score}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium text-white">
                            {match.player2.name}
                          </span>
                          <span className="text-2xl font-bold text-primary-400 mx-4">
                            {match.player2Score}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <span className="status-live">
                          <PlayIcon className="h-3 w-3 mr-1" />
                          LIVE
                        </span>
                        <p className="text-sm text-dark-400 mt-1">
                          {match.player1.name} vs {match.player2.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="card p-6 mt-6">
            <div className="flex items-center mb-6">
              <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-white">Next Matches</h2>
            </div>

            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="card-hover p-5 border-l-4 border-blue-500/30 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-center mb-3">
                        <div className="text-center flex-1">
                          <span className="font-semibold text-white text-lg block">
                            {match.player1.name}
                          </span>
                        </div>
                        <div className="mx-6 text-center">
                          <span className="text-pro-dark-400 text-xl font-bold">VS</span>
                        </div>
                        <div className="text-center flex-1">
                          <span className="font-semibold text-white text-lg block">
                            {match.player2.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-table-green-400 font-medium bg-table-green-900/30 px-3 py-1 rounded-full">
                          Group {String.fromCharCode(65 + parseInt(match.groupId.replace('g', '')) - 1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-pro-dark-700 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
                        <div className="text-xs text-blue-300 font-medium">DATE</div>
                        <div className="text-sm text-white font-semibold">
                          {format(new Date(match.scheduledTime), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-500/30">
                        <div className="text-xs text-blue-300 font-medium">TIME</div>
                        <div className="text-sm text-white font-semibold">
                          {format(new Date(match.scheduledTime), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    <span className="status-upcoming px-4 py-2">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      UPCOMING
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Players */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-6 w-6 text-yellow-500" />
                <AnimatedTrophy className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-2">Top Players</h2>
            </div>

            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div 
                  key={player.playerId} 
                  className={clsx(
                    "p-4 rounded-lg transition-all duration-300",
                    index === 0 && "bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30",
                    index === 1 && "bg-gradient-to-r from-gray-800/30 to-gray-700/20 border border-gray-600/30",
                    index === 2 && "bg-gradient-to-r from-orange-900/30 to-orange-800/20 border border-orange-700/30",
                    index > 2 && "bg-dark-800 border border-dark-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3",
                        index === 0 && "bg-yellow-500 text-black",
                        index === 1 && "bg-gray-400 text-black",
                        index === 2 && "bg-orange-500 text-black",
                        index > 2 && "bg-dark-600 text-white"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{player.playerName}</h3>
                        <p className="text-sm text-dark-400">{player.wins} wins, {player.losses} losses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-400">{player.points}</p>
                      <p className="text-sm text-dark-400">{player.wins}W-{player.losses}L</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tournament Stats */}
          <div className="card p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Tournament Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Total Matches</span>
                <span className="font-semibold text-white">{matches.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Completed</span>
                <span className="font-semibold text-green-400">
                  {matches.filter(m => m.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Live</span>
                <span className="font-semibold text-red-400">
                  {matches.filter(m => m.status === 'live').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Upcoming</span>
                <span className="font-semibold text-blue-400">
                  {matches.filter(m => m.status === 'upcoming').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Rules & Format */}
      <div className="mt-12 card p-8 animate-bounce-in">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
          <TrophyIcon className="h-8 w-8 mr-3 text-champion-gold-400 animate-float-gentle" />
          Tournament Rules & Format
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tournament Format */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-table-green-900/30 to-table-green-800/20 p-6 rounded-tournament border border-table-green-600/30">
              <h3 className="text-xl font-semibold text-table-green-300 mb-4 flex items-center">
                <div className="w-3 h-3 bg-table-green-400 rounded-full mr-3 animate-pulse-glow"></div>
                Group Stage Format
              </h3>
              <ul className="space-y-3 text-pro-dark-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-table-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">8 groups</strong> with <strong className="text-white">3 players</strong> each</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-table-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Round-robin format</strong> - every player plays 2 matches</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-table-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Top 2 players</strong> from each group qualify for knockout</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-table-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">16 qualified players</strong> compete in single elimination</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-champion-gold-900/30 to-champion-gold-800/20 p-6 rounded-tournament border border-champion-gold-600/30">
              <h3 className="text-xl font-semibold text-champion-gold-300 mb-4 flex items-center">
                <div className="w-3 h-3 bg-champion-gold-400 rounded-full mr-3 animate-pulse-glow"></div>
                Qualification Rules
              </h3>
              <ul className="space-y-3 text-pro-dark-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-champion-gold-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Players ranked by <strong className="text-white">number of matches won</strong></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-champion-gold-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>In case of tie: decided by <strong className="text-white">total point difference</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Match Rules */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-paddle-orange-900/30 to-paddle-orange-800/20 p-6 rounded-tournament border border-paddle-orange-600/30">
              <h3 className="text-xl font-semibold text-paddle-orange-300 mb-4 flex items-center">
                <div className="w-3 h-3 bg-paddle-orange-400 rounded-full mr-3 animate-pulse-glow"></div>
                Match Rules
              </h3>
              <ul className="space-y-3 text-pro-dark-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-paddle-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Each match is <strong className="text-white">best of 3 sets</strong></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-paddle-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Each set goes up to <strong className="text-white">11 points</strong></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-paddle-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Serve changes <strong className="text-white">every 2 points</strong></span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-paddle-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">All serves allowed</strong> - ball must be behind table</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-6 rounded-tournament border border-blue-600/30">
              <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse-glow"></div>
                Scheduling
              </h3>
              <ul className="space-y-3 text-pro-dark-200">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Coordinate with opponents</strong> in your group</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Notify organizers</strong> once match time is fixed</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong className="text-white">Referee arranged</strong> for your match</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-pro-dark-900/50 p-4 rounded-tournament border border-table-green-600/30 text-center">
            <div className="text-3xl font-bold text-table-green-400">8</div>
            <div className="text-sm text-pro-dark-400">Groups</div>
          </div>
          <div className="bg-pro-dark-900/50 p-4 rounded-tournament border border-champion-gold-600/30 text-center">
            <div className="text-3xl font-bold text-champion-gold-400">24</div>
            <div className="text-sm text-pro-dark-400">Players</div>
          </div>
          <div className="bg-pro-dark-900/50 p-4 rounded-tournament border border-paddle-orange-600/30 text-center">
            <div className="text-3xl font-bold text-paddle-orange-400">3</div>
            <div className="text-sm text-pro-dark-400">Sets to Win</div>
          </div>
          <div className="bg-pro-dark-900/50 p-4 rounded-tournament border border-blue-600/30 text-center">
            <div className="text-3xl font-bold text-blue-400">11</div>
            <div className="text-sm text-pro-dark-400">Points per Set</div>
          </div>
        </div>
      </div>
    </div>
  );
}
