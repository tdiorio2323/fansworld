import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  InboxIcon,
  PhotoIcon,
  UsersIcon,
  DocumentTextIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconType?: 'inbox' | 'photo' | 'users' | 'document' | 'folder' | 'search' | 'custom';
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'luxury' | 'chrome' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  iconType = 'inbox',
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
  className,
  animated = true
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    const iconClass = cn(
      size === 'sm' && 'w-12 h-12',
      size === 'md' && 'w-16 h-16',
      size === 'lg' && 'w-20 h-20'
    );

    switch (iconType) {
      case 'photo':
        return <PhotoIcon className={iconClass} />;
      case 'users':
        return <UsersIcon className={iconClass} />;
      case 'document':
        return <DocumentTextIcon className={iconClass} />;
      case 'folder':
        return <FolderIcon className={iconClass} />;
      case 'search':
        return <MagnifyingGlassIcon className={iconClass} />;
      case 'inbox':
      default:
        return <InboxIcon className={iconClass} />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'luxury':
        return 'bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-purple-500/20';
      case 'chrome':
        return 'bg-gradient-chrome-luxury border-chrome-silver/30';
      case 'glass':
        return 'bg-glass-surface/50 backdrop-blur-lg border-glass-border/20';
      case 'minimal':
        return '';
      default:
        return 'bg-card/50 border-border/50';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-8 px-6';
      case 'lg':
        return 'py-16 px-12';
      case 'md':
      default:
        return 'py-12 px-8';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const Container = animated ? motion.div : 'div';
  const containerProps = animated ? {
    initial: "hidden",
    animate: "visible",
    variants: containerVariants
  } : {};

  return (
    <Container
      {...containerProps}
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-2xl border',
        getSizeStyles(),
        variant !== 'minimal' && getVariantStyles(),
        className
      )}
    >
      {animated ? (
        <motion.div
          variants={itemVariants}
          className={cn(
            'mb-4 text-muted-foreground/60',
            variant === 'luxury' && 'text-purple-400/60',
            variant === 'chrome' && 'text-chrome-silver'
          )}
        >
          {getIcon()}
        </motion.div>
      ) : (
        <div className={cn(
          'mb-4 text-muted-foreground/60',
          variant === 'luxury' && 'text-purple-400/60',
          variant === 'chrome' && 'text-chrome-silver'
        )}>
          {getIcon()}
        </div>
      )}

      {animated ? (
        <motion.h3
          variants={itemVariants}
          className={cn(
            'font-semibold',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl'
          )}
        >
          {title}
        </motion.h3>
      ) : (
        <h3 className={cn(
          'font-semibold',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl'
        )}>
          {title}
        </h3>
      )}

      {description && (
        animated ? (
          <motion.p
            variants={itemVariants}
            className={cn(
              'mt-2 text-muted-foreground',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              'max-w-md'
            )}
          >
            {description}
          </motion.p>
        ) : (
          <p className={cn(
            'mt-2 text-muted-foreground',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            'max-w-md'
          )}>
            {description}
          </p>
        )
      )}

      {(action || secondaryAction) && (
        <div className={cn(
          'flex flex-col sm:flex-row gap-3',
          size === 'sm' && 'mt-4',
          size === 'md' && 'mt-6',
          size === 'lg' && 'mt-8'
        )}>
          {action && (
            animated ? (
              <motion.button
                variants={itemVariants}
                onClick={action.onClick}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                  size === 'sm' && 'px-4 py-2 text-sm',
                  size === 'md' && 'px-6 py-2.5',
                  size === 'lg' && 'px-8 py-3 text-lg',
                  action.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  action.variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
                  (!action.variant || action.variant === 'primary') && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {action.icon || <PlusIcon className="w-4 h-4" />}
                {action.label}
              </motion.button>
            ) : (
              <button
                onClick={action.onClick}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                  size === 'sm' && 'px-4 py-2 text-sm',
                  size === 'md' && 'px-6 py-2.5',
                  size === 'lg' && 'px-8 py-3 text-lg',
                  action.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  action.variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
                  (!action.variant || action.variant === 'primary') && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {action.icon || <PlusIcon className="w-4 h-4" />}
                {action.label}
              </button>
            )
          )}

          {secondaryAction && (
            animated ? (
              <motion.button
                variants={itemVariants}
                onClick={secondaryAction.onClick}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground',
                  size === 'sm' && 'px-4 py-2 text-sm',
                  size === 'md' && 'px-6 py-2.5',
                  size === 'lg' && 'px-8 py-3 text-lg'
                )}
              >
                {secondaryAction.label}
              </motion.button>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground',
                  size === 'sm' && 'px-4 py-2 text-sm',
                  size === 'md' && 'px-6 py-2.5',
                  size === 'lg' && 'px-8 py-3 text-lg'
                )}
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </Container>
  );
};

// Pre-configured empty states
export const NoDataEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState
    title="No data yet"
    description="Start by adding some data to see it displayed here"
    iconType="inbox"
    {...props}
  />
);

export const NoResultsEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState
    title="No results found"
    description="Try adjusting your search or filters"
    iconType="search"
    {...props}
  />
);

export const NoContentEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState
    title="No content available"
    description="Upload your first piece of content to get started"
    iconType="photo"
    action={{
      label: "Upload Content",
      onClick: () => console.log('Upload content'),
      icon: <ArrowUpTrayIcon className="w-4 h-4" />
    }}
    {...props}
  />
);