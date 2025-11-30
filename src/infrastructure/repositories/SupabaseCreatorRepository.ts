import { CreatorRepository } from '../../domain/repositories/CreatorRepository';
import { Creator } from '../../domain/entities/Creator';
import { getSupabaseDataSource } from '../datasources/SupabaseDataSource';
import { DomainError, CreatorNotFoundError } from '../../domain/errors';

interface CreatorRecord {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  cover_image?: string;
  profile_image?: string;
  pricing: {
    monthly: number;
    yearly?: number;
    ppv?: number;
  };
  tier?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export class SupabaseCreatorRepository implements CreatorRepository {
  private supabase = getSupabaseDataSource().getClient();

  async findById(id: string): Promise<Creator | null> {
    try {
      const { data, error } = await this.supabase
        .from('creators')
        .select('id, user_id, display_name, bio, cover_image, profile_image, pricing, tier, is_verified, created_at, updated_at')
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

      return this.mapToCreator(data);
    } catch (error) {
      throw new DomainError(`Failed to find creator by ID: ${error}`);
    }
  }

  async findByUserId(userId: string): Promise<Creator | null> {
    try {
      const { data, error } = await this.supabase
        .from('creators')
        .select('id, user_id, display_name, bio, cover_image, profile_image, pricing, tier, is_verified, created_at, updated_at')
        .eq('user_id', userId)
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

      return this.mapToCreator(data);
    } catch (error) {
      throw new DomainError(`Failed to find creator by user ID: ${error}`);
    }
  }

  async findByUsername(username: string): Promise<Creator | null> {
    try {
      const { data, error } = await this.supabase
        .from('creators')
        .select('id, user_id, display_name, bio, cover_image, profile_image, pricing, tier, is_verified, created_at, updated_at')
        .eq('display_name', username) // Assuming display_name is used as username
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

      return this.mapToCreator(data);
    } catch (error) {
      throw new DomainError(`Failed to find creator by username: ${error}`);
    }
  }

  async create(creator: Creator): Promise<Creator> {
    try {
      const { error } = await this.supabase
        .from('creators')
        .insert({
          id: creator.id,
          user_id: creator.userId,
          display_name: creator.displayName,
          bio: creator.bio,
          cover_image: creator.coverImage,
          profile_image: creator.profileImage,
          pricing: creator.pricing,
          tier: creator.tier,
          is_verified: creator.isVerified,
          created_at: creator.createdAt.toISOString(),
          updated_at: creator.updatedAt.toISOString()
        });

      if (error) {
        throw new DomainError(`Failed to create creator: ${error.message}`);
      }

      return creator;
    } catch (error) {
      throw new DomainError(`Failed to create creator: ${error}`);
    }
  }

  async update(creator: Creator): Promise<Creator> {
    try {
      const { data, error } = await this.supabase
        .from('creators')
        .update({
          display_name: creator.displayName,
          bio: creator.bio,
          cover_image: creator.coverImage,
          profile_image: creator.profileImage,
          pricing: creator.pricing,
          tier: creator.tier,
          is_verified: creator.isVerified,
          updated_at: new Date().toISOString()
        })
        .eq('id', creator.id)
        .select()
        .single();

      if (error) {
        throw new DomainError(`Failed to update creator: ${error.message}`);
      }

      if (!data) {
        throw new CreatorNotFoundError(creator.id);
      }

      return this.mapToCreator(data);
    } catch (error) {
      throw new DomainError(`Failed to update creator: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('creators')
        .delete()
        .eq('id', id);

      if (error) {
        throw new DomainError(`Failed to delete creator: ${error.message}`);
      }
    } catch (error) {
      throw new DomainError(`Failed to delete creator: ${error}`);
    }
  }

  private mapToCreator(record: CreatorRecord): Creator {
    return new Creator({
      id: record.id,
      userId: record.user_id,
      displayName: record.display_name,
      bio: record.bio,
      coverImage: record.cover_image,
      profileImage: record.profile_image,
      pricing: record.pricing,
      tier: record.tier,
      is_verified: record.is_verified,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at)
    });
  }
}