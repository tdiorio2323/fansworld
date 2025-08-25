import React from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  showHome?: boolean;
  homeLabel?: string;
  maxItems?: number;
  truncate?: boolean;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items = [],
  separator = <ChevronRightIcon className="w-4 h-4" />,
  className,
  variant = 'default',
  showHome = true,
  homeLabel = 'Home',
  maxItems = 5,
  truncate = true
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const generated: BreadcrumbItem[] = [];

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      generated.push({ label, href });
    });

    return generated;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Truncate breadcrumbs if too many
  const displayBreadcrumbs = (() => {
    if (!truncate || breadcrumbs.length <= maxItems) return breadcrumbs;
    
    const first = breadcrumbs.slice(0, 1);
    const last = breadcrumbs.slice(-2);
    return [...first, { label: '...', href: undefined }, ...last];
  })();

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30';
      case 'chrome':
        return 'bg-gradient-chrome border-chrome-silver/50';
      case 'glass':
        return 'bg-glass-surface/50 backdrop-blur-lg border-glass-border/30';
      default:
        return 'bg-card border-border';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'text-purple-200 hover:text-purple-100';
      case 'chrome':
        return 'text-chrome-platinum hover:text-white';
      case 'glass':
        return 'text-foreground/80 hover:text-foreground';
      default:
        return 'text-muted-foreground hover:text-foreground';
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center px-4 py-2 rounded-lg border',
        getVariantStyles(),
        className
      )}
    >
      <ol className="flex items-center space-x-2">
        {showHome && (
          <>
            <li>
              <Link
                to="/"
                className={cn(
                  'flex items-center gap-1 transition-colors',
                  getTextStyles()
                )}
              >
                <HomeIcon className="w-4 h-4" />
                <span className="sr-only md:not-sr-only">{homeLabel}</span>
              </Link>
            </li>
            {displayBreadcrumbs.length > 0 && (
              <li className="text-muted-foreground/50">{separator}</li>
            )}
          </>
        )}
        
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = item.label === '...';
          
          return (
            <React.Fragment key={index}>
              <li>
                {isLast || isEllipsis ? (
                  <span
                    className={cn(
                      'flex items-center gap-1',
                      isLast ? 'font-medium text-foreground' : 'text-muted-foreground/50'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon}
                    <span className={truncate ? 'max-w-[200px] truncate' : ''}>
                      {item.label}
                    </span>
                  </span>
                ) : (
                  <Link
                    to={item.href!}
                    className={cn(
                      'flex items-center gap-1 transition-colors',
                      getTextStyles()
                    )}
                  >
                    {item.icon}
                    <span className={truncate ? 'max-w-[200px] truncate' : ''}>
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className="text-muted-foreground/50">{separator}</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </motion.nav>
  );
};