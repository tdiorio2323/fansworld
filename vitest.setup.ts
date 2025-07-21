import '@testing-library/jest-dom';
import { vi } from 'vitest';

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