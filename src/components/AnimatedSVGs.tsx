import React from 'react';

// Animated Ping Pong Ball
export const AnimatedPingPongBall: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`${className} inline-block ping-pong-interactive`}>
    <svg viewBox="0 0 100 100" className="w-full h-full animate-ping-pong-float">
      <defs>
        <radialGradient id="ballGradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </radialGradient>
      </defs>
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        fill="url(#ballGradient)" 
        stroke="#d0d0d0" 
        strokeWidth="2"
        className="animate-ball-bounce-custom"
      />
      <ellipse 
        cx="50" 
        cy="50" 
        rx="35" 
        ry="8" 
        fill="none" 
        stroke="#ff4500" 
        strokeWidth="2"
        className="animate-ball-spin-custom"
      />
      <ellipse 
        cx="50" 
        cy="50" 
        rx="8" 
        ry="35" 
        fill="none" 
        stroke="#ff4500" 
        strokeWidth="2"
        className="animate-ball-spin-custom"
        style={{ animationDirection: 'reverse' }}
      />
    </svg>
  </div>
);

// Animated Table Tennis Paddle
export const AnimatedPaddle: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <div className={`${className} inline-block ping-pong-interactive`}>
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <defs>
        <linearGradient id="paddleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="50%" stopColor="#A0522D" />
          <stop offset="100%" stopColor="#654321" />
        </linearGradient>
        <linearGradient id="rubberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC143C" />
          <stop offset="100%" stopColor="#B22222" />
        </linearGradient>
      </defs>
      
      {/* Handle */}
      <rect 
        x="45" 
        y="80" 
        width="10" 
        height="35" 
        fill="url(#paddleGradient)" 
        rx="5"
        className="animate-pulse"
      />
      
      {/* Paddle blade */}
      <ellipse 
        cx="50" 
        cy="45" 
        rx="35" 
        ry="40" 
        fill="url(#paddleGradient)"
        className="animate-paddle-swing"
        style={{ transformOrigin: '50px 90px' }}
      />
      
      {/* Red rubber surface */}
      <ellipse 
        cx="50" 
        cy="45" 
        rx="30" 
        ry="35" 
        fill="url(#rubberGradient)"
        className="hover:animate-pulse"
      />
      
      {/* Rubber texture dots */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i * 24) * Math.PI / 180;
        const radius = 15 + (i % 3) * 8;
        const x = 50 + Math.cos(angle) * radius;
        const y = 45 + Math.sin(angle) * radius;
        return (
          <circle 
            key={i}
            cx={x} 
            cy={y} 
            r="1.5" 
            fill="#8B0000"
            className="animate-ping"
            style={{ animationDelay: `${i * 0.1}s`, animationDuration: '3s' }}
          />
        );
      })}
    </svg>
  </div>
);

// Animated Table Tennis Table
export const AnimatedTable: React.FC<{ className?: string }> = ({ className = "w-16 h-12" }) => (
  <div className={`${className} inline-block ping-pong-interactive`}>
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="tableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066cc" />
          <stop offset="50%" stopColor="#004499" />
          <stop offset="100%" stopColor="#003366" />
        </linearGradient>
      </defs>
      
      {/* Table surface */}
      <rect 
        x="20" 
        y="40" 
        width="160" 
        height="60" 
        fill="url(#tableGradient)" 
        rx="4"
        className="hover:animate-pulse"
      />
      
      {/* Center net */}
      <rect 
        x="95" 
        y="35" 
        width="10" 
        height="15" 
        fill="#ffffff"
        className="animate-table-net-wave"
      />
      <rect 
        x="98" 
        y="30" 
        width="4" 
        height="25" 
        fill="#cccccc"
      />
      
      {/* Center line */}
      <line 
        x1="100" 
        y1="40" 
        x2="100" 
        y2="100" 
        stroke="#ffffff" 
        strokeWidth="2"
        className="animate-pulse"
        strokeDasharray="5,5"
      />
      
      {/* Table legs */}
      <rect x="30" y="100" width="6" height="15" fill="#666666" />
      <rect x="164" y="100" width="6" height="15" fill="#666666" />
      <rect x="30" y="100" width="6" height="15" fill="#666666" />
      <rect x="164" y="100" width="6" height="15" fill="#666666" />
      
      {/* Side lines */}
      <rect x="20" y="40" width="160" height="2" fill="#ffffff" />
      <rect x="20" y="98" width="160" height="2" fill="#ffffff" />
      <rect x="20" y="40" width="2" height="60" fill="#ffffff" />
      <rect x="178" y="40" width="2" height="60" fill="#ffffff" />
    </svg>
  </div>
);

