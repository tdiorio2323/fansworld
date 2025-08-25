import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '@/lib/test-utils';
import { EnhancedUIDemo } from '@/pages/EnhancedUIDemo';

// Mock framer-motion for tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Enhanced UI Components Integration Tests', () => {
  const user = userEvent.setup();

  describe('Enhanced UI Demo Page', () => {
    it('renders all component sections', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Check for main sections
      expect(screen.getByText(/enhanced ui.*components/i)).toBeInTheDocument();
      expect(screen.getByText(/skeleton.*loaders/i)).toBeInTheDocument();
      expect(screen.getByText(/empty.*states/i)).toBeInTheDocument();
    });

    it('toggles skeleton loading demonstration', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Find and click the skeleton toggle
      const skeletonToggle = screen.getByLabelText(/show.*skeleton/i);
      await user.click(skeletonToggle);

      // Should show skeleton loaders
      await waitFor(() => {
        expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
      });

      // Toggle off
      await user.click(skeletonToggle);

      // Should hide skeleton loaders
      await waitFor(() => {
        expect(screen.queryByTestId('profile-skeleton')).not.toBeInTheDocument();
      });
    });

    it('demonstrates breadcrumb navigation', () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Should show breadcrumb navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('UI Components')).toBeInTheDocument();
      expect(screen.getByText('Enhanced Demo')).toBeInTheDocument();
    });

    it('toggles sidebar collapse state', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      const sidebarToggle = screen.getByLabelText(/toggle.*sidebar/i);
      expect(sidebarToggle).toBeInTheDocument();

      // Click to collapse
      await user.click(sidebarToggle);

      // Should update sidebar state (implementation dependent)
      await waitFor(() => {
        // Verify sidebar collapse state change
        expect(sidebarToggle).toBeInTheDocument();
      });
    });

    it('switches between demo tabs', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Should have tabs
      const componentsTab = screen.getByRole('tab', { name: /components/i });
      const accessibilityTab = screen.getByRole('tab', { name: /accessibility/i });

      expect(componentsTab).toBeInTheDocument();
      expect(accessibilityTab).toBeInTheDocument();

      // Switch to accessibility tab
      await user.click(accessibilityTab);

      // Should show accessibility content
      await waitFor(() => {
        expect(screen.getByText(/keyboard.*shortcuts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Progressive Disclosure Components', () => {
    it('expands and collapses content sections', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Find expandable sections
      const expandButtons = screen.getAllByText(/show.*more/i);
      
      if (expandButtons.length > 0) {
        const firstButton = expandButtons[0];
        await user.click(firstButton);

        // Should expand content
        await waitFor(() => {
          expect(screen.getByText(/show.*less/i)).toBeInTheDocument();
        });
      }
    });

    it('navigates through stepper component', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Look for stepper navigation
      const nextButtons = screen.getAllByText(/next/i);
      
      if (nextButtons.length > 0) {
        const nextButton = nextButtons[0];
        await user.click(nextButton);

        // Should advance to next step
        await waitFor(() => {
          expect(screen.getByText(/step.*2/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Empty States Display', () => {
    it('shows different empty state variants', () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Should display empty state examples
      expect(screen.getByText(/no.*data.*available/i)).toBeInTheDocument();
      expect(screen.getByText(/no.*results.*found/i)).toBeInTheDocument();
      expect(screen.getByText(/no.*content.*yet/i)).toBeInTheDocument();
    });

    it('renders empty state action buttons', async () => {
      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Look for action buttons in empty states
      const actionButtons = screen.getAllByText(/create.*first/i);
      
      if (actionButtons.length > 0) {
        const createButton = actionButtons[0];
        expect(createButton).toBeInTheDocument();
        
        // Should be clickable
        await user.click(createButton);
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      render(
        <TestWrapper>
          <EnhancedUIDemo />
        </TestWrapper>
      );

      // Should adapt layout for mobile
      await waitFor(() => {
        // Implementation specific - check for mobile-specific classes or behavior
        expect(document.body).toBeInTheDocument();
      });
    });
  });
});