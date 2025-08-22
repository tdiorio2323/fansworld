import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chrome: {
					platinum: 'hsl(var(--chrome-platinum))',
					silver: 'hsl(var(--chrome-silver))',
					dark: 'hsl(var(--chrome-dark))',
					black: 'hsl(var(--chrome-black))',
					highlight: 'hsl(var(--chrome-highlight))',
					accent: 'hsl(var(--chrome-accent))',
					glow: 'hsl(var(--chrome-glow))'
				},
				neon: {
					blue: 'hsl(var(--neon-blue))',
					pink: 'hsl(var(--electric-pink))',
					purple: 'hsl(var(--cyber-purple))',
					orange: 'hsl(var(--vibrant-orange))',
					green: 'hsl(var(--lime-green))'
				},
				metal: {
					rose: 'hsl(var(--rose-gold))',
					gold: 'hsl(var(--warm-gold))',
					platinum: 'hsl(var(--platinum))',
					titanium: 'hsl(var(--titanium))',
					obsidian: 'hsl(var(--obsidian))'
				},
				glass: {
					surface: 'hsl(var(--glass-surface))',
					border: 'hsl(var(--glass-border))',
					tint: 'hsl(var(--glass-tint))'
				},
				holo: {
					pink: 'hsl(var(--holo-pink))',
					blue: 'hsl(var(--holo-blue))',
					purple: 'hsl(var(--holo-purple))',
					gold: 'hsl(var(--holo-gold))',
					cyan: 'hsl(var(--holo-cyan))',
					green: 'hsl(var(--holo-green))',
					orange: 'hsl(var(--holo-orange))'
				}
			},
			backgroundImage: {
				'gradient-luxury': 'var(--gradient-luxury)',
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-chrome': 'var(--gradient-chrome)',
				'gradient-chrome-luxury': 'var(--gradient-chrome-luxury)',
				'gradient-chrome-mirror': 'var(--gradient-chrome-mirror)',
				'gradient-chrome-neon': 'var(--gradient-chrome-neon)',
				'gradient-liquid-metal': 'var(--gradient-liquid-metal)',
				'gradient-cyber-chrome': 'var(--gradient-cyber-chrome)',
				'gradient-holo': 'var(--gradient-holo)',
				'gradient-crystal': 'var(--gradient-crystal)',
				'gradient-champagne': 'var(--gradient-champagne)',
			},
			boxShadow: {
				'luxury': 'var(--shadow-luxury)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
				'chrome': 'var(--shadow-chrome)',
				'chrome-glow': 'var(--shadow-chrome-glow)',
				'neon': 'var(--shadow-neon)',
				'liquid': 'var(--shadow-liquid)',
				'glass': 'var(--shadow-glass)',
				'holo': 'var(--shadow-holo)',
			},
			transitionProperty: {
				'luxury': 'var(--transition-luxury)',
				'fast': 'var(--transition-fast)',
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
				'serif': ['Playfair Display', 'Georgia', 'serif'],
				'luxury': ['Montserrat', 'Poppins', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-up': 'fade-up 0.8s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'shimmer': 'shimmer 2s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
