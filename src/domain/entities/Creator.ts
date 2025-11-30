import { ValueObject } from '../value-objects/ValueObject';
import { User } from './User';

export interface CreatorProps {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  coverImage?: string;
  profileImage?: string;
  pricing: {
    monthly: number;
    yearly?: number;
    ppv?: number;
  };
  tier?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Creator extends ValueObject<CreatorProps> {
  constructor(props: CreatorProps) {
    super(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get coverImage(): string | undefined {
    return this.props.coverImage;
  }

  get profileImage(): string | undefined {
    return this.props.profileImage;
  }

  get pricing(): CreatorProps['pricing'] {
    return this.props.pricing;
  }

  get tier(): string | undefined {
    return this.props.tier;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(props: Omit<CreatorProps, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Creator {
    const now = new Date();
    
    return new Creator({
      ...props,
      id: props.id || `creator_${Date.now()}`,
      createdAt: now,
      updatedAt: now
    });
  }

  updateProfile(updates: Partial<Pick<CreatorProps, 'displayName' | 'bio' | 'coverImage' | 'profileImage'>>): void {
    this.props.displayName = updates.displayName ?? this.props.displayName;
    this.props.bio = updates.bio ?? this.props.bio;
    this.props.coverImage = updates.coverImage ?? this.props.coverImage;
    this.props.profileImage = updates.profileImage ?? this.props.profileImage;
    this.props.updatedAt = new Date();
  }

  updatePricing(pricing: CreatorProps['pricing']): void {
    this.props.pricing = pricing;
    this.props.updatedAt = new Date();
  }
}