import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ReferralCodeGenerator } from './ReferralCodeGenerator';

// Mock child components to isolate the test to ReferralCodeGenerator
vi.mock('./NewCodeForm', () => ({
  NewCodeForm: ({ onCancel }: { onCancel: () => void }) => (
    <div>
      <span>NewCodeForm</span>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock('./ReferralCodeItem', () => ({
  ReferralCodeItem: ({ code }: { code: { id: string; code: string } }) => (
    <div data-testid={`referral-item-${code.id}`}>{code.code}</div>
  ),
}));

const mockActiveCode = {
  id: '1',
  code: 'ACTIVE123',
  uses_remaining: 10,
  total_uses: 5,
  active: true,
};

const mockExpiredCode = {
  id: '2',
  code: 'EXPIRED456',
  uses_remaining: 0,
  total_uses: 20,
  active: false,
};

describe('ReferralCodeGenerator', () => {
  it('renders correctly with no codes', () => {
    render(<ReferralCodeGenerator existingCodes={[]} />);
    expect(screen.getByText('Your Referral Codes')).toBeInTheDocument();
    expect(screen.getByText('No active referral codes yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Your First Code/i })).toBeInTheDocument();
  });

  it('renders active and expired codes', () => {
    render(<ReferralCodeGenerator existingCodes={[mockActiveCode, mockExpiredCode]} />);

    // Active code rendered by mock component
    expect(screen.getByTestId('referral-item-1')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE123')).toBeInTheDocument();

    // Expired code section
    expect(screen.getByText('Expired Codes')).toBeInTheDocument();
    expect(screen.getByText('EXPIRED456')).toBeInTheDocument();
  });

  it('toggles the NewCodeForm visibility', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[]} />);

    // Form is initially hidden
    expect(screen.queryByText('NewCodeForm')).not.toBeInTheDocument();

    // Click "Create Custom Code" to show it
    await user.click(screen.getByRole('button', { name: /Create Custom Code/i }));
    expect(screen.getByText('NewCodeForm')).toBeInTheDocument();

    // Click "Cancel" in the mock form to hide it
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByText('NewCodeForm')).not.toBeInTheDocument();
  });

  it('shows the form when "Create Your First Code" is clicked', async () => {
    const user = userEvent.setup();
    render(<ReferralCodeGenerator existingCodes={[]} />);

    expect(screen.queryByText('NewCodeForm')).not.toBeInTheDocument();

    const createFirstButton = screen.getByRole('button', { name: /Create Your First Code/i });
    await user.click(createFirstButton);

    expect(screen.getByText('NewCodeForm')).toBeInTheDocument();
  });
});