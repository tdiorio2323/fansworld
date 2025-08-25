import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLink {
  id: string;
  label: string;
  href: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { id: 'main', label: 'Skip to main content', href: '#main' },
  { id: 'nav', label: 'Skip to navigation', href: '#navigation' },
  { id: 'search', label: 'Skip to search', href: '#search' },
  { id: 'footer', label: 'Skip to footer', href: '#footer' }
];

export const SkipLinks: React.FC<SkipLinksProps> = ({
  links = defaultLinks,
  className
}) => {
  return (
    <div className={cn('skip-links', className)}>
      {links.map(link => (
        <a
          key={link.id}
          href={link.href}
          className={cn(
            'sr-only focus:not-sr-only',
            'absolute top-4 left-4 z-[100]',
            'px-4 py-2 rounded-lg',
            'bg-primary text-primary-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'transition-all duration-200'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

// Focus management utilities
export const FocusTrap: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}> = ({ children, active = true, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Announce component for screen readers
export const Announce: React.FC<{
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}> = ({ message, priority = 'polite', className }) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
};

// Visually hidden component
export const VisuallyHidden: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children, asChild = false }) => {
  const Component = asChild ? React.Fragment : 'span';
  
  return (
    <Component>
      <span className="sr-only">{children}</span>
    </Component>
  );
};