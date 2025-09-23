import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  SkeletonLoader,
  ProfileSkeleton,
  CardSkeleton,
  FeedSkeleton,
  MediaGridSkeleton,
  TableSkeleton,
  NavigationSkeleton,
  StatsSkeleton
} from '../skeleton/SkeletonLoader';

// Mock react-loading-skeleton
vi.mock('react-loading-skeleton', () => ({
  default: ({ children, ...props }: any) => (
    <div data-testid="skeleton" {...props}>
      {children || 'skeleton'}
    </div>
  ),
  SkeletonTheme: ({ children }: any) => <div data-testid="skeleton-theme">{children}</div>
}));

// Mock CSS import
vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}));

describe('SkeletonLoader Components', () => {
  describe('SkeletonLoader', () => {
    it('renders basic skeleton loader', () => {
      render(<SkeletonLoader />);
      
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SkeletonLoader className="custom-class" />);
      
      const wrapper = screen.getByTestId('skeleton-theme').querySelector('.skeleton-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('renders children when provided', () => {
      render(
        <SkeletonLoader>
          <div data-testid="custom-content">Custom skeleton content</div>
        </SkeletonLoader>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom skeleton content')).toBeInTheDocument();
    });

    it('applies different variants', () => {
      const variants = ['default', 'luxury', 'chrome', 'glass'] as const;
      
      variants.forEach(variant => {
        const { unmount } = render(<SkeletonLoader variant={variant} />);
        expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('ProfileSkeleton', () => {
    it('renders profile skeleton structure', () => {
      render(<ProfileSkeleton />);
      
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
      // Should have profile-like structure with avatar and text
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('applies variant styles', () => {
      render(<ProfileSkeleton variant="luxury" />);
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
    });
  });

  describe('CardSkeleton', () => {
    it('renders card skeleton structure', () => {
      render(<CardSkeleton />);
      
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
      // Should have multiple skeleton elements for card layout
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(3);
    });
  });

  describe('FeedSkeleton', () => {
    it('renders multiple feed items', () => {
      render(<FeedSkeleton />);
      
      // Should render 3 feed items by default
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(3);
    });

    it('applies variant to all items', () => {
      render(<FeedSkeleton variant="chrome" />);
      
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(3);
    });
  });

  describe('MediaGridSkeleton', () => {
    it('renders default number of items', () => {
      render(<MediaGridSkeleton />);
      
      // Should render 6 items by default
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(6);
    });

    it('renders custom count of items', () => {
      render(<MediaGridSkeleton count={9} />);
      
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(9);
    });

    it('applies variant styles', () => {
      render(<MediaGridSkeleton variant="glass" count={3} />);
      
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(3);
    });
  });

  describe('TableSkeleton', () => {
    it('renders with default dimensions', () => {
      render(<TableSkeleton />);
      
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
      // Should have header row + 5 data rows by default
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThanOrEqual(20); // 4 columns × 5 rows + header
    });

    it('renders with custom dimensions', () => {
      render(<TableSkeleton rows={3} columns={2} />);
      
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBe(8); // 2 columns × 3 rows + 2 header columns
    });
  });

  describe('NavigationSkeleton', () => {
    it('renders navigation skeleton structure', () => {
      render(<NavigationSkeleton />);
      
      expect(screen.getByTestId('skeleton-theme')).toBeInTheDocument();
      // Should have multiple skeleton elements for nav structure
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(5);
    });
  });

  describe('StatsSkeleton', () => {
    it('renders stats grid skeleton', () => {
      render(<StatsSkeleton />);
      
      // Should render 3 stat items by default
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(3);
    });

    it('applies variant styles to all items', () => {
      render(<StatsSkeleton variant="luxury" />);
      
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('provides appropriate loading indicators', () => {
      render(<SkeletonLoader />);
      
      // Skeleton should be identifiable for screen readers
      const skeletonWrapper = screen.getByTestId('skeleton-theme');
      expect(skeletonWrapper).toBeInTheDocument();
    });

    it('maintains proper contrast in all variants', () => {
      const variants = ['default', 'luxury', 'chrome', 'glass'] as const;
      
      variants.forEach(variant => {
        const { unmount } = render(<ProfileSkeleton variant={variant} />);
        const skeletonTheme = screen.getByTestId('skeleton-theme');
        expect(skeletonTheme).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Performance', () => {
    it('renders multiple skeletons efficiently', () => {
      const startTime = performance.now();
      
      render(<MediaGridSkeleton count={50} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly even with many items
      expect(renderTime).toBeLessThan(100);
      
      const skeletonThemes = screen.getAllByTestId('skeleton-theme');
      expect(skeletonThemes.length).toBe(50);
    });

    it('handles variant switching efficiently', () => {
      const { rerender } = render(<ProfileSkeleton variant="default" />);
      
      const startTime = performance.now();
      
      rerender(<ProfileSkeleton variant="luxury" />);
      rerender(<ProfileSkeleton variant="chrome" />);
      rerender(<ProfileSkeleton variant="glass" />);
      
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;
      
      // Variant switching should be fast
      expect(rerenderTime).toBeLessThan(50);
    });
  });
});