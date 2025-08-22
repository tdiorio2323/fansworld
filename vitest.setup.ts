import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase client before any imports
vi.mock('@/integrations/supabase/client', async () => {
  const actual = await vi.importActual('@/integrations/supabase/__mocks__/client');
  return actual;
});

// Ensure vi is globally available
if (typeof global.vi === 'undefined') {
  global.vi = vi;
}

// Mock localStorage for tests
const localStorageMock = (
  function() {
    let store = {};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      clear: function() {
        store = {};
      }
    };
  }
)();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true // Ensure it's writable for tests
});

// Mock navigator.clipboard globally for tests
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true,
});

// Mock navigator.share for tests
Object.defineProperty(navigator, 'share', {
  value: vi.fn().mockResolvedValue(undefined),
  writable: true,
  configurable: true,
});

// Mock window.matchMedia for tests (needed by Sonner toasts and responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for tests (needed by some UI components)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));