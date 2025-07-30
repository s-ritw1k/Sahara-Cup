import { useStandings, useMatchesWithPlayers, useKnockoutMatchesWithPlayers } from '../hooks/useData';
import { format } from 'date-fns';
import { TrophyIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { AnimatedPingPongBall, AnimatedPaddle, AnimatedTable, BouncingBall, AnimatedTrophy, PingPongSpinner } from '../components/AnimatedSVGs';
import Confetti from '../components/Confetti';

export default function Home() {
  const { standings, loading: standingsLoading } = useStandings();
  const { matches, loading: matchesLoading } = useMatchesWithPlayers();
  const { knockoutMatches, loading: knockoutLoading } = useKnockoutMatchesWithPlayers();
  const [showConfetti, setShowConfetti] = useState(false);

  // Get finals matches
  const finalsMatches = knockoutMatches.filter(match => match.round === 'final');
  const allMatches = [...matches, ...knockoutMatches];
  
  // Calculate stats for display - using correct tournament numbers
  const stats = {
    total: 39, // 24 group stage + 15 knockout stage
    completed: 38,
    live: 0,
    upcoming: 1 // finals match
  };
  
  // Trigger confetti on finals day
  useEffect(() => {
    if (!knockoutLoading && finalsMatches.length > 0) {
      // Show confetti after component mounts
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [knockoutLoading, finalsMatches.length]);

  const liveMatches = allMatches.filter(match => match.status === 'live');

  const topPlayers = standings.slice(0, 3);

  if (standingsLoading || matchesLoading || knockoutLoading) {
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
      {/* Confetti Effect for Finals Day */}
      <Confetti active={showConfetti} intensity="high" duration={8000} />
      
      {/* Finals Day Hero Section */}
      {finalsMatches.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 via-red-900/20 to-orange-900/20 rounded-xl"></div>
          <div className="relative card p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-2 border-yellow-500/30">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center space-x-6 mb-6">
                <TrophyIcon className="h-16 w-16 text-yellow-500 animate-pulse-glow" />
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 mb-2">
                    FINALS DAY
                  </h1>
                  <p className="text-lg md:text-xl text-yellow-300 font-semibold">
                    The Ultimate Championship Showdown
                  </p>
                </div>
                <TrophyIcon className="h-16 w-16 text-yellow-500 animate-pulse-glow" />
              </div>
            </div>
            
            {/* Finals Matches */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-6">
                {finalsMatches.map((finalMatch) => (
                  <div key={finalMatch.id} className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border-2 border-yellow-500/50">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-yellow-300 mb-6">🏆 FINAL MATCH 🏆</h3>
                      
                      {/* Match Details */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center justify-between w-full max-w-2xl">
                          {/* Player 1 */}
                          <div className="text-center flex-1">
                            <div className="text-xl md:text-2xl font-bold text-white mb-3">{finalMatch.player1.name}</div>
                            {finalMatch.status === 'live' && (
                              <div className="text-4xl md:text-5xl font-bold text-yellow-400">{finalMatch.player1Score}</div>
                            )}
                          </div>
                          
                          {/* VS Section */}
                          <div className="text-center mx-8">
                            <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-3">VS</div>
                            {finalMatch.status === 'live' && (
                              <span className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                <PlayIcon className="h-4 w-4 mr-2" />
                                LIVE
                              </span>
                            )}
                            {finalMatch.status === 'upcoming' && (
                              <span className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                UPCOMING
                              </span>
                            )}
                          </div>
                          
                          {/* Player 2 */}
                          <div className="text-center flex-1">
                            <div className="text-xl md:text-2xl font-bold text-white mb-3">{finalMatch.player2.name}</div>
                            {finalMatch.status === 'live' && (
                              <div className="text-4xl md:text-5xl font-bold text-yellow-400">{finalMatch.player2Score}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Match Status */}
                      <div className="text-center">
                        {finalMatch.status === 'upcoming' && (
                          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg px-6 py-3 inline-block">
                            <p className="text-blue-300 font-semibold">
                              Scheduled: {format(new Date(finalMatch.scheduledTime), 'MMMM dd, yyyy • h:mm a')}
                            </p>
                          </div>
                        )}
                        {finalMatch.status === 'completed' && finalMatch.winnerId && (
                          <div className="bg-green-900/30 border border-green-500/50 rounded-lg px-6 py-4 inline-block">
                            <p className="text-green-400 font-bold text-xl mb-2">
                              🏆 TOURNAMENT CHAMPION 🏆
                            </p>
                            <p className="text-green-300 text-2xl font-bold">
                              {finalMatch.winnerId === finalMatch.player1Id ? finalMatch.player1.name : finalMatch.player2.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Matches - Full Width */}
        <div className="lg:col-span-3">
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
              <div className="text-center py-12 text-dark-400">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <ClockIcon className="h-12 w-12 text-dark-600" />
                  <AnimatedTable className="h-8 w-12" />
                </div>
                <p className="flex items-center justify-center space-x-2 text-lg">
                  <span>The finals await... No live matches at the moment</span>
                  <BouncingBall className="h-4 w-4" />
                </p>
                <p className="text-sm text-dark-500 mt-2">Get ready for the championship showdown!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveMatches.map((match) => (
                  <div key={match.id} className="card-hover p-6 border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Match Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center flex-1">
                            <h3 className="font-semibold text-white text-lg mb-1">
                              {match.player1.name}
                            </h3>
                            <div className="text-3xl font-bold text-primary-400 mb-2">
                              {match.player1Score}
                            </div>
                            {/* Individual Set Scores for Player 1 */}
                            {match.player1SetScores && match.player1SetScores.length > 0 && (
                              <div className="flex justify-center space-x-2">
                                {match.player1SetScores.map((score: number, index: number) => (
                                  <span 
                                    key={index} 
                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                      score > (match.player2SetScores?.[index] || 0) 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : 'bg-dark-700 text-dark-400 border border-dark-600'
                                    }`}
                                  >
                                    {score}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="mx-6 text-center">
                            <div className="text-xl font-bold text-red-400 mb-2">VS</div>
                            <span className="status-live text-sm">
                              <PlayIcon className="h-3 w-3 mr-1" />
                              LIVE
                            </span>
                          </div>
                          
                          <div className="text-center flex-1">
                            <h3 className="font-semibold text-white text-lg mb-1">
                              {match.player2.name}
                            </h3>
                            <div className="text-3xl font-bold text-primary-400 mb-2">
                              {match.player2Score}
                            </div>
                            {/* Individual Set Scores for Player 2 */}
                            {match.player2SetScores && match.player2SetScores.length > 0 && (
                              <div className="flex justify-center space-x-2">
                                {match.player2SetScores.map((score: number, index: number) => (
                                  <span 
                                    key={index} 
                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                      score > (match.player1SetScores?.[index] || 0) 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : 'bg-dark-700 text-dark-400 border border-dark-600'
                                    }`}
                                  >
                                    {score}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Match Details */}
                        {(match.player1SetScores && match.player1SetScores.length > 0) && (
                          <div className="text-center pt-3 border-t border-dark-700">
                            <p className="text-sm text-dark-400">
                              Set Scores • Match in Progress
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Players & Stats Row */}
        <div className="lg:col-span-2">
          {/* Top Players */}
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
        </div>

        {/* Tournament Stats */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Tournament Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Group Stage</span>
                <span className="font-semibold text-blue-300">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Knockout Stage</span>
                <span className="font-semibold text-purple-300">15</span>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2"></div>
              <div className="flex justify-between">
                <span className="text-dark-400">Total Matches</span>
                <span className="font-semibold text-white">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Completed</span>
                <span className="font-semibold text-green-400">{stats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Live</span>
                <span className="font-semibold text-red-400">{stats.live}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Upcoming</span>
                <span className="font-semibold text-blue-400">{stats.upcoming}</span>
              </div>
            </div>
          </div>

          {/* Finals Day Countdown/Info */}
          <div className="card p-6 mt-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2 animate-pulse-glow" />
              Finals Day Special
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-yellow-200">Date</span>
                <span className="font-semibold text-white">July 30, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-200">Stakes</span>
                <span className="font-semibold text-yellow-400">Championship</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-200">Prize</span>
                <span className="font-semibold text-yellow-400">Glory & Trophy</span>
              </div>
              <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-600/30">
                <p className="text-yellow-200 text-center font-medium">
                  🎉 Historic finale awaits! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Highlights Section */}
      <div className="card p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
          <FireIcon className="h-8 w-8 mr-3 text-red-500 animate-pulse-glow" />
          Tournament Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Journey Phase Cards */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-xl border border-green-600/30 text-center">
            <div className="text-4xl mb-4">🏁</div>
            <h3 className="text-xl font-bold text-green-300 mb-2">Group Stage</h3>
            <p className="text-green-200 text-sm mb-3">8 groups, intense battles</p>
            <div className="text-2xl font-bold text-white">COMPLETED</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-6 rounded-xl border border-orange-600/30 text-center">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold text-orange-300 mb-2">Knockouts</h3>
            <p className="text-orange-200 text-sm mb-3">Single elimination rounds</p>
            <div className="text-2xl font-bold text-white">IN PROGRESS</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 p-6 rounded-xl border border-yellow-600/30 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Finals</h3>
            <p className="text-yellow-200 text-sm mb-3">Championship showdown</p>
            <div className="text-2xl font-bold text-yellow-400">TODAY!</div>
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
