import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonLoader, ProfileSkeleton, CardSkeleton, FeedSkeleton, MediaGridSkeleton } from '../skeleton/SkeletonLoader';

describe('SkeletonLoader Components', () => {
  describe('SkeletonLoader', () => {
    it('renders default skeleton', () => {
      render(<SkeletonLoader />);
      const skeleton = screen.getByTestId('skeleton-loader');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('applies custom className', () => {
      render(<SkeletonLoader className="custom-class" data-testid="custom-skeleton" />);
      const skeleton = screen.getByTestId('custom-skeleton');
      expect(skeleton).toHaveClass('custom-class');
    });

    it('supports custom width and height', () => {
      render(<SkeletonLoader width="200px" height="100px" data-testid="sized-skeleton" />);
      const skeleton = screen.getByTestId('sized-skeleton');
      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });
  });

  describe('ProfileSkeleton', () => {
    it('renders profile skeleton structure', () => {
      render(<ProfileSkeleton />);
      // Should have avatar, name, and bio skeletons
      expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
    });

    it('renders compact version', () => {
      render(<ProfileSkeleton compact />);
      expect(screen.getByTestId('profile-skeleton')).toHaveClass('flex-row');
    });
  });

  describe('CardSkeleton', () => {
    it('renders card skeleton', () => {
      render(<CardSkeleton />);
      expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    });

    it('renders without image when specified', () => {
      render(<CardSkeleton showImage={false} />);
      const cardSkeleton = screen.getByTestId('card-skeleton');
      expect(cardSkeleton.querySelector('[data-testid="card-image-skeleton"]')).not.toBeInTheDocument();
    });
  });

  describe('FeedSkeleton', () => {
    it('renders feed skeleton with default item count', () => {
      render(<FeedSkeleton />);
      const feedItems = screen.getAllByTestId(/feed-item-skeleton/);
      expect(feedItems).toHaveLength(3); // default count
    });

    it('renders specified number of items', () => {
      render(<FeedSkeleton items={5} />);
      const feedItems = screen.getAllByTestId(/feed-item-skeleton/);
      expect(feedItems).toHaveLength(5);
    });
  });

  describe('MediaGridSkeleton', () => {
    it('renders media grid skeleton', () => {
      render(<MediaGridSkeleton />);
      expect(screen.getByTestId('media-grid-skeleton')).toBeInTheDocument();
    });

    it('renders specified number of items', () => {
      render(<MediaGridSkeleton items={8} />);
      const mediaItems = screen.getAllByTestId(/media-item-skeleton/);
      expect(mediaItems).toHaveLength(8);
    });
  });
});