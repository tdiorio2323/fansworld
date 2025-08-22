import { describe, it, expect } from 'vitest';
import { useAdvancedReferral } from './useAdvancedReferral';

describe('useAdvancedReferral', () => {
  it('should be defined', () => {
    expect(useAdvancedReferral).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useAdvancedReferral).toBe('function');
  });
});