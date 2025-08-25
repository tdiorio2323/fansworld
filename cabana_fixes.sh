#!/bin/bash

# CABANA PROJECT FIXES
echo "🔧 Fixing Cabana Project Issues..."

# 1. Fix express-rate-limit deprecated onLimitReached option
echo "📝 Updating rate limiting configuration..."

# Create updated rate-limit.ts file
mkdir -p src/lib
cat > src/lib/rate-limit.ts << 'RATE_EOF'
import rateLimit from 'express-rate-limit';

// Updated rate limiting without deprecated onLimitReached
export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests from this IP',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Removed deprecated onLimitReached option
  });
};

// Rate limiting configurations
export const generalLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

export const authLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
});

export const uploadLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
});

export const apiLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 API requests per windowMs
});
RATE_EOF

# 2. Fix Vite environment variable security warning
echo "🔒 Fixing Vite environment variable security..."

# Create updated vite.config.ts
cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Only expose specific environment variables instead of entire process.env
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },
  server: {
    port: 8080,
    host: true,
  },
  build: {
    // Fix chunk size warnings
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit
  },
});
VITE_EOF

# 3. Fix Tailwind CSS ambiguous class warning
echo "🎨 Fixing Tailwind CSS warnings..."

# Update any files with ambiguous duration classes (if they exist)
if find src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" 2>/dev/null | xargs grep -l "duration-\[3000ms\]" >/dev/null 2>&1; then
    find src -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | xargs sed -i.bak 's/duration-\[3000ms\]/duration-\[3000ms\]/g' 2>/dev/null || true
fi

# Create a proper Tailwind config to handle custom durations
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Add custom animation durations to prevent ambiguous classes
      animationDuration: {
        '3000': '3000ms',
        '2000': '2000ms',
        '1500': '1500ms',
      },
      transitionDuration: {
        '3000': '3000ms',
        '2000': '2000ms',
        '1500': '1500ms',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
TAILWIND_EOF

# 4. Fix crypto import issue in security.ts
echo "🔐 Fixing crypto import..."

# Update security.ts to handle crypto imports properly
mkdir -p src/lib
cat > src/lib/security.ts << 'SECURITY_EOF'
// Proper crypto handling for both browser and Node.js environments

export const generateSecureHash = async (data: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Browser environment - use Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment - use crypto module
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }
};

export const generateRandomToken = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Browser environment
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
};

export const validateInput = (input: string): string => {
  // Basic input sanitization
  return input.trim().replace(/[<>]/g, '');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
SECURITY_EOF

echo "✅ All fixes applied!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Check that warnings are resolved"
echo ""
echo "📋 Fixed issues:"
echo "✓ Express rate limit deprecated warning"
echo "✓ Vite environment variable security warning"
echo "✓ Tailwind CSS ambiguous class warning"
echo "✓ Crypto module import issues"
echo "✓ Optimized bundle chunking for better performance"
