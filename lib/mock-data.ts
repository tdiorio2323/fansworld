
import { Creator, AdminStats } from './types';

export const mockCreator: Creator = {
  id: 'cl-01',
  username: 'aurora',
  avatarUrl: '/avatar.png',
  tagline: 'Digital artist & sound designer.',
  subscriptionPrice: 10,
  heroMediaUrl: '/hero-preview.jpg',
  content: [
    { id: 'c-01', thumbUrl: '/hero-preview.jpg', title: 'Project Genesis - BTS', views: 1024 },
    { id: 'c-02', thumbUrl: '/hero-preview.jpg', title: 'Soundscapes Vol. III', views: 4096 },
    { id: 'c-03', thumbUrl: '/hero-preview.jpg', title: 'Exclusive Wallpapers', views: 2048 },
  ],
  links: [
    { platform: 'instagram', url: '#' },
    { platform: 'tiktok', url: '#' },
    { platform: 'youtube', url: '#' },
  ],
};

export const mockAdminStats: AdminStats = {
  users: 1342,
  vips: 157,
  revenue: 2355,
  uploads: 428,
};
