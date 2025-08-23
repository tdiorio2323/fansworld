import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NewCodeForm } from './NewCodeForm';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';

// Mock dependencies
vi.mock('@/hooks/useAdvancedReferral');

const mockGenerateCustomCode = {
  mutateAsync: vi.fn(),
  isPending: false,
};

describe('NewCodeForm', () => {
  const onSuccess = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAdvancedReferral as vi.Mock).mockReturnValue({
      generateCustomCode: mockGenerateCustomCode,
    });
  });

  it('renders form fields correctly', () => {
    render(<NewCodeForm onSuccess={onSuccess} onCancel={onCancel} />);
    expect(screen.getByLabelText(/Code Prefix/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Custom Landing Page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Custom Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Code/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<NewCodeForm onSuccess={onSuccess} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('submits form data and calls onSuccess', async () => {
    mockGenerateCustomCode.mutateAsync.mockResolvedValueOnce({});
    const user = userEvent.setup();
    render(<NewCodeForm onSuccess={onSuccess} onCancel={onCancel} />);

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

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('handles empty optional fields', async () => {
    mockGenerateCustomCode.mutateAsync.mockResolvedValueOnce({});
    const user = userEvent.setup();
    render(<NewCodeForm onSuccess={onSuccess} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /Generate Code/i }));

    await waitFor(() => {
      expect(mockGenerateCustomCode.mutateAsync).toHaveBeenCalledWith({
        prefix: undefined,
        landingPage: undefined,
        message: undefined,
      });
    });
  });

  it('disables generate button while pending', () => {
    (useAdvancedReferral as vi.Mock).mockReturnValue({
      generateCustomCode: { ...mockGenerateCustomCode, isPending: true },
    });
    render(<NewCodeForm onSuccess={onSuccess} onCancel={onCancel} />);
    expect(screen.getByRole('button', { name: /Generating.../i })).toBeDisabled();
  });
});