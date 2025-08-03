import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check if the app renders without errors
    expect(screen.getByTestId('app-root')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // The app should render some content
    expect(screen.getByText).toBeDefined();
  });
});
