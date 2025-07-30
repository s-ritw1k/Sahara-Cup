import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface ConfettiProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active, intensity = 'medium', duration = 5000 }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = [
    '#FFD700', // Gold
    '#FF6B35', // Orange
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#FF5722', // Red-Orange
    '#FFC107', // Amber
  ];

  const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];

  const intensitySettings = {
    low: { count: 30, spawnRate: 0.3 },
    medium: { count: 50, spawnRate: 0.5 },
    high: { count: 80, spawnRate: 0.8 },
  };

  const createConfettiPiece = (id: number): ConfettiPiece => ({
    id,
    x: Math.random() * window.innerWidth,
    y: -20,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  });

  useEffect(() => {
    if (!active) {
      setIsAnimating(false);
      setPieces([]);
      return;
    }

    setIsAnimating(true);
    const settings = intensitySettings[intensity];
    let pieceId = 0;
    let animationId: number;

    // Initial burst
    const initialPieces = Array.from({ length: settings.count }, () => createConfettiPiece(pieceId++));
    setPieces(initialPieces);

    // Continuous spawning
    const spawnInterval = setInterval(() => {
      if (Math.random() < settings.spawnRate) {
        setPieces(prev => [...prev, createConfettiPiece(pieceId++)]);
      }
    }, 100);

    // Animation loop
    const animate = () => {
      setPieces(prev => 
        prev
          .map(piece => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            rotation: piece.rotation + piece.rotationSpeed,
            vy: piece.vy + 0.1, // gravity
            vx: piece.vx * 0.999, // air resistance
          }))
          .filter(piece => piece.y < window.innerHeight + 50) // Remove pieces that fall off screen
      );

      if (isAnimating) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Stop after duration
    const stopTimeout = setTimeout(() => {
      clearInterval(spawnInterval);
      setIsAnimating(false);
      
      // Fade out existing pieces
      setTimeout(() => {
        setPieces([]);
      }, 3000);
    }, duration);

    return () => {
      clearInterval(spawnInterval);
      clearTimeout(stopTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [active, intensity, duration, isAnimating]);

  const renderShape = (piece: ConfettiPiece) => {
    const style = {
      position: 'absolute' as const,
      left: `${piece.x}px`,
      top: `${piece.y}px`,
      width: `${piece.size}px`,
      height: `${piece.size}px`,
      backgroundColor: piece.color,
      transform: `rotate(${piece.rotation}deg)`,
      pointerEvents: 'none' as const,
    };

    switch (piece.shape) {
      case 'circle':
        return (
          <div
            key={piece.id}
            style={{
              ...style,
              borderRadius: '50%',
            }}
          />
        );
      case 'square':
        return (
          <div
            key={piece.id}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div
            key={piece.id}
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!active && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {pieces.map(renderShape)}
    </div>
  );
};

export default Confetti;
