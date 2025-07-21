import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReferralCodeGenerator } from './ReferralCodeGenerator';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';
import { toast } from 'sonner';
import QRCode from 'qrcode';

// Mock dependencies
vi.mock('@/hooks/useAdvancedReferral');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(),
  },
}));

// Mock data
const mockActiveCode = {
  id: '1',
  code: 'ACTIVE123',
  uses_remaining: 10,
  total_uses: 5,
  active: true,
  custom_message: 'Welcome!',
  landing_page_url: 'https://example.com/active',
  expires_at: new Date(Date.now() + 86400000).toISOString(), // expires tomorrow
};

const mockExpiredCode = {
  id: '2',
  code: 'EXPIRED456',
  uses_remaining: 0,
  total_uses: 20,
  active: false,
};

const mockGenerateCustomCode = {
  mutateAsync: vi.fn().mockResolvedValue({}),
  isPending: false,
};

describe('ReferralCodeGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAdvancedReferral as vi.Mock).mockReturnValue({
      generateCustomCode: mockGenerateCustomCode,
    });
    // Mock clipboard and share APIs
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      share: vi.fn().mockResolvedValue(undefined),
    });
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    });
  });

  it('renders correctly with no codes', async () => {
    render(<ReferralCodeGenerator existingCodes={[]} />);
    expect(screen.getByText('Your Referral Codes')).toBeInTheDocument();
    expect(screen.getByText('No active referral codes yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Your First Code/i })).toBeInTheDocument();
  });

  it('renders active and expired codes correctly', () => {
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode, mockExpiredCode]} />);
    // Active code
    expect(screen.getByText('ACTIVE123')).toBeInTheDocument();
    expect(screen.getByText('10 uses left')).toBeInTheDocument();
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Custom landing page')).toBeInTheDocument();
    // Expired code
    expect(screen.getByText('Expired Codes')).toBeInTheDocument();
    expect(screen.getByText('EXPIRED456')).toBeInTheDocument();
  });

  it('toggles the generator form visibility', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[]} />);
    
    expect(screen.queryByLabelText(/Code Prefix/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Create Custom Code/i }));
    expect(screen.getByLabelText(/Code Prefix/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByLabelText(/Code Prefix/i)).not.toBeInTheDocument();
  });

  it('allows generating a new custom code', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[]} />);

    await user.click(screen.getByRole('button', { name: /Create Custom Code/i }));

    await user.type(screen.getByLabelText(/Code Prefix/i), 'TEST');
    await user.type(screen.getByLabelText(/Custom Landing Page/i), 'https://test.com');
    await user.type(screen.getByLabelText(/Custom Message/i), 'Test message');

    await user.click(screen.getByRole('button', { name: /Generate Code/i }));

    await waitFor(() => {
      expect(mockGenerateCustomCode.mutateAsync).toHaveBeenCalledWith({
        prefix: 'TEST',
        landingPage: 'https://test.com',
        message: 'Test message',
      });
    });
  });

  it('copies code to clipboard and shows a success toast', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode]} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ACTIVE123');
    expect(toast.success).toHaveBeenCalledWith('Code copied to clipboard!');
  });

  it('shares the code using the Web Share API if available', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode]} />);

    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);

    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Join me on Cabana!',
      text: 'Use my referral code to get exclusive benefits',
      url: 'http://localhost:3000/invite/ACTIVE123',
    });
  });

  it('falls back to copying share URL if Web Share API is not available', async () => {
    (navigator.share as any) = undefined;
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode]} />);

    const shareButton = screen.getByRole('button', { name: /share/i });
    await user.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/invite/ACTIVE123');
    expect(toast.success).toHaveBeenCalledWith('Code copied to clipboard!');
  });

  it('generates and displays a QR code', async () => {
    (QRCode.toDataURL as vi.Mock).mockResolvedValue('data:image/png;base64,fake-qr-code');
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode]} />);

    const qrButton = screen.getByRole('button', { name: /qr code/i });
    await user.click(qrButton);

    const qrImage = await screen.findByAltText('QR code for ACTIVE123');
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute('src', 'data:image/png;base64,fake-qr-code');
  });
});