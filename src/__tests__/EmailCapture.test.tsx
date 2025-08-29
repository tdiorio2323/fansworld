import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailCapture from '@/components/EmailCapture';

describe('EmailCapture', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submits email successfully', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    global.fetch = fetchMock as any;

    render(<EmailCapture />);

    const input = screen.getByPlaceholderText(/enter your email address/i);
    await user.type(input, 'test@example.com');
    const button = screen.getByRole('button');

    await user.click(button);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/waitlist', expect.any(Object)));
    await waitFor(() => expect(screen.getByText(/welcome!/i)).toBeInTheDocument());
    expect(input).toHaveValue('');
  });

  it('handles submission error', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    global.fetch = fetchMock as any;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<EmailCapture />);

    const input = screen.getByPlaceholderText(/enter your email address/i);
    await user.type(input, 'test@example.com');
    const button = screen.getByRole('button');

    await user.click(button);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(consoleError).toHaveBeenCalled();
    expect(screen.queryByText(/welcome!/i)).not.toBeInTheDocument();
    expect(input).toHaveValue('test@example.com');

    consoleError.mockRestore();
  });
});

