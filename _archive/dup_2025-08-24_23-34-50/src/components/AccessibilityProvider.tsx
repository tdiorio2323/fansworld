import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    setIsReducedMotion(prefersReducedMotion.matches);
    setIsHighContrast(prefersHighContrast.matches);

    // Listen for changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    prefersHighContrast.addEventListener('change', handleHighContrastChange);

    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
      prefersHighContrast.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  useEffect(() => {
    // Apply high contrast class to document
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    // Apply keyboard navigation class when user starts using keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
  };

  return (
    <AccessibilityContext.Provider 
      value={{
        announceToScreenReader,
        isHighContrast,
        isReducedMotion,
        toggleHighContrast
      }}
    >
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={() => announceToScreenReader('Skip to main content link focused')}
      >
        Skip to main content
      </a>
      
      {/* Screen reader announcements container */}
      <div id="screen-reader-announcements" className="sr-only" aria-live="polite" aria-atomic="true" />
      
      {children}
    </AccessibilityContext.Provider>
  );
};