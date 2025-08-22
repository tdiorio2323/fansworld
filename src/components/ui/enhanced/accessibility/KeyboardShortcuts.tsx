import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Shortcut {
  keys: string[];
  label: string;
  description?: string;
  action: () => void;
  category?: string;
  global?: boolean;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
  enableHelp?: boolean;
  helpKey?: string;
  className?: string;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  shortcuts,
  enableHelp = true,
  helpKey = '?',
  className,
  variant = 'default'
}) => {
  const [showHelp, setShowHelp] = useState(false);

  // Register all shortcuts
  shortcuts.forEach(shortcut => {
    const keys = shortcut.keys.join('+');
    useHotkeys(
      keys,
      (e) => {
        e.preventDefault();
        shortcut.action();
      },
      {
        enabled: true,
        enableOnFormTags: shortcut.global ? ['INPUT', 'TEXTAREA', 'SELECT'] : undefined
      }
    );
  });

  // Register help shortcut
  if (enableHelp) {
    useHotkeys(helpKey, () => setShowHelp(prev => !prev));
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-luxury border-purple-500/30';
      case 'chrome':
        return 'bg-gradient-chrome-luxury border-chrome-silver/50';
      case 'glass':
        return 'bg-glass-surface/95 backdrop-blur-3xl border-glass-border/30';
      default:
        return 'bg-card border-border';
    }
  };

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'w-full max-w-2xl max-h-[80vh] overflow-auto rounded-2xl border p-6',
                getVariantStyles(),
                className
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                  aria-label="Close help"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{shortcut.label}</p>
                            {shortcut.description && (
                              <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <kbd className={cn(
                                  'px-2 py-1 text-xs font-semibold rounded',
                                  'bg-muted text-muted-foreground border border-border'
                                )}>
                                  {key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-muted-foreground">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Press <kbd className="px-2 py-1 text-xs font-semibold rounded bg-muted border border-border">{helpKey}</kbd> to toggle this help
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {showHelp ? 'Keyboard shortcuts help is open' : 'Keyboard shortcuts help is closed'}
      </div>
    </>
  );
};

// Pre-configured shortcut sets
export const defaultShortcuts: Shortcut[] = [
  {
    keys: ['cmd', 'k'],
    label: 'Command Palette',
    description: 'Open command palette',
    action: () => console.log('Open command palette'),
    category: 'Navigation'
  },
  {
    keys: ['cmd', '/'],
    label: 'Search',
    description: 'Focus search bar',
    action: () => console.log('Focus search'),
    category: 'Navigation'
  },
  {
    keys: ['g', 'h'],
    label: 'Go Home',
    description: 'Navigate to home page',
    action: () => window.location.href = '/',
    category: 'Navigation'
  },
  {
    keys: ['g', 'p'],
    label: 'Go to Profile',
    description: 'Navigate to profile page',
    action: () => window.location.href = '/profile',
    category: 'Navigation'
  },
  {
    keys: ['n'],
    label: 'New Post',
    description: 'Create a new post',
    action: () => console.log('Create new post'),
    category: 'Actions'
  },
  {
    keys: ['cmd', 'enter'],
    label: 'Submit',
    description: 'Submit current form',
    action: () => console.log('Submit form'),
    category: 'Actions',
    global: true
  }
];