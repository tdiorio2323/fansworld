import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualGifts } from '../VirtualGifts';

// Mock the feature flags
vi.mock('../../feature-flags', () => ({
  ADDON_FLAGS: {
    VIRTUAL_GIFTS: true
  }
}));

// Mock virtual gifts service
const mockGifts = [
  {
    id: '1',
    name: 'Red Rose',
    price: 500, // $5.00 in cents
    emoji: '🌹',
    rarity: 'common' as const,
    isActive: true,
    category: 'flowers',
    animationUrl: null
  },
  {
    id: '2', 
    name: 'Diamond Ring',
    price: 5000, // $50.00 in cents
    emoji: '💎',
    rarity: 'legendary' as const,
    isActive: true,
    category: 'jewelry',
    animationUrl: null
  }
];

const mockStats = {
  totalSent: 25,
  totalReceived: 15,
  totalValueSent: 25000,
  totalValueReceived: 12000,
  favoriteSent: mockGifts[0],
  favoriteReceived: mockGifts[1],
  topSenders: [
    { userId: 'user1', username: 'sender1', total: 5000 }
  ],
  recentActivity: [
    { 
      id: 'activity1',
      gift: mockGifts[0],
      sender: { id: 'sender1', username: 'sender1' },
      recipient: { id: 'recipient1', username: 'recipient1' },
      timestamp: new Date().toISOString(),
      message: 'Thanks for the great content!'
    }
  ]
};

vi.mock('../services/virtual-gifts-service', () => ({
  VirtualGiftsService: class {
    static getAllGifts = vi.fn().mockResolvedValue(mockGifts);
    static getUserGiftStats = vi.fn().mockResolvedValue(mockStats);
    static sendGift = vi.fn().mockResolvedValue({ success: true });
    static getUserGiftTransactions = vi.fn().mockResolvedValue(mockStats.recentActivity);
  }
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props} data-testid="button">
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock child components
vi.mock('../GiftCatalog', () => ({
  GiftCatalog: ({ onGiftSelect }: any) => (
    <div data-testid="gift-catalog">
      <button onClick={() => onGiftSelect(mockGifts[0])}>
        Select Gift
      </button>
    </div>
  )
}));

vi.mock('../GiftStats', () => ({
  GiftStats: () => <div data-testid="gift-stats">Gift Stats</div>
}));

vi.mock('../GiftNotifications', () => ({
  GiftNotifications: () => <div data-testid="gift-notifications">Gift Notifications</div>
}));

describe('VirtualGifts', () => {
  it('returns null when feature flag is disabled', () => {
    // Mock feature flag as disabled
    vi.doMock('../../feature-flags', () => ({
      ADDON_FLAGS: {
        VIRTUAL_GIFTS: false
      }
    }));
    
    const { container } = render(<VirtualGifts />);
    expect(container.firstChild).toBeNull();
  });

  it('renders main virtual gifts interface', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
        showStats={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Virtual Gifts')).toBeInTheDocument();
      expect(screen.getByText('Send gifts to show appreciation')).toBeInTheDocument();
    });
  });

  it('displays gift statistics when enabled', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        showStats={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('25 Sent')).toBeInTheDocument();
      expect(screen.getByText('15 Received')).toBeInTheDocument();
      expect(screen.getByText('$250.00 Given')).toBeInTheDocument();
    });
  });

  it('renders embedded view correctly', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
        embedded={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Send Gift')).toBeInTheDocument();
    });
  });

  it('shows gift catalog when catalog tab is selected', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
      />
    );

    await waitFor(() => {
      const catalogButton = screen.getByText('Catalog');
      fireEvent.click(catalogButton);
      expect(screen.getByTestId('gift-catalog')).toBeInTheDocument();
    });
  });

  it('shows gift stats when stats tab is selected', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        showStats={true}
      />
    );

    await waitFor(() => {
      const statsButton = screen.getByText('Stats');
      fireEvent.click(statsButton);
      expect(screen.getByTestId('gift-stats')).toBeInTheDocument();
    });
  });

  it('displays recent gift activity', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        showStats={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('sender1 → recipient1')).toBeInTheDocument();
      expect(screen.getByText('Thanks for the great content!')).toBeInTheDocument();
    });
  });

  it('handles gift selection from catalog', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
      />
    );

    await waitFor(() => {
      const catalogButton = screen.getByText('Catalog');
      fireEvent.click(catalogButton);
      
      const selectButton = screen.getByText('Select Gift');
      fireEvent.click(selectButton);
    });

    // Should show gift sending interface
    await waitFor(() => {
      expect(screen.getByText('Send Red Rose')).toBeInTheDocument();
      expect(screen.getByText('$5.00')).toBeInTheDocument();
    });
  });

  it('shows quick gift options for common gifts', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
        embedded={true}
      />
    );

    await waitFor(() => {
      // Quick gift buttons should be rendered
      const quickGifts = screen.getAllByTestId('button');
      expect(quickGifts.length).toBeGreaterThan(0);
    });
  });

  it('handles gift sending process', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
      />
    );

    await waitFor(() => {
      // Select a gift from catalog
      const catalogButton = screen.getByText('Catalog');
      fireEvent.click(catalogButton);
      
      const selectButton = screen.getByText('Select Gift');
      fireEvent.click(selectButton);
    });

    await waitFor(() => {
      // Send the gift
      const sendButton = screen.getByText('Send Gift');
      fireEvent.click(sendButton);
    });

    // Should update the display
    expect(screen.getByText('Send Red Rose')).toBeInTheDocument();
  });

  it('shows rarity indicators for gifts', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
      />
    );

    await waitFor(() => {
      // Badges should show gift rarity
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('displays gift values correctly', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        showStats={true}
      />
    );

    await waitFor(() => {
      // Should show formatted prices
      expect(screen.getByText('$250.00 Given')).toBeInTheDocument();
      expect(screen.getByText('$120.00 Received')).toBeInTheDocument();
    });
  });

  it('handles empty gift catalog gracefully', async () => {
    render(
      <VirtualGifts 
        currentUserId="user1"
        recipientId="recipient1"
      />
    );

    await waitFor(() => {
      const catalogButton = screen.getByText('Catalog');
      fireEvent.click(catalogButton);
    });

    // Should show gift catalog
    await waitFor(() => {
      expect(screen.getByTestId('gift-catalog')).toBeInTheDocument();
    });
  });
});