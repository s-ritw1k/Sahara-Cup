export default function Home() {
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#fbbf24' }}>
        🏓 Welcome to Sahara Cup 2025
      </h1>
      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #334155',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#22c55e' }}>
          Tournament Status
        </h2>
        <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6' }}>
          The Sahara Cup 2025 table tennis tournament is now live! 
          This professional tournament management system tracks all matches, 
          standings, and provides real-time updates.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '20px', 
          borderRadius: '12px', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#fbbf24' }}>
            🎯 Features
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '8px 0', color: '#cbd5e1' }}>✅ Real-time match updates</li>
            <li style={{ padding: '8px 0', color: '#cbd5e1' }}>✅ Live leaderboard</li>
            <li style={{ padding: '8px 0', color: '#cbd5e1' }}>✅ Group standings</li>
            <li style={{ padding: '8px 0', color: '#cbd5e1' }}>✅ Admin panel</li>
          </ul>
        </div>
        
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '20px', 
          borderRadius: '12px', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#22c55e' }}>
            🏆 Tournament Info
          </h3>
          <p style={{ color: '#cbd5e1', margin: '8px 0' }}>
            <strong>Format:</strong> Group Stage + Knockout
          </p>
          <p style={{ color: '#cbd5e1', margin: '8px 0' }}>
            <strong>Players:</strong> 8 Participants
          </p>
          <p style={{ color: '#cbd5e1', margin: '8px 0' }}>
            <strong>Groups:</strong> 2 Groups of 4
          </p>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#065f46',
        borderRadius: '12px',
        border: '1px solid #22c55e'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'white' }}>
          🎮 Quick Navigation
        </h3>
        <p style={{ color: '#bbf7d0', marginBottom: '16px' }}>
          Use the navigation menu above to explore different sections:
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            📊 Leaderboard
          </span>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            ⚔️ Matches
          </span>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            👥 Groups
          </span>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px'
          }}>
            🔐 Admin
          </span>
        </div>
      </div>
    </div>
  );
}
