import { describe, it, expect, vi } from 'vitest';
import { 
  generateSecureVipCode, 
  sanitizeErrorMessage, 
  checkRateLimit, 
  validateEmail, 
  validateVipCode, 
  sanitizeInput 
} from '../security';

describe('Security Utils', () => {
  describe('generateSecureVipCode', () => {
    it('generates a VIP code of correct length', async () => {
      const code = await generateSecureVipCode();
      expect(code).toHaveLength(8);
    });

    it('generates alphanumeric codes', async () => {
      const code = await generateSecureVipCode();
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
    });

    it('generates different codes on multiple calls', async () => {
      const code1 = await generateSecureVipCode();
      const code2 = await generateSecureVipCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('sanitizeErrorMessage', () => {
    it('returns string errors as-is', () => {
      const error = 'Something went wrong';
      expect(sanitizeErrorMessage(error)).toBe(error);
    });

    it('extracts message from error objects', () => {
      const error = { message: 'Database connection failed' };
      expect(sanitizeErrorMessage(error)).toBe('Database connection failed');
    });

    it('sanitizes email addresses', () => {
      const error = { message: 'User test@example.com not found' };
      expect(sanitizeErrorMessage(error)).toBe('User [email] not found');
    });

    it('sanitizes credit card numbers', () => {
      const error = { message: 'Card 1234567890123456 declined' };
      expect(sanitizeErrorMessage(error)).toBe('Card [card] declined');
    });

    it('sanitizes UUIDs', () => {
      const error = { message: 'Item 123e4567-e89b-12d3-a456-426614174000 not found' };
      expect(sanitizeErrorMessage(error)).toBe('Item [id] not found');
    });

    it('returns default message for invalid errors', () => {
      expect(sanitizeErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
      expect(sanitizeErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
      expect(sanitizeErrorMessage({})).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('allows first request', () => {
      const result = checkRateLimit('test-key');
      expect(result).toBe(true);
    });

    it('tracks attempts in localStorage', () => {
      checkRateLimit('test-key');
      const stored = localStorage.getItem('rateLimit_test-key');
      expect(stored).toBeTruthy();
    });

    it('blocks after max attempts', () => {
      // Make max attempts
      for (let i = 0; i < 3; i++) {
        checkRateLimit('test-key', 3);
      }
      
      // Next attempt should be blocked
      const result = checkRateLimit('test-key', 3);
      expect(result).toBe(false);
    });

    it('uses custom max attempts', () => {
      // Make 5 attempts with max of 5
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit('test-key', 5)).toBe(true);
      }
      
      // 6th attempt should be blocked
      expect(checkRateLimit('test-key', 5)).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@domain.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateVipCode', () => {
    it('validates correct VIP code format', () => {
      expect(validateVipCode('ABCD1234')).toBe(true);
      expect(validateVipCode('12345678')).toBe(true);
      expect(validateVipCode('AAAAAAAA')).toBe(true);
    });

    it('rejects invalid VIP code formats', () => {
      expect(validateVipCode('ABC123')).toBe(false); // too short
      expect(validateVipCode('ABCD123456')).toBe(false); // too long
      expect(validateVipCode('abcd1234')).toBe(false); // lowercase
      expect(validateVipCode('ABCD-123')).toBe(false); // special chars
      expect(validateVipCode('')).toBe(false); // empty
    });
  });

  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('removes javascript: URLs', () => {
      const input = 'javascript:alert("xss") Hello';
      expect(sanitizeInput(input)).toBe('alert("xss") Hello');
    });

    it('removes event handlers', () => {
      const input = '<div onclick="alert()">Hello</div>';
      expect(sanitizeInput(input)).toBe('div Hello/div');
    });

    it('removes HTML brackets', () => {
      const input = '<div>Hello</div>';
      expect(sanitizeInput(input)).toBe('divHello/div');
    });

    it('trims whitespace', () => {
      const input = '  Hello World  ';
      expect(sanitizeInput(input)).toBe('Hello World');
    });

    it('limits string length', () => {
      const longInput = 'a'.repeat(1500);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(1000);
    });
  });
});