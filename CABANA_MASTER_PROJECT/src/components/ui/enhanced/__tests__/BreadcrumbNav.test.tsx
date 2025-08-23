import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BreadcrumbNav } from '../navigation/BreadcrumbNav';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>
  }
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  ChevronRightIcon: ({ className }: any) => (
    <span className={className} data-testid="chevron-right">→</span>
  ),
  HomeIcon: ({ className }: any) => (
    <span className={className} data-testid="home-icon">🏠</span>
  )
}));

// Mock useLocation hook
const mockLocation = { pathname: '/dashboard/ui-components/enhanced-demo' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>{children}</a>
    )
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BreadcrumbNav', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderWithRouter(<BreadcrumbNav />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    });

    it('shows home link by default', () => {
      renderWithRouter(<BreadcrumbNav />);
      
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('can hide home link', () => {
      renderWithRouter(<BreadcrumbNav showHome={false} />);
      
      expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('uses custom home label', () => {
      renderWithRouter(<BreadcrumbNav homeLabel="Dashboard" />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Custom Items', () => {
    const customItems = [
      { label: 'Projects', href: '/projects' },
      { label: 'My Project', href: '/projects/123' },
      { label: 'Settings' } // No href = current page
    ];

    it('renders custom breadcrumb items', () => {
      renderWithRouter(<BreadcrumbNav items={customItems} />);
      
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('My Project')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('creates clickable links for items with href', () => {
      renderWithRouter(<BreadcrumbNav items={customItems} />);
      
      const projectsLink = screen.getByText('Projects');
      expect(projectsLink.closest('a')).toHaveAttribute('href', '/projects');
      
      const myProjectLink = screen.getByText('My Project');
      expect(myProjectLink.closest('a')).toHaveAttribute('href', '/projects/123');
    });

    it('marks last item as current page', () => {
      renderWithRouter(<BreadcrumbNav items={customItems} />);
      
      const currentItem = screen.getByText('Settings');
      expect(currentItem.closest('span')).toHaveAttribute('aria-current', 'page');
    });

    it('renders custom icons', () => {
      const itemsWithIcons = [
        { 
          label: 'Dashboard', 
          href: '/dashboard',
          icon: <span data-testid="custom-icon">📊</span>
        }
      ];

      renderWithRouter(<BreadcrumbNav items={itemsWithIcons} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Auto-generated Breadcrumbs', () => {
    it('generates breadcrumbs from URL path', () => {
      renderWithRouter(<BreadcrumbNav />);
      
      // Should generate from /dashboard/ui-components/enhanced-demo
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Ui Components')).toBeInTheDocument();
      expect(screen.getByText('Enhanced Demo')).toBeInTheDocument();
    });

    it('capitalizes path segments correctly', () => {
      mockLocation.pathname = '/user-profile/account-settings';
      
      renderWithRouter(<BreadcrumbNav />);
      
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });

    it('creates proper href links for auto-generated items', () => {
      mockLocation.pathname = '/dashboard/settings/profile';
      
      renderWithRouter(<BreadcrumbNav />);
      
      const dashboardLink = screen.getByText('Dashboard');
      expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
      
      const settingsLink = screen.getByText('Settings');
      expect(settingsLink.closest('a')).toHaveAttribute('href', '/dashboard/settings');
    });
  });

  describe('Truncation', () => {
    const manyItems = Array.from({ length: 8 }, (_, i) => ({
      label: `Item ${i + 1}`,
      href: `/item-${i + 1}`
    }));

    it('truncates items when exceeding maxItems', () => {
      renderWithRouter(<BreadcrumbNav items={manyItems} maxItems={5} />);
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Item 7')).toBeInTheDocument();
      expect(screen.getByText('Item 8')).toBeInTheDocument();
    });

    it('does not truncate when items are within limit', () => {
      renderWithRouter(<BreadcrumbNav items={manyItems.slice(0, 3)} maxItems={5} />);
      
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('can disable truncation', () => {
      renderWithRouter(
        <BreadcrumbNav items={manyItems} truncate={false} maxItems={3} />
      );
      
      expect(screen.queryByText('...')).not.toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 8')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant styles', () => {
      renderWithRouter(<BreadcrumbNav />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('bg-card');
    });

    it('applies luxury variant styles', () => {
      renderWithRouter(<BreadcrumbNav variant="luxury" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('from-purple-900/20');
    });

    it('applies chrome variant styles', () => {
      renderWithRouter(<BreadcrumbNav variant="chrome" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('bg-gradient-chrome');
    });

    it('applies glass variant styles', () => {
      renderWithRouter(<BreadcrumbNav variant="glass" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('backdrop-blur-lg');
    });
  });

  describe('Custom Separator', () => {
    it('uses custom separator', () => {
      const customSeparator = <span data-testid="custom-separator">|</span>;
      const items = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' }
      ];

      renderWithRouter(
        <BreadcrumbNav items={items} separator={customSeparator} />
      );
      
      expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderWithRouter(<BreadcrumbNav />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('marks current page appropriately', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current Page' }
      ];

      renderWithRouter(<BreadcrumbNav items={items} />);
      
      const currentPage = screen.getByText('Current Page');
      expect(currentPage.closest('span')).toHaveAttribute('aria-current', 'page');
    });

    it('provides proper link structure', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current Product' }
      ];

      renderWithRouter(<BreadcrumbNav items={items} />);
      
      // Check ordered list structure
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      // Check list items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(5); // Home + 2 separators + 2 items
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      renderWithRouter(<BreadcrumbNav className="custom-breadcrumb" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-breadcrumb');
    });

    it('maintains default classes with custom className', () => {
      renderWithRouter(<BreadcrumbNav className="custom-class" />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-class');
      expect(nav).toHaveClass('flex');
      expect(nav).toHaveClass('items-center');
    });
  });

  describe('Interaction', () => {
    it('handles link clicks', async () => {
      const items = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/dashboard/settings' }
      ];

      renderWithRouter(<BreadcrumbNav items={items} />);
      
      const dashboardLink = screen.getByText('Dashboard');
      expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
      
      // Click should be handled by React Router
      await user.click(dashboardLink);
    });
  });
});