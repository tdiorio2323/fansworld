import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  variant = 'default',
  children
}) => {
  const getThemeColors = () => {
    switch (variant) {
      case 'luxury':
        return {
          baseColor: 'hsl(var(--skeleton-base))',
          highlightColor: 'hsl(var(--primary) / 0.1)'
        };
      case 'chrome':
        return {
          baseColor: 'hsl(var(--chrome-dark))',
          highlightColor: 'hsl(var(--chrome-platinum))'
        };
      case 'glass':
        return {
          baseColor: 'hsla(var(--glass-surface) / 0.5)',
          highlightColor: 'hsla(var(--glass-highlight) / 0.2)'
        };
      default:
        return {
          baseColor: 'hsl(var(--skeleton-base))',
          highlightColor: 'hsl(var(--skeleton-highlight))'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <SkeletonTheme
      baseColor={colors.baseColor}
      highlightColor={colors.highlightColor}
      borderRadius="var(--radius)"
      duration={2}
    >
      <div className={cn('skeleton-wrapper', className)}>
        {children || <Skeleton />}
      </div>
    </SkeletonTheme>
  );
};

// Profile skeleton
export const ProfileSkeleton: React.FC<{ variant?: 'default' | 'luxury' | 'chrome' | 'glass' }> = ({ variant = 'default' }) => (
  <SkeletonLoader variant={variant}>
    <div className="flex items-center space-x-4 p-6">
      <Skeleton circle height={64} width={64} />
      <div className="flex-1">
        <Skeleton height={24} width="40%" className="mb-2" />
        <Skeleton height={16} width="60%" />
      </div>
    </div>
  </SkeletonLoader>
);

// Card skeleton
export const CardSkeleton: React.FC<{ variant?: 'default' | 'luxury' | 'chrome' | 'glass' }> = ({ variant = 'default' }) => (
  <SkeletonLoader variant={variant}>
    <div className="p-6 rounded-2xl">
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={24} width="80%" className="mb-2" />
      <Skeleton height={16} count={3} className="mb-2" />
      <div className="flex justify-between mt-4">
        <Skeleton height={36} width={100} />
        <Skeleton height={36} width={100} />
      </div>
    </div>
  </SkeletonLoader>
);

// Feed skeleton
export const FeedSkeleton: React.FC<{ variant?: 'default' | 'luxury' | 'chrome' | 'glass' }> = ({ variant = 'default' }) => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <SkeletonLoader key={i} variant={variant}>
        <div className="bg-card rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton circle height={48} width={48} />
            <div className="flex-1">
              <Skeleton height={20} width="30%" className="mb-1" />
              <Skeleton height={14} width="20%" />
            </div>
          </div>
          <Skeleton height={300} className="mb-4 rounded-xl" />
          <Skeleton height={16} count={2} className="mb-2" />
          <div className="flex gap-4 mt-4">
            <Skeleton height={32} width={80} />
            <Skeleton height={32} width={80} />
            <Skeleton height={32} width={80} />
          </div>
        </div>
      </SkeletonLoader>
    ))}
  </div>
);

// Media grid skeleton
export const MediaGridSkeleton: React.FC<{ 
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  count?: number;
}> = ({ variant = 'default', count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <SkeletonLoader key={i} variant={variant}>
        <div className="aspect-square rounded-2xl overflow-hidden">
          <Skeleton height="100%" />
        </div>
      </SkeletonLoader>
    ))}
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ 
  variant?: 'default' | 'luxury' | 'chrome' | 'glass';
  rows?: number;
  columns?: number;
}> = ({ variant = 'default', rows = 5, columns = 4 }) => (
  <SkeletonLoader variant={variant}>
    <div className="w-full">
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} height={20} />
        ))}
      </div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b">
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} height={16} />
          ))}
        </div>
      ))}
    </div>
  </SkeletonLoader>
);

// Navigation skeleton
export const NavigationSkeleton: React.FC<{ variant?: 'default' | 'luxury' | 'chrome' | 'glass' }> = ({ variant = 'default' }) => (
  <SkeletonLoader variant={variant}>
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-6">
        <Skeleton height={40} width={120} />
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={80} />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton height={36} width={36} circle />
        <Skeleton height={36} width={36} circle />
        <Skeleton height={40} width={40} circle />
      </div>
    </div>
  </SkeletonLoader>
);

// Stats skeleton
export const StatsSkeleton: React.FC<{ variant?: 'default' | 'luxury' | 'chrome' | 'glass' }> = ({ variant = 'default' }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <SkeletonLoader key={i} variant={variant}>
        <div className="p-6 rounded-2xl">
          <Skeleton height={16} width="60%" className="mb-2" />
          <Skeleton height={32} width="80%" className="mb-1" />
          <Skeleton height={14} width="40%" />
        </div>
      </SkeletonLoader>
    ))}
  </div>
);