
export interface Creator {
  id: string;
  username: string;
  avatarUrl: string;
  tagline: string;
  subscriptionPrice: number;
  heroMediaUrl: string;
  content: Content[];
  links: SocialLink[];
}

export interface Content {
  id: string;
  thumbUrl: string;
  title: string;
  views: number;
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  url: string;
}

export interface AdminStats {
  users: number;
  vips: number;
  revenue: number;
  uploads: number;
}
