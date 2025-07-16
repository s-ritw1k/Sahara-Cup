import { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Player data based on completed group matches
const qualifiedPlayers = {
  // Completed Groups (A, B, C, D)
  groupA: { first: 'Treesa James', second: 'Durga Tammireddy' },
  groupB: { first: 'Sanchita Chakrabarty', second: 'Anjuman Hasan' },
  groupC: { first: 'Srija Panyala', second: 'Arishti Salaria' },
  groupD: { first: 'Induja Kala', second: 'Sai Keerthi Tulluru' },
  // Pending Groups (E, F, G, H)
  groupE: { first: 'TBD', second: 'TBD' },
  groupF: { first: 'TBD', second: 'TBD' },
  groupG: { first: 'TBD', second: 'TBD' },
  groupH: { first: 'TBD', second: 'TBD' },
};

export default function Knockout() {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phases = [
      () => setAnimationPhase(1), // Title
      () => setAnimationPhase(2), // Round of 16
      () => setAnimationPhase(3), // Quarter finals
      () => setAnimationPhase(4), // Semi finals
      () => setAnimationPhase(5), // Final
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, index * 400);
    });
  }, []);

  return (
    <div className="animate-fade-in min-h-screen px-4 py-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className={clsx(
          'transition-all duration-800 transform',
          animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        )}>
          <div className="flex items-center justify-center mb-4">
            <TrophyIcon className="h-12 w-12 text-champion-gold-400 animate-float-gentle mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-champion-gold-400 via-white to-champion-gold-400 bg-clip-text text-transparent">
              KNOCKOUT STAGE
            </h1>
            <TrophyIcon className="h-12 w-12 text-champion-gold-400 animate-float-gentle ml-3" />
          </div>
          
          <p className="text-lg text-slate-300 mb-6">
            Single elimination bracket • Best of 3 sets • Winner takes all
          </p>
        </div>
      </div>

      {/* Professional Tournament Bracket */}
      <div className="tournament-bracket">
        <div className="bracket-wrapper">
          <div className="bracket-grid">
            
            {/* Round of 16 - Left Side */}
            <div className="bracket-round r16">
              <div className="round-label r16">Round of 16</div>
              <div className={clsx(
                'bracket-match-card qualified',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )}>
                <div className="font-semibold text-white">{qualifiedPlayers.groupA.first}</div>
                <div className="text-xs text-slate-400">#1 Group A</div>
              </div>
              <div className={clsx(
                'bracket-match-card qualified',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '100ms' }}>
                <div className="font-semibold text-white">{qualifiedPlayers.groupB.second}</div>
                <div className="text-xs text-slate-400">#2 Group B</div>
              </div>
              <div className={clsx(
                'bracket-match-card qualified',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '200ms' }}>
                <div className="font-semibold text-white">{qualifiedPlayers.groupC.first}</div>
                <div className="text-xs text-slate-400">#1 Group C</div>
              </div>
              <div className={clsx(
                'bracket-match-card qualified',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '300ms' }}>
                <div className="font-semibold text-white">{qualifiedPlayers.groupD.second}</div>
                <div className="text-xs text-slate-400">#2 Group D</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '400ms' }}>
                <div className="font-semibold text-slate-400">{qualifiedPlayers.groupE.first}</div>
                <div className="text-xs text-slate-500">#1 Group E</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '500ms' }}>
                <div className="font-semibold text-slate-400">{qualifiedPlayers.groupF.second}</div>
                <div className="text-xs text-slate-500">#2 Group F</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '600ms' }}>
                <div className="font-semibold text-slate-400">{qualifiedPlayers.groupG.first}</div>
                <div className="text-xs text-slate-500">#1 Group G</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '700ms' }}>
                <div className="font-semibold text-slate-400">{qualifiedPlayers.groupH.second}</div>
                <div className="text-xs text-slate-500">#2 Group H</div>
              </div>
            </div>

            {/* Connection Column 1 */}
            <div className="flex justify-center items-center">
              <svg className="bracket-connections" width="50" height="400">
                {[...Array(4)].map((_, i) => (
                  <g key={i}>
                    <path
                      d={`M 5 ${50 + i * 100} L 25 ${50 + i * 100} L 25 ${75 + i * 100} L 45 ${75 + i * 100}`}
                      className={clsx(
                        'connection-line',
                        animationPhase >= 3 ? 'active' : ''
                      )}
                    />
                    <path
                      d={`M 5 ${100 + i * 100} L 25 ${100 + i * 100} L 25 ${75 + i * 100}`}
                      className={clsx(
                        'connection-line',
                        animationPhase >= 3 ? 'active' : ''
                      )}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Quarter Finals - Left */}
            <div className="bracket-round qf">
              <div className="round-label qf">Quarter Finals</div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
              )}>
                <div className="font-semibold text-slate-400">QF1 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '100ms' }}>
                <div className="font-semibold text-slate-400">QF2 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '200ms' }}>
                <div className="font-semibold text-slate-400">QF3 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '300ms' }}>
                <div className="font-semibold text-slate-400">QF4 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
            </div>

            {/* Connection Column 2 */}
            <div className="flex justify-center items-center">
              <svg className="bracket-connections" width="50" height="300">
                {[...Array(2)].map((_, i) => (
                  <g key={i}>
                    <path
                      d={`M 5 ${60 + i * 180} L 25 ${60 + i * 180} L 25 ${120 + i * 180} L 45 ${120 + i * 180}`}
                      className={clsx(
                        'connection-line',
                        animationPhase >= 4 ? 'active' : ''
                      )}
                    />
                    <path
                      d={`M 5 ${180 + i * 180} L 25 ${180 + i * 180} L 25 ${120 + i * 180}`}
                      className={clsx(
                        'connection-line',
                        animationPhase >= 4 ? 'active' : ''
                      )}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Semi Finals */}
            <div className="bracket-round sf">
              <div className="round-label sf">Semi Finals</div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 4 ? 'opacity-100' : 'opacity-0'
              )}>
                <div className="font-semibold text-slate-400">SF1 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
              <div className={clsx(
                'bracket-match-card tbd',
                animationPhase >= 4 ? 'opacity-100' : 'opacity-0'
              )} style={{ transitionDelay: '100ms' }}>
                <div className="font-semibold text-slate-400">SF2 Winner</div>
                <div className="text-xs text-slate-500">TBD</div>
              </div>
            </div>

            {/* Connection Column 3 */}
            <div className="flex justify-center items-center">
              <svg className="bracket-connections" width="50" height="200">
                <path
                  d="M 5 60 L 25 60 L 25 100 L 45 100"
                  className={clsx(
                    'connection-line',
                    animationPhase >= 5 ? 'active' : ''
                  )}
                />
                <path
                  d="M 5 140 L 25 140 L 25 100"
                  className={clsx(
                    'connection-line',
                    animationPhase >= 5 ? 'active' : ''
                  )}
                />
              </svg>
            </div>

            {/* Final */}
            <div className="bracket-round final">
              <div className="round-label final">Final</div>
              <div className={clsx(
                'bracket-match-card final tbd',
                animationPhase >= 5 ? 'opacity-100' : 'opacity-0'
              )}>
                <div className="flex items-center justify-center mb-1">
                  <TrophyIcon className="h-5 w-5 text-champion-gold-400 mr-2" />
                  <span className="font-bold text-champion-gold-400">CHAMPION</span>
                </div>
                <div className="font-semibold text-slate-400">TBD</div>
                <div className="text-xs text-champion-gold-400 mt-1">Sahara Cup Winner</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
