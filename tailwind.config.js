const fs = require('fs');
let luxuryTokens = {};
try {
  luxuryTokens = JSON.parse(fs.readFileSync('./luxury-tokens.json', 'utf-8'));
} catch (e) {
  luxuryTokens = {
    fonts: {
      display: 'Bebas Neue',
      heading: 'Inter',
      body: 'Inter'
    },
    colors: {
      bg: '#0f172a',
      fg: '#ffffff',
      muted: '#64748b',
      glass: '#ffffff0d',
      border: '#334155',
      accent: '#06b6d4',
      accent2: '#8b5cf6'
    },
    effects: {
      backdropBlur: '24px',
      radius: '16px',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'display': luxuryTokens.fonts.display.split(','),
        'heading': luxuryTokens.fonts.heading.split(','),
        'body': luxuryTokens.fonts.body.split(','),
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // TD Studios Ultra-Luxury Design Tokens
        'td-bg': luxuryTokens.colors?.bg || '#0f172a',
        'td-fg': luxuryTokens.colors?.fg || '#ffffff',
        'td-muted': luxuryTokens.colors?.muted || '#64748b',
        'td-glass': luxuryTokens.colors?.glass || '#ffffff0d',
        'td-border': luxuryTokens.colors?.border || '#334155',
        'td-accent': luxuryTokens.colors?.accent || '#06b6d4',
        'td-accent2': luxuryTokens.colors?.accent2 || '#8b5cf6',
        
        // Glass morphism color palette
        'glass-surface': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'chrome-platinum': 'rgba(226, 232, 240, 0.8)',
        'holo-pink': 'rgba(236, 72, 153, 0.6)',
        'neon-blue': 'rgba(6, 182, 212, 0.8)',
        
        border: 'rgb(55 65 81)', // gray-700
        background: 'rgb(17 24 39)', // gray-900
      },
      
      backgroundImage: {
        'gradient-crystal': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'gradient-chrome': 'linear-gradient(135deg, rgba(226,232,240,0.2), rgba(148,163,184,0.1))',
        'gradient-luxury': 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.1))',
        'gradient-holo': 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      backdropBlur: {
        'td': luxuryTokens.effects.backdropBlur,
        'luxury': '32px',
        'ultra': '40px'
      },
      borderRadius: {
        'td': luxuryTokens.effects.radius,
        'luxury': '24px'
      },
      boxShadow: {
        'td': luxuryTokens.effects?.shadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury': '0 25px 80px rgba(0,0,0,.6)',
        'premium': '0 35px 100px rgba(0,0,0,.7)',
        'ultra': '0 40px 120px rgba(0,0,0,.8)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px rgba(6, 182, 212, 0.5)',
        'chrome-glow': '0 0 30px rgba(226, 232, 240, 0.3)',
        'neon': '0 0 20px rgba(6, 182, 212, 0.8)',
        'holo': '0 8px 32px rgba(236, 72, 153, 0.37)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)'
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-morphism': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-luxury': {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.text-shadow-glow': {
          'text-shadow': '0 0 10px currentColor',
        }
      }
      addUtilities(newUtilities)
    }
  ],
} 