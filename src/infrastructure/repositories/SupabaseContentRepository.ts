import { ContentRepository } from '../../domain/repositories/ContentRepository';
import { Content } from '../../domain/entities/Content';
import { AccessLevel } from '../../domain/value-objects/AccessLevel';
import { getSupabaseDataSource } from '../datasources/SupabaseDataSource';
import { DomainError, ContentNotFoundError } from '../../domain/errors';

interface ContentRecord {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  type: string;
  access_level: string;
  price?: number;
  subscription_tier_required?: string;
  content_url?: string;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  published_at?: string;
}

export class SupabaseContentRepository implements ContentRepository {
  private supabase = getSupabaseDataSource().getClient();

  async findById(id: string): Promise<Content | null> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .select('id, creator_id, title, description, type, access_level, price, subscription_tier_required, content_url, thumbnail_url, is_published, created_at, published_at')
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

      return this.mapToContent(data);
    } catch (error) {
      throw new DomainError(`Failed to find content by ID: ${error}`);
    }
  }

  async findByCreatorId(creatorId: string): Promise<Content[]> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .select('id, creator_id, title, description, type, access_level, price, subscription_tier_required, content_url, thumbnail_url, is_published, created_at, published_at')
        .eq('creator_id', creatorId);

      if (error) {
        throw new DomainError(`Database error: ${error.message}`);
      }

      return data.map(record => this.mapToContent(record));
    } catch (error) {
      throw new DomainError(`Failed to find content by creator ID: ${error}`);
    }
  }

  async findByAccessLevel(accessLevel: string): Promise<Content[]> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .select('id, creator_id, title, description, type, access_level, price, subscription_tier_required, content_url, thumbnail_url, is_published, created_at, published_at')
        .eq('access_level', accessLevel);

      if (error) {
        throw new DomainError(`Database error: ${error.message}`);
      }

      return data.map(record => this.mapToContent(record));
    } catch (error) {
      throw new DomainError(`Failed to find content by access level: ${error}`);
    }
  }

  async create(content: Content): Promise<Content> {
    try {
      const { error } = await this.supabase
        .from('contents')
        .insert({
          id: content.id,
          creator_id: content.creatorId,
          title: content.title,
          description: content.description,
          type: content.type,
          access_level: content.accessLevel.value,
          price: content.price,
          subscription_tier_required: content.subscriptionTierRequired,
          content_url: content.contentUrl,
          thumbnail_url: content.thumbnailUrl,
          is_published: content.isPublished,
          created_at: content.createdAt.toISOString(),
          published_at: content.publishedAt?.toISOString()
        });

      if (error) {
        throw new DomainError(`Failed to create content: ${error.message}`);
      }

      return content;
    } catch (error) {
      throw new DomainError(`Failed to create content: ${error}`);
    }
  }

  async update(content: Content): Promise<Content> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .update({
          title: content.title,
          description: content.description,
          type: content.type,
          access_level: content.accessLevel.value,
          price: content.price,
          subscription_tier_required: content.subscriptionTierRequired,
          content_url: content.contentUrl,
          thumbnail_url: content.thumbnailUrl,
          is_published: content.isPublished,
          published_at: content.publishedAt?.toISOString()
        })
        .eq('id', content.id)
        .select()
        .single();

      if (error) {
        throw new DomainError(`Failed to update content: ${error.message}`);
      }

      if (!data) {
        throw new ContentNotFoundError(content.id);
      }

      return this.mapToContent(data);
    } catch (error) {
      throw new DomainError(`Failed to update content: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('contents')
        .delete()
        .eq('id', id);

      if (error) {
        throw new DomainError(`Failed to delete content: ${error.message}`);
      }
    } catch (error) {
      throw new DomainError(`Failed to delete content: ${error}`);
    }
  }

  async publishContent(id: string): Promise<Content | null> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .update({ 
          is_published: true, 
          published_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DomainError(`Failed to publish content: ${error.message}`);
      }

      return data ? this.mapToContent(data) : null;
    } catch (error) {
      throw new DomainError(`Failed to publish content: ${error}`);
    }
  }

  async unpublishContent(id: string): Promise<Content | null> {
    try {
      const { data, error } = await this.supabase
        .from('contents')
        .update({ 
          is_published: false, 
          published_at: null 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new DomainError(`Failed to unpublish content: ${error.message}`);
      }

      return data ? this.mapToContent(data) : null;
    } catch (error) {
      throw new DomainError(`Failed to unpublish content: ${error}`);
    }
  }

  private mapToContent(record: ContentRecord): Content {
    return new Content({
      id: record.id,
      creatorId: record.creator_id,
      title: record.title,
      description: record.description,
      type: record.type as 'post' | 'message' | 'media' | 'ppv' | 'subscription_content',
      accessLevel: AccessLevel.create(record.access_level as any),
      price: record.price,
      subscriptionTierRequired: record.subscription_tier_required,
      contentUrl: record.content_url,
      thumbnailUrl: record.thumbnail_url,
      isPublished: record.is_published,
      createdAt: new Date(record.created_at),
      publishedAt: record.published_at ? new Date(record.published_at) : undefined
    });
  }
}