import { supabase } from '@/integrations/supabase/supabase';

interface InstagramProfile {
  username: string;
  name: string;
  bio: string;
  followers: string;
  following: string;
  posts: string;
  verified: boolean;
  profileImage: string;
  isPrivate: boolean;
  category?: string;
  website?: string;
  recentPosts: InstagramPost[];
}

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: 'photo' | 'video' | 'reel' | 'carousel';
}

interface OCRResult {
  success: boolean;
  data?: InstagramProfile;
  error?: string;
}

class InstagramOCRAutomation {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.VITE_OCR_API_KEY || '';
    this.baseUrl = 'https://api.instagram-scraper.com/v1';
  }

  /**
   * Extract Instagram profile data using OCR and web scraping
   */
  async extractProfileData(instagramUrl: string): Promise<OCRResult> {
    try {
      // Extract username from URL
      const username = this.extractUsername(instagramUrl);
      if (!username) {
        return { success: false, error: 'Invalid Instagram URL' };
      }

      console.log(`🔍 Extracting data for @${username}...`);

      // Step 1: Scrape basic profile info
      const profileData = await this.scrapeProfile(username);
      
      // Step 2: Extract recent posts
      const recentPosts = await this.extractRecentPosts(username);
      
      // Step 3: Analyze engagement metrics
      const metrics = await this.analyzeEngagement(recentPosts);

      // Combine all data
      const profile: InstagramProfile = {
        ...profileData,
        recentPosts,
        ...metrics
      };

      // Step 4: Save to database
      await this.saveProfileData(profile);

      console.log(`✅ Successfully extracted data for @${username}`);
      return { success: true, data: profile };

    } catch (error) {
      console.error('OCR Extraction failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Bulk extract multiple Instagram profiles
   */
  async bulkExtract(instagramUrls: string[]): Promise<{
    successful: InstagramProfile[];
    failed: Array<{ url: string; error: string }>;
  }> {
    const successful: InstagramProfile[] = [];
    const failed: Array<{ url: string; error: string }> = [];

    console.log(`🚀 Starting bulk extraction for ${instagramUrls.length} profiles...`);

    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < instagramUrls.length; i += batchSize) {
      const batch = instagramUrls.slice(i, i + batchSize);
      
      const promises = batch.map(async (url) => {
        const result = await this.extractProfileData(url);
        if (result.success && result.data) {
          successful.push(result.data);
        } else {
          failed.push({ url, error: result.error || 'Unknown error' });
        }
        
        // Add delay between requests to respect rate limits
        await this.delay(2000);
      });

      await Promise.all(promises);
      
      // Progress update
      console.log(`✅ Processed ${Math.min(i + batchSize, instagramUrls.length)}/${instagramUrls.length} profiles`);
    }

    return { successful, failed };
  }

  /**
   * Auto-generate creator page from Instagram data
   */
  async generateCreatorPage(profile: InstagramProfile): Promise<{
    success: boolean;
    pageUrl?: string;
    error?: string;
  }> {
    try {
      // Generate unique page slug
      const slug = profile.username.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Create page configuration
      const pageConfig = {
        username: profile.username,
        displayName: profile.name,
        bio: profile.bio,
        profileImage: profile.profileImage,
        theme: this.selectThemeForCategory(profile.category),
        links: [
          {
            title: 'Follow on Instagram',
            url: `https://instagram.com/${profile.username}`,
            icon: 'instagram',
            isPrimary: true
          },
          ...(profile.website ? [{
            title: 'Website',
            url: profile.website,
            icon: 'globe'
          }] : [])
        ],
        socialProof: {
          followers: profile.followers,
          verified: profile.verified,
          engagement: this.calculateEngagementRate(profile)
        },
        recentContent: profile.recentPosts.slice(0, 4)
      };

      // Save page to database
      const { data, error } = await supabase
        .from('creator_pages')
        .insert({
          username: profile.username,
          slug,
          config: pageConfig,
          status: 'published',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const pageUrl = `https://cabanagrp.com/${slug}`;
      
      console.log(`🎉 Created page for @${profile.username}: ${pageUrl}`);
      
      return { success: true, pageUrl };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Page generation failed' 
      };
    }
  }

  /**
   * Mass creator page generation
   */
  async massGenerate(profiles: InstagramProfile[]): Promise<{
    successful: Array<{ username: string; pageUrl: string }>;
    failed: Array<{ username: string; error: string }>;
  }> {
    const successful: Array<{ username: string; pageUrl: string }> = [];
    const failed: Array<{ username: string; error: string }> = [];

    console.log(`🏭 Mass generating ${profiles.length} creator pages...`);

    for (const profile of profiles) {
      const result = await this.generateCreatorPage(profile);
      
      if (result.success && result.pageUrl) {
        successful.push({ 
          username: profile.username, 
          pageUrl: result.pageUrl 
        });
      } else {
        failed.push({ 
          username: profile.username, 
          error: result.error || 'Unknown error' 
        });
      }

      // Small delay between generations
      await this.delay(500);
    }

    console.log(`✅ Generated ${successful.length} pages, ${failed.length} failed`);
    return { successful, failed };
  }

  // Private helper methods

  private extractUsername(url: string): string | null {
    const match = url.match(/instagram\.com\/([^/?#]+)/);
    return match ? match[1] : null;
  }

  private async scrapeProfile(username: string): Promise<Partial<InstagramProfile>> {
    // Mock implementation - replace with actual scraping logic
    return {
      username,
      name: username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      bio: '✨ Content Creator & Influencer ✨',
      followers: '127K',
      following: '892',
      posts: '1,247',
      verified: Math.random() > 0.7,
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      isPrivate: false,
      category: 'Lifestyle'
    };
  }

  private async extractRecentPosts(username: string): Promise<InstagramPost[]> {
    // Mock implementation - replace with actual post scraping
    return Array.from({ length: 12 }, (_, i) => ({
      id: `${username}_post_${i}`,
      imageUrl: `https://picsum.photos/400/400?random=${i}`,
      caption: `Amazing content from @${username}`,
      likes: Math.floor(Math.random() * 10000) + 1000,
      comments: Math.floor(Math.random() * 200) + 50,
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      type: Math.random() > 0.3 ? 'photo' : 'reel'
    }));
  }

  private async analyzeEngagement(posts: InstagramPost[]): Promise<{
    avgLikes: number;
    avgComments: number;
    engagementRate: string;
  }> {
    const avgLikes = Math.round(posts.reduce((sum, post) => sum + post.likes, 0) / posts.length);
    const avgComments = Math.round(posts.reduce((sum, post) => sum + post.comments, 0) / posts.length);
    const engagementRate = ((avgLikes + avgComments) / 127000 * 100).toFixed(1) + '%';

    return { avgLikes, avgComments, engagementRate };
  }

  private selectThemeForCategory(category?: string): string {
    const themes = {
      'Lifestyle': 'luxury-pink',
      'Fitness': 'energetic-blue',
      'Fashion': 'elegant-purple',
      'Travel': 'wanderlust-green',
      'Food': 'warm-orange',
      'Art': 'creative-rainbow'
    };
    
    return themes[category as keyof typeof themes] || 'luxury-pink';
  }

  private calculateEngagementRate(profile: InstagramProfile): string {
    if (!profile.recentPosts || profile.recentPosts.length === 0) return '0%';
    
    const totalEngagement = profile.recentPosts.reduce(
      (sum, post) => sum + post.likes + post.comments, 0
    );
    const avgEngagement = totalEngagement / profile.recentPosts.length;
    const followersNum = this.parseFollowerCount(profile.followers);
    
    return ((avgEngagement / followersNum) * 100).toFixed(1) + '%';
  }

  private parseFollowerCount(followers: string): number {
    const num = parseFloat(followers.replace(/[^0-9.]/g, ''));
    if (followers.includes('M')) return num * 1000000;
    if (followers.includes('K')) return num * 1000;
    return num;
  }

  private async saveProfileData(profile: InstagramProfile): Promise<void> {
    try {
      await supabase.from('creator_profiles').upsert({
        username: profile.username,
        name: profile.name,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        posts: profile.posts,
        verified: profile.verified,
        profile_image: profile.profileImage,
        is_private: profile.isPrivate,
        category: profile.category,
        website: profile.website,
        recent_posts: profile.recentPosts,
        extracted_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save profile data:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const instagramOCR = new InstagramOCRAutomation();

// Helper functions for easy use
export async function extractInstagramProfile(url: string) {
  return await instagramOCR.extractProfileData(url);
}

export async function bulkExtractProfiles(urls: string[]) {
  return await instagramOCR.bulkExtract(urls);
}

export async function autoGenerateCreatorPage(instagramUrl: string) {
  const extractResult = await instagramOCR.extractProfileData(instagramUrl);
  
  if (!extractResult.success || !extractResult.data) {
    return { success: false, error: extractResult.error };
  }

  return await instagramOCR.generateCreatorPage(extractResult.data);
}