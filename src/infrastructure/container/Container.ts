import { UserRepository } from '../domain/repositories/UserRepository';
import { ContentRepository } from '../domain/repositories/ContentRepository';
import { CreatorRepository } from '../domain/repositories/CreatorRepository';
import { AuthService } from '../domain/services/AuthService';
import { EntitlementService } from '../domain/services/EntitlementService';
import { RegisterUserUseCase } from '../domain/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../domain/use-cases/auth/LoginUserUseCase';
import { GetContentUseCase } from '../domain/use-cases/content/GetContentUseCase';
import { AuthController, ContentController } from '../application/controllers/AppController';
import { SupabaseUserRepository } from '../infrastructure/repositories/SupabaseUserRepository';
import { SupabaseContentRepository } from '../infrastructure/repositories/SupabaseContentRepository';
import { SupabaseCreatorRepository } from '../infrastructure/repositories/SupabaseCreatorRepository';
import { SupabaseAuthService } from '../infrastructure/services/SupabaseAuthService';
import { SupabaseEntitlementService } from '../infrastructure/services/SupabaseEntitlementService';
import { SecureAIService } from '../infrastructure/services/SecureAIService';

export interface ServiceIdentifier<T> {
  new (...args: any[]): T;
}

export class Container {
  private static instance: Container;
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();
  private serviceTypes = new Map<string, ServiceIdentifier<any>>();

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register<T>(identifier: string, service: ServiceIdentifier<T>, isSingleton: boolean = false): void {
    this.serviceTypes.set(identifier, service);
    
    if (isSingleton) {
      // Pre-instantiate the singleton
      const instance = this.createInstance(service);
      this.singletons.set(identifier, instance);
    }
  }

  resolve<T>(identifier: string): T {
    // Check if it's a singleton
    if (this.singletons.has(identifier)) {
      return this.singletons.get(identifier);
    }

    // Check if we have a registered service type
    if (this.serviceTypes.has(identifier)) {
      const serviceType = this.serviceTypes.get(identifier);
      return this.createInstance(serviceType!);
    }

    throw new Error(`Service ${identifier} is not registered`);
  }

  private createInstance<T>(serviceType: ServiceIdentifier<T>): T {
    // For services that don't have dependencies, create directly
    // In a more sophisticated system, we'd have proper dependency injection with metadata
    return new serviceType();
  }

  // Convenience methods for common services
  registerRepositories(): void {
    this.register<UserRepository>('userRepository', SupabaseUserRepository, true);
    this.register<ContentRepository>('contentRepository', SupabaseContentRepository, true);
    this.register<CreatorRepository>('creatorRepository', SupabaseCreatorRepository, true);
  }

  registerServices(): void {
    this.register<AuthService>('authService', SupabaseAuthService, true);
    this.register<EntitlementService>('entitlementService', SupabaseEntitlementService, true);
    this.register<SecureAIService>('aiService', SecureAIService, true);
  }

  registerUseCases(): void {
    this.register<RegisterUserUseCase>('registerUserUseCase', RegisterUserUseCase);
    this.register<LoginUserUseCase>('loginUserUseCase', LoginUserUseCase);
    this.register<GetContentUseCase>('getContentUseCase', GetContentUseCase);
  }

  registerControllers(): void {
    this.register<AuthController>('authController', AuthController);
    this.register<ContentController>('contentController', ContentController);
  }

  initialize(): void {
    this.registerRepositories();
    this.registerServices();
    this.registerUseCases();
    this.registerControllers();
  }
}

// Initialize the container
const container = Container.getInstance();
container.initialize();

// Export a function to get services
export const getContainer = (): Container => Container.getInstance();