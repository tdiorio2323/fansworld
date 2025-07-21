import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ReferralCodeItem } from './ReferralCodeItem';
import { toast } from 'sonner';
import QRCode from 'qrcode';

vi.mock('sonner');
vi.mock('qrcode');

const mockCode = {
  id: '1',
  code: 'ACTIVE123',
  uses_remaining: 10,
  total_uses: 5,
  active: true,
  custom_message: 'Welcome!',
  landing_page_url: 'https://example.com/active',
  expires_at: new Date(Date.now() + 86400000).toISOString(), // expires tomorrow
};

describe('ReferralCodeItem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
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

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders code details correctly', () => {
    render(<ReferralCodeItem code={mockCode} />);
    expect(screen.getByText('ACTIVE123')).toBeInTheDocument();
    expect(screen.getByText('10 uses left')).toBeInTheDocument();
    expect(screen.getByText('5 times used')).toBeInTheDocument();
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Custom landing page')).toBeInTheDocument();
    expect(screen.getByText(/Expires/)).toBeInTheDocument();
  });

  it('copies code to clipboard and shows success toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ReferralCodeItem code={mockCode} />);

    const copyButton = screen.getByRole('button', { name: /Copy code/i });
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ACTIVE123');
    expect(toast.success).toHaveBeenCalledWith('Code copied to clipboard!');

    // Check icon changed to Check
    expect(copyButton.querySelector('svg.lucide-check')).toBeInTheDocument();

    // Fast-forward time to see if it reverts
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(copyButton.querySelector('svg.lucide-copy')).toBeInTheDocument();
  });

  it('shares the code using Web Share API if available', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeItem code={mockCode} />);

    const shareButton = screen.getByRole('button', { name: /Share code/i });
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
    render(<ReferralCodeItem code={mockCode} />);

    const shareButton = screen.getByRole('button', { name: /Share code/i });
    await user.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/invite/ACTIVE123');
    expect(toast.success).toHaveBeenCalledWith('Share link copied to clipboard!');
  });

  it('generates and displays a QR code on click, and hides it on second click', async () => {
    (QRCode.toDataURL as vi.Mock).mockResolvedValue('data:image/png;base64,fake-qr-code');
    const user = userEvent.setup();
    render(<ReferralCodeItem code={mockCode} />);

    const qrButton = screen.getByRole('button', { name: /Show QR code/i });

    // First click: show QR code
    await user.click(qrButton);

    const qrImage = await screen.findByAltText('QR code for ACTIVE123');
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute('src', 'data:image/png;base64,fake-qr-code');
    expect(QRCode.toDataURL).toHaveBeenCalledWith('http://localhost:3000/invite/ACTIVE123', expect.any(Object));

    // Second click: hide QR code
    await user.click(qrButton);
    expect(screen.queryByAltText('QR code for ACTIVE123')).not.toBeInTheDocument();
  });
});