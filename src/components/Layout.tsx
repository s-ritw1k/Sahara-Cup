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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tournament Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <TrophyIcon className="h-6 w-6 text-champion-gold-400 mr-2" />
                <h3 className="text-lg font-bold text-white">Sahara Cup 2025</h3>
              </div>
              <p className="text-pro-dark-300 text-sm leading-relaxed">
                Professional Table Tennis Championship featuring elite players competing 
                for the prestigious Sahara Cup title.
              </p>
            </div>

            {/* Tournament Status */}
            <div className="text-center">
              <h4 className="text-md font-semibold text-table-green-300 mb-3">Tournament Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-table-green-500 rounded-full animate-pulse"></div>
                  <span className="text-pro-dark-300 text-sm">Live Tournament System</span>
                </div>
                <div className="text-pro-dark-400 text-xs">
                  Real-time updates • Professional scoring • Live brackets
                </div>
              </div>
            </div>

            {/* Developer Attribution */}
            <div className="text-center md:text-right">
              <h4 className="text-md font-semibold text-table-green-300 mb-3">System Development</h4>
              <div className="space-y-1">
                <div className="text-pro-dark-300 text-sm">
                  <span className="font-medium">Developed by</span>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-table-green-400 to-champion-gold-400 bg-clip-text text-transparent">
                  Ritwik™
                </div>
                <div className="text-pro-dark-400 text-xs">
                  Full-Stack Developer & System Architect
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-6 border-t border-table-green-800/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-pro-dark-400 text-xs">
                © 2025 Sahara Cup Tournament Management System. All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-xs text-pro-dark-400">
                <span>Version 1.0</span>
                <span>•</span>
                <span>Real-time Updates Enabled</span>
                <span>•</span>
                <span className="text-table-green-400 font-medium">Professional Edition</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
