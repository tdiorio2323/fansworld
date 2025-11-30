import { AuthService } from '../../domain/services/AuthService';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/value-objects/Role';
import { getSupabaseDataSource } from '../datasources/SupabaseDataSource';
import { DomainError } from '../../domain/errors';

export class SupabaseAuthService implements AuthService {
  private supabase = getSupabaseDataSource();

  async register(email: string, password: string, username: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Note: In a real implementation, user creation would go through the Supabase Auth
    // and then the user profile would be created in our users table
    // For now, we're simulating the process
    const { data: authData, error: authError } = await this.supabase.getAuth().signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (authError) {
      throw new DomainError(`Registration failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new DomainError('Registration failed: No user returned');
    }

    // Create user entity with the registered user data
    const user = new User({
      id: authData.user.id,
      email: authData.user.email || email,
      username: username,
      role: Role.FAN, // Default role for new users
      verified: !!(authData.user.email_confirmed_at),
      createdAt: new Date(authData.user.created_at || new Date().toISOString()),
      lastLoginAt: new Date()
    });

    // Return user with tokens
    return {
      user,
      accessToken: authData.session?.access_token || '',
      refreshToken: authData.session?.refresh_token || ''
    };
  }

  async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { data, error } = await this.supabase.getAuth().signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new DomainError(`Login failed: ${error.message}`);
    }

    if (!data.user) {
      throw new DomainError('Login failed: No user returned');
    }

    // Create user entity
    const user = new User({
      id: data.user.id,
      email: data.user.email || email,
      username: data.user.user_metadata?.username || email.split('@')[0],
      role: Role.create(data.user.user_metadata?.role || 'fan'),
      verified: !!(data.user.email_confirmed_at),
      createdAt: new Date(data.user.created_at || new Date().toISOString()),
      lastLoginAt: new Date()
    });

    return {
      user,
      accessToken: data.session?.access_token || '',
      refreshToken: data.session?.refresh_token || ''
    };
  }

  async logout(accessToken: string): Promise<void> {
    // In a real implementation, we'd use the access token to sign out
    // For now we'll just sign out the current session
    const { error } = await this.supabase.getAuth().signOut();
    
    if (error) {
      throw new DomainError(`Logout failed: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { data, error } = await this.supabase.getAuth().refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      throw new DomainError(`Token refresh failed: ${error.message}`);
    }

    if (!data.session) {
      throw new DomainError('Token refresh failed: No session returned');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    };
  }

  async verifyToken(token: string): Promise<User | null> {
    // Supabase doesn't have a direct token verification method
    // We'll get the current user session instead
    // In a real implementation, this might use the service role key for validation
    try {
      const { data, error } = await this.supabase.getAuth().getUser(token);
      
      if (error || !data.user) {
        return null;
      }

      return new User({
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
        role: Role.create(data.user.user_metadata?.role || 'fan'),
        verified: !!(data.user.email_confirmed_at),
        createdAt: new Date(data.user.created_at || new Date().toISOString())
      });
    } catch (error) {
      return null;
    }
  }
}