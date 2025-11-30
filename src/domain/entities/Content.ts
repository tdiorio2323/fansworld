import { ValueObject } from '../value-objects/ValueObject';
import { AccessLevel } from '../value-objects/AccessLevel';

export interface ContentProps {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  type: 'post' | 'message' | 'media' | 'ppv' | 'subscription_content';
  accessLevel: AccessLevel;
  price?: number;
  subscriptionTierRequired?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: Date;
  publishedAt?: Date;
}

export class Content extends ValueObject<ContentProps> {
  constructor(props: ContentProps) {
    super(props);
  }

  get id(): string {
    return this.props.id;
  }

  get creatorId(): string {
    return this.props.creatorId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get type(): ContentProps['type'] {
    return this.props.type;
  }

  get accessLevel(): AccessLevel {
    return this.props.accessLevel;
  }

  get price(): number | undefined {
    return this.props.price;
  }

  get subscriptionTierRequired(): string | undefined {
    return this.props.subscriptionTierRequired;
  }

  get contentUrl(): string | undefined {
    return this.props.contentUrl;
  }

  get thumbnailUrl(): string | undefined {
    return this.props.thumbnailUrl;
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  static create(props: Omit<ContentProps, 'id' | 'createdAt'> & { id?: string }): Content {
    return new Content({
      ...props,
      id: props.id || `content_${Date.now()}`,
      createdAt: new Date()
    });
  }

  publish(): void {
    this.props.isPublished = true;
    this.props.publishedAt = new Date();
  }

  unpublish(): void {
    this.props.isPublished = false;
    this.props.publishedAt = undefined;
  }

  updateAccessLevel(accessLevel: AccessLevel): void {
    this.props.accessLevel = accessLevel;
  }

  updatePrice(price: number): void {
    this.props.price = price;
  }

  canUserAccess(user?: { id: string; role: string }): boolean {
    // Public content is always accessible
    if (this.props.accessLevel.value === 'public') {
      return true;
    }

    // Unauthenticated user cannot access non-public content
    if (!user) {
      return false;
    }

    // Creator always has access to their own content
    if (user.id === this.props.creatorId) {
      return true;
    }

    // Admins and moderators have access to all content
    if (user.role === 'admin' || user.role === 'moderator') {
      return true;
    }

    // For other access levels, the business logic would be more complex
    // This is a simplified version - real implementation would check subscriptions, purchases, etc.
    return false;
  }
}