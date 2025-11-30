import { Container } from '../../src/infrastructure/container/Container';
import { UserRepository } from '../../src/domain/repositories/UserRepository';
import { AuthService } from '../../src/domain/services/AuthService';

describe('Dependency Injection Container', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.getInstance();
    // Reset container for each test to ensure clean state
    (container as any).singletons.clear();
    (container as any).serviceTypes.clear();
    container.initialize();
  });

  it('should resolve registered services', () => {
    const userRepository = container.resolve<UserRepository>('userRepository');
    const authService = container.resolve<AuthService>('authService');

    expect(userRepository).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should return the same instance for singleton services', () => {
    const service1 = container.resolve<UserRepository>('userRepository');
    const service2 = container.resolve<UserRepository>('userRepository');

    expect(service1).toBe(service2);
  });

  it('should throw error for unregistered service', () => {
    expect(() => {
      container.resolve('nonExistentService');
    }).toThrow('Service nonExistentService is not registered');
  });
});