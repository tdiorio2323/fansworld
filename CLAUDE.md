# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Tech Stack & Architecture

This is a React-based content creator platform built with modern web technologies:

**Core Framework:**
- **Vite** - Build tool and dev server
- **React 18** with TypeScript for type safety
- **React Router DOM** for client-side routing

**UI & Styling:**
- **shadcn/ui** - Component library built on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework with extensive custom design system
- **Lucide React** - Icon library
- Custom luxury/premium design system with chrome, neon, metal, and glass themes

**State Management & Data:**
- **TanStack Query** - Server state management and caching
- **Supabase** - Backend-as-a-Service for database and authentication
- **React Hook Form** with Zod validation for form handling

**Key Features:**
- Creator profile pages with subscription management
- Content discovery and media galleries
- User dashboard and messaging system
- Premium subscription billing integration
- Responsive design with mobile-first approach

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components (buttons, cards, etc.)
│   ├── CreatorCard.tsx # Creator profile cards
│   ├── MediaTile.tsx   # Content media display
│   └── Navbar.tsx      # Navigation component
├── pages/              # Route-based page components
│   ├── Home.tsx        # Landing/home page
│   ├── Dashboard.tsx   # User dashboard
│   ├── CreatorProfile.tsx # Creator profile pages
│   └── ...
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── main.tsx           # App entry point
```

## Configuration Files

- `tailwind.config.ts` - Extensive Tailwind configuration with custom design system
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- `vite.config.ts` - Vite build configuration

## Development Notes

- Uses TypeScript with relaxed settings (noImplicitAny: false, strict null checks disabled)
- Imports use `@/` path alias for src directory
- Custom CSS variables defined for luxury design themes (chrome, neon, metal, glass, holo)
- Supabase integration with pre-configured client setup
- shadcn/ui components are customizable and follow design system patterns

## Design System

The project implements a luxury content creator platform theme with:
- Chrome/metallic aesthetic with gradients and shadows
- Neon accent colors (blue, pink, purple, orange, green)
- Glass morphism effects with backdrop blur
- Custom animations (fade-in, shimmer, scale-in)
- Responsive typography with luxury font stacks

## Project Origin

This project was initially generated on [Lovable](https://lovable.dev/projects/ab5a1da0-52c5-455c-ae12-01a7caaf28fe) and uses the following technologies:
- Vite for fast development and building
- TypeScript for type safety
- React for UI components
- shadcn-ui for pre-built components
- Tailwind CSS for styling

## Common Issues and Solutions

**ESLint Fast Refresh Warnings:**
- shadcn/ui components may show fast refresh warnings when exporting both components and variants
- These warnings don't affect functionality but can be resolved by moving variants to separate files

**TypeScript Configuration:**
- The project uses relaxed TypeScript settings for faster development
- Path alias `@/` maps to `./src/` directory
- No implicit any and strict null checks are disabled for flexibility