import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  EmptyState,
  NoDataEmptyState,
  NoResultsEmptyState,
  NoContentEmptyState
} from '../empty-states/EmptyState';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  InboxIcon: ({ className }: any) => (
    <span className={className} data-testid="inbox-icon">📥</span>
  ),
  PhotoIcon: ({ className }: any) => (
    <span className={className} data-testid="photo-icon">📷</span>
  ),
  UsersIcon: ({ className }: any) => (
    <span className={className} data-testid="users-icon">👥</span>
  ),
  DocumentTextIcon: ({ className }: any) => (
    <span className={className} data-testid="document-icon">📄</span>
  ),
  FolderIcon: ({ className }: any) => (
    <span className={className} data-testid="folder-icon">📁</span>
  ),
  MagnifyingGlassIcon: ({ className }: any) => (
    <span className={className} data-testid="search-icon">🔍</span>
  ),
  PlusIcon: ({ className }: any) => (
    <span className={className} data-testid="plus-icon">➕</span>
  ),
  ArrowUpTrayIcon: ({ className }: any) => (
    <span className={className} data-testid="upload-icon">⬆️</span>
  )
}));

describe('EmptyState Components', () => {
  const user = userEvent.setup();

  describe('EmptyState', () => {
    it('renders basic empty state', () => {
      render(<EmptyState title="No items found" />);
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByTestId('inbox-icon')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <EmptyState
          title="No items found"
          description="Try adding some items to see them here"
        />
      );
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adding some items to see them here')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      const customIcon = <span data-testid="custom-icon">🎉</span>;
      
      render(<EmptyState title="Success!" icon={customIcon} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('inbox-icon')).not.toBeInTheDocument();
    });

    it('renders different icon types', () => {
      const iconTypes = [
        { type: 'photo' as const, testId: 'photo-icon' },
        { type: 'users' as const, testId: 'users-icon' },
        { type: 'document' as const, testId: 'document-icon' },
        { type: 'folder' as const, testId: 'folder-icon' },
        { type: 'search' as const, testId: 'search-icon' }
      ];

      iconTypes.forEach(({ type, testId }) => {
        const { unmount } = render(<EmptyState title="Test" iconType={type} />);
        expect(screen.getByTestId(testId)).toBeInTheDocument();
        unmount();
      });
    });

    it('renders primary action button', async () => {
      const mockAction = vi.fn();
      
      render(
        <EmptyState
          title="No items found"
          action={{
            label: 'Add Item',
            onClick: mockAction
          }}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Add Item' });
      expect(button).toBeInTheDocument();
      
      await user.click(button);
      expect(mockAction).toHaveBeenCalled();
    });

    it('renders secondary action button', async () => {
      const mockSecondaryAction = vi.fn();
      
      render(
        <EmptyState
          title="No items found"
          secondaryAction={{
            label: 'Learn More',
            onClick: mockSecondaryAction
          }}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Learn More' });
      expect(button).toBeInTheDocument();
      
      await user.click(button);
      expect(mockSecondaryAction).toHaveBeenCalled();
    });

    it('renders both primary and secondary actions', () => {
      render(
        <EmptyState
          title="No items found"
          action={{
            label: 'Add Item',
            onClick: vi.fn()
          }}
          secondaryAction={{
            label: 'Learn More',
            onClick: vi.fn()
          }}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
    });

    it('applies different sizes', () => {
      const { rerender } = render(<EmptyState title="Test" size="sm" />);
      expect(screen.getByRole('heading')).toHaveClass('text-lg');
      
      rerender(<EmptyState title="Test" size="md" />);
      expect(screen.getByRole('heading')).toHaveClass('text-xl');
      
      rerender(<EmptyState title="Test" size="lg" />);
      expect(screen.getByRole('heading')).toHaveClass('text-2xl');
    });

    it('applies different variants', () => {
      const { rerender, container } = render(<EmptyState title="Test" variant="default" />);
      expect(container.firstChild).toHaveClass('bg-card/50');
      
      rerender(<EmptyState title="Test" variant="luxury" />);
      expect(container.firstChild).toHaveClass('from-purple-900/10');
      
      rerender(<EmptyState title="Test" variant="chrome" />);
      expect(container.firstChild).toHaveClass('bg-gradient-chrome-luxury');
      
      rerender(<EmptyState title="Test" variant="glass" />);
      expect(container.firstChild).toHaveClass('backdrop-blur-lg');
      
      rerender(<EmptyState title="Test" variant="minimal" />);
      expect(container.firstChild).not.toHaveClass('bg-card/50');
    });

    it('applies custom className', () => {
      const { container } = render(<EmptyState title="Test" className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders action button variants', () => {
      const { rerender } = render(
        <EmptyState
          title="Test"
          action={{
            label: 'Primary',
            onClick: vi.fn(),
            variant: 'primary'
          }}
        />
      );
      
      expect(screen.getByRole('button')).toHaveClass('bg-primary');
      
      rerender(
        <EmptyState
          title="Test"
          action={{
            label: 'Secondary',
            onClick: vi.fn(),
            variant: 'secondary'
          }}
        />
      );
      
      expect(screen.getByRole('button')).toHaveClass('bg-secondary');
      
      rerender(
        <EmptyState
          title="Test"
          action={{
            label: 'Ghost',
            onClick: vi.fn(),
            variant: 'ghost'
          }}
        />
      );
      
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
    });

    it('renders custom action icon', () => {
      const customIcon = <span data-testid="custom-action-icon">🚀</span>;
      
      render(
        <EmptyState
          title="Test"
          action={{
            label: 'Launch',
            onClick: vi.fn(),
            icon: customIcon
          }}
        />
      );
      
      expect(screen.getByTestId('custom-action-icon')).toBeInTheDocument();
    });

    it('can disable animation', () => {
      const { container } = render(<EmptyState title="Test" animated={false} />);
      
      // When animation is disabled, it should render a regular div instead of motion.div
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Pre-configured Empty States', () => {
    describe('NoDataEmptyState', () => {
      it('renders with default props', () => {
        render(<NoDataEmptyState />);
        
        expect(screen.getByText('No data yet')).toBeInTheDocument();
        expect(screen.getByText(/start by adding some data/i)).toBeInTheDocument();
        expect(screen.getByTestId('inbox-icon')).toBeInTheDocument();
      });

      it('accepts custom props', () => {
        render(<NoDataEmptyState title="Custom Title" />);
        
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
      });
    });

    describe('NoResultsEmptyState', () => {
      it('renders with default props', () => {
        render(<NoResultsEmptyState />);
        
        expect(screen.getByText('No results found')).toBeInTheDocument();
        expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument();
        expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      });
    });

    describe('NoContentEmptyState', () => {
      it('renders with default props', () => {
        render(<NoContentEmptyState />);
        
        expect(screen.getByText('No content available')).toBeInTheDocument();
        expect(screen.getByText(/upload your first piece/i)).toBeInTheDocument();
        expect(screen.getByTestId('photo-icon')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /upload content/i })).toBeInTheDocument();
      });

      it('calls action when button is clicked', async () => {
        // Mock console.log to verify the default action
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        render(<NoContentEmptyState />);
        
        const button = screen.getByRole('button', { name: /upload content/i });
        await user.click(button);
        
        expect(consoleSpy).toHaveBeenCalledWith('Upload content');
        
        consoleSpy.mockRestore();
      });

      it('overrides default action', async () => {
        const customAction = vi.fn();
        
        render(
          <NoContentEmptyState
            action={{
              label: 'Custom Action',
              onClick: customAction
            }}
          />
        );
        
        const button = screen.getByRole('button', { name: 'Custom Action' });
        await user.click(button);
        
        expect(customAction).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading levels', () => {
      render(<EmptyState title="No items" />);
      
      const heading = screen.getByRole('heading', { name: 'No items' });
      expect(heading.tagName).toBe('H3');
    });

    it('provides meaningful descriptions', () => {
      render(
        <EmptyState
          title="No items"
          description="This area will show items when available"
        />
      );
      
      expect(screen.getByText('This area will show items when available')).toBeInTheDocument();
    });

    it('makes action buttons accessible', () => {
      render(
        <EmptyState
          title="Test"
          action={{
            label: 'Add Item',
            onClick: vi.fn()
          }}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Add Item' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adapts button layout for mobile', () => {
      render(
        <EmptyState
          title="Test"
          action={{
            label: 'Primary',
            onClick: vi.fn()
          }}
          secondaryAction={{
            label: 'Secondary',
            onClick: vi.fn()
          }}
        />
      );
      
      // Button container should have responsive flex classes
      const buttonContainer = screen.getByRole('button', { name: 'Primary' }).parentElement;
      expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });
  });
});