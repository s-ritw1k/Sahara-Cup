export default function Leaderboard() {
  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px', color: '#fbbf24' }}>
        🏆 Leaderboard
      </h1>
      <div style={{ 
        backgroundColor: '#1e293b', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #334155'
      }}>
        <p style={{ fontSize: '16px', color: '#cbd5e1', textAlign: 'center' }}>
          Leaderboard will be displayed here once the backend is connected.
        </p>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#22c55e',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            Coming Soon!
          </div>
        </div>
      </div>
    </div>
  );
}
