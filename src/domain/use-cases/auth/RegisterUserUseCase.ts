import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { DomainError } from '../errors';

export interface RegisterUserUseCaseRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterUserUseCaseResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(request: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(request.email);
    if (existingUserByEmail) {
      throw new DomainError('Email already registered');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(request.username);
    if (existingUserByUsername) {
      throw new DomainError('Username already taken');
    }

    // Create user entity (the service will handle the creation details)
    const result = await this.authService.register(request.email, request.password, request.username);
    
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    };
  }
}