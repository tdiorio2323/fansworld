import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-bebas)'],
      },
      colors: {
        cabana: {
          gold: '#F2C14E',
          ocean: '#5BC0EB',
          lilac: '#A691FF',
          teal: '#67E0C4',
          night: '#0B0E13',
          ink: '#0E1116',
          fog: '#E6E8EE',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,0.25)',
        soft: '0 10px 30px rgba(0,0,0,0.18)',
        ring: '0 0 0 1px rgba(255,255,255,0.18) inset',
      },
      backdropBlur: { xs: '2px' },
      backgroundImage: {
        'lux-gold': 'linear-gradient(135deg, #F2C14E 0%, #FFE7A2 50%, #F2C14E 100%)',
        'lux-holo': 'linear-gradient(135deg, #5BC0EB 0%, #A691FF 50%, #67E0C4 100%)',
        'lux-obsidian':
          'radial-gradient(800px 400px at 70% -10%, rgba(255,255,255,.08), transparent), linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.65))',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        pop: { '0%': { transform: 'scale(.96)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeIn: 'fadeIn .4s ease-out',
        pop: 'pop .12s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
