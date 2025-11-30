import { User } from '../entities/User';

export interface AuthService {
  register(email: string, password: string, username: string): Promise<{ user: User; accessToken: string; refreshToken: string }>;
  login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }>;
  logout(accessToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyToken(token: string): Promise<User | null>;
}