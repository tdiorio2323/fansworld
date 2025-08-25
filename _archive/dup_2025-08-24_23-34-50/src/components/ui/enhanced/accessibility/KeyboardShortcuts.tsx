import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle help key
      if (enableHelp && event.key === helpKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Handle shortcuts
      for (const shortcut of shortcuts) {
        const keys = shortcut.keys.map(k => k.toLowerCase());
        const currentKeys: string[] = [];
        
        if (event.ctrlKey || event.metaKey) currentKeys.push('ctrl');
        if (event.altKey) currentKeys.push('alt');
        if (event.shiftKey) currentKeys.push('shift');
        currentKeys.push(event.key.toLowerCase());

        if (keys.length === currentKeys.length && keys.every(key => currentKeys.includes(key))) {
          const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
            (event.target as HTMLElement).tagName
          );
          
          if (!isFormElement || shortcut.global) {
            event.preventDefault();
            shortcut.action();
            return;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enableHelp, helpKey]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-luxury border-purple-500/30';
      case 'chrome':
        return 'bg-gradient-chrome-luxury border-chrome-silver/50';
      case 'glass':
        return 'bg-gradient-glass border-white/20 backdrop-blur-xl';
      default:
        return 'bg-background border-border';
    }
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl border p-6",
                getVariantStyles(),
                className
              )}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="shortcuts-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="shortcuts-title" className="text-2xl font-bold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg hover:bg-background/20 transition-colors"
                  aria-label="Close shortcuts help"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={`${category}-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/20"
                        >
                          <div>
                            <p className="font-medium">{shortcut.label}</p>
                            {shortcut.description && (
                              <p className="text-sm text-muted-foreground">
                                {shortcut.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <kbd
                                key={keyIndex}
                                className="px-2 py-1 text-xs font-mono bg-background/40 border border-border/50 rounded"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Press <kbd className="px-2 py-1 text-xs font-mono bg-background/40 border border-border/50 rounded">
                    {helpKey}
                  </kbd> to toggle this help panel
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Default shortcuts for common actions
export const defaultShortcuts: Shortcut[] = [
  {
    keys: ['?'],
    label: 'Show help',
    description: 'Display keyboard shortcuts help',
    action: () => {},
    category: 'General'
  },
  {
    keys: ['Escape'],
    label: 'Close modal',
    description: 'Close any open modal or overlay',
    action: () => {},
    category: 'General'
  },
  {
    keys: ['ctrl', 'k'],
    label: 'Search',
    description: 'Open search dialog',
    action: () => {},
    category: 'Navigation'
  },
  {
    keys: ['g', 'h'],
    label: 'Go home',
    description: 'Navigate to home page',
    action: () => {},
    category: 'Navigation'
  },
  {
    keys: ['g', 'd'],
    label: 'Go to dashboard',
    description: 'Navigate to dashboard',
    action: () => {},
    category: 'Navigation'
  },
  {
    keys: ['n'],
    label: 'New post',
    description: 'Create a new post',
    action: () => {},
    category: 'Content'
  },
  {
    keys: ['s'],
    label: 'Save',
    description: 'Save current content',
    action: () => {},
    category: 'Content',
    global: true
  }
];