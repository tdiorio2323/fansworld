import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { DomainError } from '../errors';

export interface LoginUserUseCaseRequest {
  email: string;
  password: string;
}

export interface LoginUserUseCaseResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(request: LoginUserUseCaseRequest): Promise<LoginUserUseCaseResponse> {
    // Validate user credentials using auth service
    const result = await this.authService.login(request.email, request.password);
    
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    };
  }
}