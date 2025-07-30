import React, { useState, useEffect } from 'react';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

interface CurtainLoaderProps {
  onComplete: () => void;
}

const CurtainLoader: React.FC<CurtainLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'opening' | 'complete'>('initial');

  useEffect(() => {
    // Show logo and text for 3 seconds
    const timer1 = setTimeout(() => {
      setStage('opening');
    }, 2000);

    // Complete the animation and notify parent
    const timer2 = setTimeout(() => {
      setStage('complete');
      setTimeout(onComplete, 500);
    }, 6000); // Total 6 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      {/* Movie Theater Curtains */}
      {/* Left Curtain */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transform transition-transform duration-2000 ease-in-out ${
          stage === 'opening' || stage === 'complete' ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background: `linear-gradient(135deg, 
            #8B0000 0%, 
            #A0001C 15%, 
            #DC143C 30%, 
            #B22222 45%,
            #8B0000 60%,
            #660000 80%,
            #4A0000 100%
          )`,
          boxShadow: `
            inset -30px 0 60px rgba(0,0,0,0.6),
            inset 0 0 120px rgba(139,0,0,0.3),
            0 0 50px rgba(220,20,60,0.4)
          `,
        }}
      >
        {/* Velvet Texture */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.1) 3px,
                rgba(255,255,255,0.1) 6px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.2) 1px,
                rgba(0,0,0,0.2) 2px
              )
            `,
          }}
        />
        
        {/* Gold Trim */}
        <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 shadow-lg" />
        
        {/* Curtain Folds */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-1 bg-black/30"
              style={{
                left: `${12.5 * (i + 1)}%`,
                transform: `scaleY(${0.8 + Math.sin(i) * 0.2})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Curtain */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full transform transition-transform duration-2000 ease-in-out ${
          stage === 'opening' || stage === 'complete' ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background: `linear-gradient(225deg, 
            #8B0000 0%, 
            #A0001C 15%, 
            #DC143C 30%, 
            #B22222 45%,
            #8B0000 60%,
            #660000 80%,
            #4A0000 100%
          )`,
          boxShadow: `
            inset 30px 0 60px rgba(0,0,0,0.6),
            inset 0 0 120px rgba(139,0,0,0.3),
            0 0 50px rgba(220,20,60,0.4)
          `,
        }}
      >
        {/* Velvet Texture */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(255,255,255,0.1) 3px,
                rgba(255,255,255,0.1) 6px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.2) 1px,
                rgba(0,0,0,0.2) 2px
              )
            `,
          }}
        />
        
        {/* Gold Trim */}
        <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 shadow-lg" />
        
        {/* Curtain Folds */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-1 bg-black/30"
              style={{
                right: `${12.5 * (i + 1)}%`,
                transform: `scaleY(${0.8 + Math.sin(i) * 0.2})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Curtain Rod */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-800 shadow-2xl z-10">
        <div className="absolute inset-x-0 top-1 h-1 bg-yellow-200/50" />
        <div className="absolute inset-x-0 bottom-1 h-1 bg-black/50" />
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Spotlight Effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 800px 600px at center,
              rgba(255,255,255,0.05) 0%,
              rgba(255,255,255,0.02) 30%,
              transparent 70%
            )`,
          }}
        />
        
        <div className="text-center relative z-20">
          {/* Main Logo with Spotlight */}
          <div className={`mb-8 transform transition-all duration-1500 ${stage === 'initial' ? 'scale-0 opacity-0 rotate-12' : 'scale-100 opacity-100 rotate-0'}`}>
            <div className="relative">
              {/* Spotlight behind trophy */}
              <div className="absolute -inset-12 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <TrophyIcon className="h-32 w-32 mx-auto text-yellow-500 animate-pulse-glow relative z-10" />
              
              {/* Sparkling effects around trophy */}
              {[...Array(12)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="absolute h-4 w-4 text-yellow-400 animate-twinkle"
                  style={{
                    top: `${30 + 40 * Math.cos((i * 30) * Math.PI / 180)}%`,
                    left: `${50 + 40 * Math.sin((i * 30) * Math.PI / 180)}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tournament Title with Theater-style Animation */}
          <div className={`transform transition-all duration-1500 delay-500 ${stage === 'initial' ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 mb-4 tracking-wider">
              SAHARA CUP
            </h1>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide">
              FINALS DAY
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
              The Ultimate Table Tennis Championship
            </p>
          </div>

          {/* Date with Cinematic Style */}
          <div className={`transform transition-all duration-1500 delay-1000 ${stage === 'initial' ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-lg blur-sm" />
              <div className="relative bg-gradient-to-r from-red-900/60 to-red-800/60 border-2 border-red-700/50 rounded-lg px-8 py-4 inline-block">
                <div className="text-red-200 font-semibold text-lg">July 30, 2025</div>
                <div className="text-red-100 text-sm">Championship Day</div>
              </div>
            </div>
          </div>

          {/* Loading Animation with Theater Style */}
          <div className={`mt-16 transform transition-all duration-1500 delay-1500 ${stage === 'initial' ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="flex justify-center items-center space-x-3 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            <p className="text-slate-400 text-lg font-medium tracking-wide">
              {stage === 'initial' && 'Preparing the grand stage...'}
              {stage === 'opening' && 'The curtain rises...'}
              {stage === 'complete' && 'Welcome to the finals!'}
            </p>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-20">
          <div className="w-24 h-24 border-4 border-yellow-500/20 rounded-full animate-spin-slow">
            <div className="w-full h-full border-2 border-red-500/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />
          </div>
        </div>
        <div className="absolute bottom-20 right-20">
          <div className="w-20 h-20 border-4 border-orange-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '6s' }}>
            <div className="w-full h-full border-2 border-yellow-500/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
          </div>
        </div>
        <div className="absolute top-1/3 right-32">
          <div className="w-16 h-16 border-3 border-red-500/20 rounded-full animate-pulse" />
        </div>
        <div className="absolute bottom-1/3 left-32">
          <div className="w-12 h-12 border-2 border-yellow-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Theater Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient theater lighting */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 300px 800px at 20% 50%,
                rgba(220,20,60,0.1) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse 300px 800px at 80% 50%,
                rgba(220,20,60,0.1) 0%,
                transparent 50%
              )
            `,
          }}
        />
        
        {/* Sparkle Effects */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CurtainLoader;
