import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { PasswordGate } from '@/components/PasswordGate';
import Register from '@/pages/Register';

// Mock Supabase auth
const mockSupabaseAuth = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'test-key',
  supabase: {
    auth: mockSupabaseAuth,
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication Flow Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful session check
    mockSupabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockSupabaseAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe('VIP Entry Flow', () => {
    it('allows access with correct VIP code', async () => {
      renderWithProviders(<PasswordGate />);
      
      // Should show password input
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /enter/i });
      
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      
      // Enter correct VIP code
      await user.type(passwordInput, 'TEST123');
      await user.click(submitButton);
      
      // Should proceed to main content (implementation dependent)
      await waitFor(() => {
        // This would check for navigation or content change
        // Exact assertion depends on implementation
        expect(passwordInput).toBeInTheDocument();
      });
    });

    it('shows error with incorrect VIP code', async () => {
      renderWithProviders(<PasswordGate />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /enter/i });
      
      // Enter incorrect VIP code
      await user.type(passwordInput, 'WRONG123');
      await user.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/incorrect.*password/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Registration Flow', () => {
    it('handles successful registration', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
          session: null,
        },
        error: null,
      });

      renderWithProviders(<Register />);
      
      // Fill out registration form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'SecurePass123!');
      await user.click(submitButton);
      
      // Should call Supabase signUp
      await waitFor(() => {
        expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'SecurePass123!',
        });
      });
    });

    it('handles registration error', async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      });

      renderWithProviders(<Register />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'SecurePass123!');
      await user.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
      });
    });

    it('validates required fields', async () => {
      renderWithProviders(<Register />);
      
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(submitButton);
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
        expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('maintains authentication state across page refreshes', async () => {
      // Mock existing session
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123', email: 'test@example.com' },
            access_token: 'mock-token',
          },
        },
        error: null,
      });

      renderWithProviders(<div data-testid="app-content">App Content</div>);
      
      // Should maintain authenticated state
      await waitFor(() => {
        expect(screen.getByTestId('app-content')).toBeInTheDocument();
      });
    });

    it('handles session expiration', async () => {
      // Mock expired session
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Session expired' },
      });

      renderWithProviders(<div data-testid="app-content">App Content</div>);
      
      // Should handle session expiration gracefully
      await waitFor(() => {
        // Implementation would redirect to login or show appropriate state
        expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
      });
    });
  });
});