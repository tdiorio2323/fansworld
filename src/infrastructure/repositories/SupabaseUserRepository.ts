import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/value-objects/Role';
import { getSupabaseDataSource } from '../datasources/SupabaseDataSource';
import { DomainError, UserNotFoundError } from '../../domain/errors';

interface UserRecord {
  id: string;
  email: string;
  username: string;
  role: string;
  verified: boolean;
  created_at: string;
  last_login_at?: string;
}

export class SupabaseUserRepository implements UserRepository {
  private supabase = getSupabaseDataSource().getClient();

  async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, email, username, role, verified, created_at, last_login_at')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          return null;
        }
        throw new DomainError(`Database error: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      throw new DomainError(`Failed to find user by ID: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, email, username, role, verified, created_at, last_login_at')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          return null;
        }
        throw new DomainError(`Database error: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      throw new DomainError(`Failed to find user by email: ${error}`);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, email, username, role, verified, created_at, last_login_at')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          return null;
        }
        throw new DomainError(`Database error: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return this.mapToUser(data);
    } catch (error) {
      throw new DomainError(`Failed to find user by username: ${error}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const { error } = await this.supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role.value,
          verified: user.verified,
          created_at: user.createdAt.toISOString()
        });

      if (error) {
        throw new DomainError(`Failed to create user: ${error.message}`);
      }

      return user;
    } catch (error) {
      throw new DomainError(`Failed to create user: ${error}`);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          email: user.email,
          username: user.username,
          role: user.role.value,
          verified: user.verified,
          last_login_at: user.lastLoginAt?.toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new DomainError(`Failed to update user: ${error.message}`);
      }

      if (!data) {
        throw new UserNotFoundError(user.id);
      }

      return this.mapToUser(data);
    } catch (error) {
      throw new DomainError(`Failed to update user: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new DomainError(`Failed to delete user: ${error.message}`);
      }
    } catch (error) {
      throw new DomainError(`Failed to delete user: ${error}`);
    }
  }

  private mapToUser(record: UserRecord): User {
    return new User({
      id: record.id,
      email: record.email,
      username: record.username,
      role: Role.create(record.role as any),
      verified: record.verified,
      createdAt: new Date(record.created_at),
      lastLoginAt: record.last_login_at ? new Date(record.last_login_at) : undefined
    });
  }
}