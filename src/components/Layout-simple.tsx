import { Outlet, Link, useLocation } from 'react-router-dom';
import { TrophyIcon, ChartBarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: TrophyIcon },
  { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
  { name: 'Matches', href: '/matches', icon: ClockIcon },
  { name: 'Groups', href: '/groups', icon: UserGroupIcon },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TrophyIcon style={{ height: '32px', width: '32px', color: '#fbbf24', marginRight: '12px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Sahara Cup 2025
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '20px' }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: isActive ? '#22c55e' : 'transparent',
                    color: isActive ? 'white' : '#cbd5e1',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Admin Link */}
          <Link
            to="/admin/login"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a', borderTop: '1px solid #334155', padding: '16px', textAlign: 'center' }}>
        <div style={{ color: '#94a3b8', fontSize: '14px' }}>
          © 2025 Sahara Cup Tournament. Built with React & TypeScript.
        </div>
      </footer>
    </div>
  );
}
