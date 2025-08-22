import { useState, useEffect, useCallback } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delay?: number; // Delay before exit intent is active (ms)
  maxTriggers?: number; // Maximum number of times to show
  sessionOnly?: boolean; // Only track for current session
}

export const useExitIntent = (options: UseExitIntentOptions = {}) => {
  const {
    enabled = true,
    delay = 3000, // 3 seconds default
    maxTriggers = 1,
    sessionOnly = true
  } = options;

  const [canTrigger, setCanTrigger] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Storage key for persistence
  const storageKey = sessionOnly ? 'exitIntent_session' : 'exitIntent_persistent';
  const storage = sessionOnly ? sessionStorage : localStorage;

  // Initialize trigger count from storage
  useEffect(() => {
    if (enabled) {
      try {
        const stored = storage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          setTriggerCount(data.count || 0);
        }
      } catch (error) {
        console.warn('Failed to read exit intent storage:', error);
      }

      // Enable triggering after delay
      const timer = setTimeout(() => {
        setCanTrigger(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [enabled, delay, storageKey, storage]);

  // Exit intent detection
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (
      canTrigger &&
      !hasTriggered &&
      triggerCount < maxTriggers &&
      e.clientY <= 0
    ) {
      setHasTriggered(true);
      const newCount = triggerCount + 1;
      setTriggerCount(newCount);
      
      // Save to storage
      try {
        storage.setItem(storageKey, JSON.stringify({
          count: newCount,
          lastTriggered: Date.now()
        }));
      } catch (error) {
        console.warn('Failed to save exit intent storage:', error);
      }

      return true; // Indicates exit intent was triggered
    }
    return false;
  }, [canTrigger, hasTriggered, triggerCount, maxTriggers, storageKey, storage]);

  // Set up event listener
  useEffect(() => {
    if (enabled) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [handleMouseLeave, enabled]);

  // Reset for current session (useful for testing)
  const reset = useCallback(() => {
    setHasTriggered(false);
    setTriggerCount(0);
    try {
      storage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear exit intent storage:', error);
    }
  }, [storageKey, storage]);

  return {
    hasTriggered,
    triggerCount,
    canTrigger: canTrigger && triggerCount < maxTriggers,
    reset
  };
};