// Bouncing Ball Animation
export const BouncingBall: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <div className={`${className} inline-block`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle 
        cx="50" 
        cy="50" 
        r="8" 
        fill="#ffffff"
        className="animate-ball-bounce-custom"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="6" 
        fill="none" 
        stroke="#ff4500" 
        strokeWidth="1"
        className="animate-ball-spin-custom"
      />
    </svg>
  </div>
);

// Trophy with Animation
export const AnimatedTrophy: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`${className} inline-block ping-pong-interactive`}>
    <svg viewBox="0 0 100 100" className="w-full h-full animate-trophy-glow">
      <defs>
        <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
      
      {/* Trophy cup */}
      <path 
        d="M30 30 L30 50 Q30 60 40 60 L60 60 Q70 60 70 50 L70 30 Z" 
        fill="url(#trophyGradient)"
        className="animate-pulse"
      />
      
      {/* Trophy handles */}
      <ellipse cx="25" cy="40" rx="8" ry="6" fill="none" stroke="#FFD700" strokeWidth="3" />
      <ellipse cx="75" cy="40" rx="8" ry="6" fill="none" stroke="#FFD700" strokeWidth="3" />
      
      {/* Trophy base */}
      <rect x="40" y="60" width="20" height="8" fill="url(#trophyGradient)" />
      <rect x="35" y="68" width="30" height="6" fill="url(#trophyGradient)" rx="3" />
      
      {/* Sparkles */}
      <circle cx="40" cy="35" r="2" fill="#FFFF00" className="animate-sparkle" />
      <circle cx="60" cy="40" r="1.5" fill="#FFFF00" className="animate-sparkle-delay-1" />
      <circle cx="50" cy="25" r="1" fill="#FFFF00" className="animate-sparkle-delay-2" />
      <circle cx="45" cy="45" r="1.5" fill="#FFFF00" className="animate-sparkle-delay-3" />
    </svg>
  </div>
);

// Loading Spinner with Ping Pong Theme
export const PingPongSpinner: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`${className} inline-block`}>
    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin">
      <circle cx="50" cy="20" r="8" fill="#ffffff" />
      <circle cx="80" cy="50" r="8" fill="#ffffff" opacity="0.8" />
      <circle cx="50" cy="80" r="8" fill="#ffffff" opacity="0.6" />
      <circle cx="20" cy="50" r="8" fill="#ffffff" opacity="0.4" />
    </svg>
  </div>
);

// Match Score Animation
export const AnimatedScore: React.FC<{ 
  player1Score: number; 
  player2Score: number; 
  className?: string; 
  isLive?: boolean;
}> = ({ player1Score, player2Score, className = "text-2xl", isLive = false }) => (
  <div className={`${className} font-bold flex items-center space-x-3`}>
    <div className="flex items-center space-x-2">
      <span className={`${isLive ? 'animate-pulse text-red-400' : 'text-white'}`}>
        {player1Score}
      </span>
      {isLive && <BouncingBall className="h-4 w-4" />}
    </div>
    <span className="text-slate-400">-</span>
    <div className="flex items-center space-x-2">
      <span className={`${isLive ? 'animate-pulse text-red-400' : 'text-white'}`}>
        {player2Score}
      </span>
      {isLive && <AnimatedPingPongBall className="h-4 w-4" />}
    </div>
  </div>
);

// Tournament Bracket Connector
export const BracketConnector: React.FC<{ className?: string; direction?: 'left' | 'right' }> = ({ 
  className = "w-8 h-4", 
  direction = 'right' 
}) => (
  <div className={`${className} inline-block`}>
    <svg viewBox="0 0 100 50" className="w-full h-full">
      <defs>
        <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {direction === 'right' ? (
        <>
          <line x1="10" y1="25" x2="60" y2="25" stroke="url(#connectorGradient)" strokeWidth="2" className="animate-pulse" />
          <polygon points="55,20 65,25 55,30" fill="#22c55e" className="animate-ping" style={{ animationDuration: '2s' }} />
        </>
      ) : (
        <>
          <line x1="40" y1="25" x2="90" y2="25" stroke="url(#connectorGradient)" strokeWidth="2" className="animate-pulse" />
          <polygon points="45,20 35,25 45,30" fill="#22c55e" className="animate-ping" style={{ animationDuration: '2s' }} />
        </>
      )}
    </svg>
  </div>
);
