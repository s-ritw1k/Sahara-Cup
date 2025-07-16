/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Table Tennis Green (Primary Brand)
        'table-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Paddle Orange (Accent)
        'paddle-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Championship Gold
        'champion-gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Professional Dark (Enhanced Slate)
        'pro-dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Net Silver
        'net-silver': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Tournament Status Colors
        'tournament': {
          live: '#dc2626',
          upcoming: '#16a34a',
          completed: '#22c55e',
        },
        // Maintain backward compatibility
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      backgroundImage: {
        'gradient-table': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-paddle': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-champion': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-professional': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'tournament-bg': 'radial-gradient(circle at 25% 25%, rgba(20, 83, 45, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(30, 41, 59, 0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'tournament': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'tournament-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'tournament-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'tournament-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-orange': '0 0 20px rgba(251, 146, 60, 0.3)',
        'glow-gold': '0 0 30px rgba(251, 191, 36, 0.5)',
        'glow-live': '0 0 30px rgba(220, 38, 38, 0.6)',
        'glow-silver': '0 0 20px rgba(156, 163, 175, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulseGlow 3s ease-in-out infinite alternate',
        'shine': 'shine 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'float-gentle': 'float-gentle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'card-hover': 'card-hover 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%': { opacity: '1', boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '100%': { opacity: '0.7', boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'tournament-title': ['3rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'section-title': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.025em' }],
        'card-title': ['1.75rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.02em' }],
        'score-display': ['2rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'tournament': '1rem',
        'tournament-lg': '1.5rem',
        'tournament-xl': '2rem',
      },
      backdropBlur: {
        'tournament': '10px',
      },
      letterSpacing: {
        'tournament': '-0.025em',
      },
    },
  },
}
