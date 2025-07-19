import { Outlet, Link, useLocation } from 'react-router-dom';
import { TrophyIcon, ChartBarIcon, ClockIcon, UserGroupIcon, BoltIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { BouncingBall } from './AnimatedSVGs';

const navigation = [
  { name: 'Home', href: '/', icon: TrophyIcon },
  { name: 'Knockout', href: '/knockout', icon: BoltIcon },
  { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
  { name: 'Matches', href: '/matches', icon: ClockIcon },
  { name: 'Groups', href: '/groups', icon: UserGroupIcon },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-pro-dark-950">
      {/* Header */}
      <header className="tournament-header bg-gradient-to-r from-pro-dark-900 via-table-green-950 to-pro-dark-900 border-b-2 border-table-green-600 shadow-tournament-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative flex items-center space-x-3">
                <TrophyIcon className="h-10 w-10 text-champion-gold-400 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-table-green-500 rounded-full animate-pulse-glow shadow-glow-green"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-champion-gold-400 via-champion-gold-300 to-champion-gold-500 bg-clip-text text-transparent drop-shadow-sm">
                  Sahara Cup
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-table-green-300 font-medium tracking-wide">2025 Championship</p>
                  <BouncingBall className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={clsx(
                      'flex items-center px-4 py-2.5 rounded-tournament text-sm font-semibold transition-all duration-300 relative overflow-hidden btn-interactive',
                      isActive
                        ? 'bg-gradient-to-r from-table-green-600 to-table-green-700 text-white shadow-glow-green transform scale-105'
                        : 'text-pro-dark-300 hover:text-white hover:bg-gradient-to-r hover:from-pro-dark-800 hover:to-table-green-900/50 hover:shadow-tournament'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-champion-gold-400 to-champion-gold-500"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pro-dark-900 via-table-green-950 to-pro-dark-900 border-t border-table-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-5 w-5 text-champion-gold-400" />
              <span className="text-white font-semibold">Sahara Cup 2025</span>
            </div>
            <div className="text-pro-dark-300 text-sm">
              Developed by <span className="font-semibold text-table-green-400">Ritwik</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
