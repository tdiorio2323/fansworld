import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../AppRoutes';

// Mock all the page components to avoid complex dependencies
vi.mock('@/pages/HomePage', () => ({ default: () => <div data-testid="home-page">Home Page</div> }));
vi.mock('@/pages/public/AboutPage', () => ({ default: () => <div data-testid="about-page">About Page</div> }));
vi.mock('@/pages/auth/LoginPage', () => ({ default: () => <div data-testid="login-page">Login Page</div> }));
vi.mock('@/pages/errors/NotFoundPage', () => ({ default: () => <div data-testid="not-found-page">404 Page</div> }));

// Mock layout components
vi.mock('@/components/layout/MainLayout', () => ({ 
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div> 
}));
vi.mock('@/components/layout/AuthLayout', () => ({ 
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div> 
}));

// Mock all other page imports to prevent module resolution issues
const mockPageComponents = [
  '@/pages/public/FeaturesPage',
  '@/pages/public/PricingPage', 
  '@/pages/public/BlogPage',
  '@/pages/public/ContactPage',
  '@/pages/public/CareersPage',
  '@/pages/public/PressPage',
  '@/pages/public/InvestorsPage',
  '@/pages/EnhancedUIDemo',
  '@/pages/auth/RegisterPage',
  '@/pages/auth/ForgotPasswordPage',
  '@/pages/auth/ResetPasswordPage',
  '@/pages/auth/VerifyEmailPage',
  '@/pages/auth/TwoFactorPage',
  '@/pages/auth/SocialCallbackPage',
  '@/pages/creator/dashboard/CreatorDashboardOverview',
  '@/pages/DiscoverPage',
  '@/pages/CategoriesPage',
  '@/pages/CreatorProfilePage',
  '@/components/layout/CreatorLayout',
  '@/components/layout/AdminLayout'
];

// Mock all page components
mockPageComponents.forEach((componentPath) => {
  vi.mock(componentPath, () => ({ 
    default: () => <div data-testid={`mock-${componentPath.split('/').pop()?.toLowerCase()}`}>Mock Component</div> 
  }));
});

describe('AppRoutes', () => {
  it('renders home page at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders about page at /about path', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('renders login page at /auth/login path', () => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  it('handles dynamic route parameters', () => {
    render(
      <MemoryRouter initialEntries={['/creator/testuser']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    // Should render without errors
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });
});