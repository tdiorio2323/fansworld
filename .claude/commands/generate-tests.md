---
name: generate-tests
description: Automatically generate comprehensive test suites for React components, hooks, API endpoints, and utility functions. Creates unit tests, integration tests, and E2E tests following best practices.
---

# Generate Tests Command

This command analyzes your codebase and generates comprehensive test suites using modern testing frameworks and best practices.

## Supported Test Types

### Unit Tests
- **React Components**: Testing props, state, events, and rendering
- **Custom Hooks**: Testing hook behavior and state changes
- **Utility Functions**: Testing pure functions and business logic
- **API Endpoints**: Testing request/response handling and validation

### Integration Tests
- **Component Integration**: Testing component interactions
- **API Integration**: Testing full request/response cycles
- **Database Integration**: Testing database operations
- **Third-party Integration**: Testing external service interactions

### End-to-End Tests
- **User Flows**: Testing complete user journeys
- **Critical Paths**: Testing essential business functionality
- **Cross-browser Testing**: Ensuring compatibility
- **Performance Testing**: Testing load and response times

## Testing Stack

**Frontend Testing:**
- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **MSW**: API mocking for integration tests
- **Playwright**: E2E testing framework

**Backend Testing:**
- **Vitest**: API endpoint testing
- **Supertest**: HTTP assertion testing
- **Test Databases**: Isolated test environments
- **Mock Services**: External service mocking

## Test Generation Features

1. **Smart Analysis**: Analyzes existing code to understand structure and dependencies
2. **Best Practices**: Follows testing best practices and patterns
3. **Mock Generation**: Creates appropriate mocks for dependencies
4. **Edge Case Coverage**: Includes tests for edge cases and error scenarios
5. **Accessibility Testing**: Includes a11y tests for components
6. **Performance Tests**: Generates performance benchmarks where applicable

## Usage Examples

```bash
# Generate tests for specific component
claude generate-tests src/components/UserProfile.tsx

# Generate tests for entire feature
claude generate-tests src/features/auth/

# Generate E2E tests for user flow
claude generate-tests --e2e src/pages/checkout/

# Generate API tests
claude generate-tests api/server.ts --api

# Generate all missing tests
claude generate-tests --scan-all
```

## Test Patterns

### Component Tests
```javascript
// Tests component rendering, props, events, and accessibility
describe('UserProfile Component', () => {
  it('renders user information correctly', () => {
    // Test implementation
  });
  
  it('handles click events', () => {
    // Event testing
  });
  
  it('meets accessibility standards', () => {
    // A11y testing
  });
});
```

### Hook Tests
```javascript
// Tests custom hook behavior and state changes
describe('useAuth Hook', () => {
  it('manages authentication state', () => {
    // Hook testing with renderHook
  });
});
```

### API Tests
```javascript
// Tests API endpoints with various scenarios
describe('POST /api/users', () => {
  it('creates user successfully', () => {
    // API endpoint testing
  });
  
  it('validates input data', () => {
    // Validation testing
  });
});
```

## Configuration

The command automatically detects your testing setup and generates tests compatible with your existing configuration:

- **Vitest Config**: Uses your vitest.config.ts settings
- **Test Utils**: Leverages existing test utilities and setup
- **Mock Patterns**: Follows your established mocking patterns
- **File Structure**: Maintains your preferred test file organization

## Quality Assurance

Generated tests include:
- ✅ **Comprehensive Coverage**: Aims for high code coverage
- ✅ **Edge Cases**: Tests error conditions and boundary cases
- ✅ **Performance**: Includes performance assertions where relevant
- ✅ **Accessibility**: Tests for WCAG compliance
- ✅ **Security**: Tests for common security vulnerabilities
- ✅ **Maintainability**: Creates readable, maintainable test code

Use this command to quickly bootstrap comprehensive test coverage for your application while following industry best practices.