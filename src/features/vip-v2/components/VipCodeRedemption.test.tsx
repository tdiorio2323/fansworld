import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { VipCodeRedemption } from './VipCodeRedemption';

vi.mock('@/hooks/useFlag', () => ({
  useFlag: () => ({ isEnabled: true }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}));

const processPayment = vi.fn().mockResolvedValue({ paymentIntentId: 'pi_test' });

vi.mock('@/hooks/useStripePayments', () => ({
  useStripePayments: () => ({
    paymentMethods: {
      paymentMethods: [
        { id: 'pm1', stripe_payment_method_id: 'pm_123', is_default: true },
      ],
    },
    actions: {
      processPayment: { mutateAsync: processPayment },
    },
  }),
}));

const getCodeByString = vi.fn();
const redeemCode = vi.fn();

vi.mock('../services/vipService', () => ({
  vipV2Service: {
    getCodeByString,
    redeemCode,
  },
}));

describe('VipCodeRedemption', () => {
  it('processes payment and redeems code', async () => {
    getCodeByString.mockResolvedValue({
      id: 'code1',
      code: 'VIP123',
      title: 'VIP',
      description: 'desc',
      price_cents: 1000,
      max_uses: 5,
      current_uses: 0,
      benefits: [],
    });
    redeemCode.mockResolvedValue({ id: 'red1' });

    window.history.pushState({}, '', '/?utm_source=twitter&utm_medium=social&utm_campaign=launch');

    render(<VipCodeRedemption />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter your vip code/i), 'vip123');
    await user.click(screen.getByRole('button', { name: /lookup vip code/i }));

    const redeemButton = await screen.findByRole('button', { name: /pay & redeem/i });
    await user.click(redeemButton);

    await waitFor(() => {
      expect(processPayment).toHaveBeenCalledWith({
        amount: 10,
        paymentMethodId: 'pm_123',
        description: 'VIP code VIP123',
      });
      expect(redeemCode).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          utmSource: 'twitter',
          utmMedium: 'social',
          utmCampaign: 'launch',
          paymentIntentId: 'pi_test',
          amountPaidCents: 1000,
        }),
        undefined,
      );
    });
  });
});
