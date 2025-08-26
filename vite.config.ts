/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Removed lovable-tagger import - not needed for local development

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  },
  plugins: [
    react()
    // Removed componentTagger() - Lovable-specific development tool
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'stripe-vendor': ['@stripe/stripe-js', 'stripe'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
