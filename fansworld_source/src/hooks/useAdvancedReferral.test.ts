import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdvancedReferral } from './useAdvancedReferral.ts';
import { createWrapper } from '@/lib/test-utils'; // We will create this utility
import { supabase } from '@/integrations/supabase/client';

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('useAdvancedReferral', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  it('should fetch claimed rewards successfully', async () => {
    const mockClaimedRewards = [
      { id: 'reward1', reward_id: 'r1', user_id: 'user1' },
      { id: 'reward2', reward_id: 'r2', user_id: 'user1' },
    ];

    // Setup the mock response for the 'claimed_rewards' query
    const fromMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockResolvedValue({ data: mockClaimedRewards, error: null });
    vi.spyOn(supabase, 'from').mockImplementation((tableName) => {
      if (tableName === 'claimed_rewards') {
        return {
          from: fromMock,
          select: selectMock,
        } as any;
      }
      return { from: fromMock, select: vi.fn() } as any;
    });

    // Render the hook using our test wrapper
    const { result } = renderHook(() => useAdvancedReferral(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to be in a 'success' state
    await waitFor(() => expect(result.current.claimedRewards.isSuccess).toBe(true));

    // Assert that the data is correct
    expect(result.current.claimedRewards.data).toEqual(mockClaimedRewards);
    expect(supabase.from).toHaveBeenCalledWith('claimed_rewards');
    expect(selectMock).toHaveBeenCalledWith('*');
  });

  it('should call the generate_custom_referral_code RPC when generateCustomCode is mutated', async () => {
    const mockNewCode = { id: 'new-code-id', code: 'CUSTOM123' };

    // Setup the mock response for the RPC call
    const rpcMock = vi.fn().mockResolvedValue({ data: mockNewCode, error: null });
    vi.spyOn(supabase, 'rpc').mockImplementation(rpcMock);

    const { result } = renderHook(() => useAdvancedReferral(), {
      wrapper: createWrapper(),
    });

    const mutationPayload = {
      prefix: 'CUSTOM',
      message: 'A custom message',
      landingPage: 'https://example.com/custom',
    };

    // Trigger the mutation
    await result.current.generateCustomCode.mutateAsync(mutationPayload);

    // Assert that the RPC was called with the correct parameters
    expect(rpcMock).toHaveBeenCalledWith('generate_custom_referral_code', {
      p_prefix: mutationPayload.prefix,
      p_custom_message: mutationPayload.message,
      p_landing_page_url: mutationPayload.landingPage,
    });
  });
});