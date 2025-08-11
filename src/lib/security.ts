// Security utilities for Cabana platform
// Provides secure code generation and input validation

/**
 * Generates a cryptographically secure VIP code
 * @returns {Promise<string>} A secure VIP code
 */
export const generateSecureVipCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const array = new Uint8Array(8)
  crypto.getRandomValues(array)
  
  let result = ''
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length]
  }
  
  return result
}

/**
 * Sanitizes error messages for user display
 * @param {any} error - Error object or message
 * @returns {string} Sanitized error message
 */
export const sanitizeErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    // Remove sensitive information from error messages
    const sanitized = error.message
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
      .replace(/\b\d{16,19}\b/g, '[card]')
      .replace(/\b[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}\b/gi, '[id]')
    
    return sanitized
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Rate limiting check
 * @param {string} key - Unique identifier for rate limiting
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} Whether the action is allowed
 */
export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean => {
  const now = Date.now()
  const storageKey = `rateLimit_${key}`
  
  try {
    const stored = localStorage.getItem(storageKey)
    const attempts = stored ? JSON.parse(stored) : []
    
    // Remove expired attempts
    const validAttempts = attempts.filter((time: number) => now - time < windowMs)
    
    // Check if we've exceeded the limit
    if (validAttempts.length >= maxAttempts) {
      return false
    }
    
    // Add current attempt
    validAttempts.push(now)
    localStorage.setItem(storageKey, JSON.stringify(validAttempts))
    
    return true
  } catch {
    // If localStorage is not available, allow the action
    return true
  }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates VIP code format
 * @param {string} code - VIP code to validate
 * @returns {boolean} Whether code format is valid
 */
export const validateVipCode = (code: string): boolean => {
  const codeRegex = /^[A-Z0-9]{8}$/
  return codeRegex.test(code)
}

/**
 * Sanitizes user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000) // Limit length
}

/**
 * Generates a secure session token
 * @returns {string} Session token
 */
export const generateSessionToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generates a secure session ID
 * @returns {string} Session ID
 */
export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validates VIP code format
 * @param {string} code - VIP code to validate
 * @returns {boolean} Whether code format is valid
 */
export const isValidVipCodeFormat = (code: string): boolean => {
  // Allow various formats: FOUNDER123456, PLATINUM123, GOLD123, EARLY123, or 8-character alphanumeric
  const patterns = [
    /^FOUNDER[A-Z0-9]{6}$/,
    /^PLATINUM[A-Z0-9]{3,6}$/,
    /^GOLD[A-Z0-9]{3,6}$/,
    /^EARLY[A-Z0-9]{3,6}$/,
    /^[A-Z0-9]{8}$/,
    /^[A-Z0-9]{6,12}$/
  ]
  
  return patterns.some(pattern => pattern.test(code))
}