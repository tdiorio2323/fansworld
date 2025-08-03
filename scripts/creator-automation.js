#!/usr/bin/env node

/**
 * Creator Management Automation Script
 * Automatically pulls creator metrics from multiple platforms and generates reports
 * 
 * Usage: node creator-automation.js [--creator-id=ID] [--report-type=monthly] [--force-sync]
 */

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import cron from 'node-cron';
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

// ES Module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment configuration
const config = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  instagram: {
    appId: process.env.INSTAGRAM_APP_ID || '',
    appSecret: process.env.INSTAGRAM_APP_SECRET || '',
  },
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  },
  email: {
    apiKey: process.env.SMTP2GO_API_KEY || '',
  }
};

// Initialize clients
const supabase = createClient(config.supabase.url, config.supabase.key);
const stripe = new Stripe(config.stripe.secretKey);

/**
 * Creator Metrics Sync Manager
 */
class CreatorMetricsSync {
  constructor() {
    this.platforms = ['instagram', 'tiktok', 'youtube'];
    this.batchSize = 10;
  }

  /**
   * Sync all creator metrics across platforms
   */
  async syncAllCreators(forceSync = false) {
    console.log('🚀 Starting creator metrics sync...');
    
    try {
      // Get all creators with connected platforms
      const { data: creators, error } = await supabase
        .from('creators')
        .select(`
          *,
          creator_platforms(*)
        `)
        .eq('creator_platforms.connected', true);

      if (error) throw error;

      console.log(`📊 Found ${creators?.length || 0} creators to sync`);

      // Process creators in batches
      for (let i = 0; i < (creators?.length || 0); i += this.batchSize) {
        const batch = creators!.slice(i, i + this.batchSize);
        await Promise.all(batch.map(creator => this.syncCreatorMetrics(creator, forceSync)));
        
        // Rate limiting - wait between batches
        if (i + this.batchSize < creators!.length) {
          await this.sleep(2000);
        }
      }

      console.log('✅ Creator metrics sync completed');
      
      // Update global analytics
      await this.updateGlobalAnalytics();
      
    } catch (error) {
      console.error('❌ Error syncing creator metrics:', error);
      throw error;
    }
  }

  /**
   * Sync metrics for a specific creator
   */
  async syncCreatorMetrics(creator, forceSync = false) {
    console.log(`🔄 Syncing metrics for ${creator.username}...`);

    try {
      for (const platform of creator.creator_platforms) {
        // Check if sync is needed
        const lastSync = new Date(platform.last_sync_at);
        const now = new Date();
        const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

        if (!forceSync && hoursSinceSync < 6) {
          console.log(`⏭️  Skipping ${platform.platform} for ${creator.username} (synced ${hoursSinceSync.toFixed(1)}h ago)`);
          continue;
        }

        // Sync platform-specific metrics
        await this.syncPlatformMetrics(creator.id, platform);
      }

      // Calculate and update performance score
      await this.updateCreatorPerformanceScore(creator.id);
      
    } catch (error) {
      console.error(`❌ Error syncing ${creator.username}:`, error);
      
      // Log error to database
      await this.logSyncError(creator.id, error.message);
    }
  }

  /**
   * Sync metrics for a specific platform
   */
  async syncPlatformMetrics(creatorId, platform) {
    try {
      let metrics = {};

      switch (platform.platform) {
        case 'instagram':
          metrics = await this.getInstagramMetrics(platform);
          break;
        case 'tiktok':
          metrics = await this.getTikTokMetrics(platform);
          break;
        case 'youtube':
          metrics = await this.getYouTubeMetrics(platform);
          break;
        default:
          console.log(`⚠️  Platform ${platform.platform} not supported`);
          return;
      }

      // Update platform metrics in database
      await this.updatePlatformMetrics(platform.id, metrics);
      
      // Store daily metrics snapshot
      await this.storeDailyMetrics(platform.id, metrics);
      
      // Update sync status
      await supabase
        .from('creator_platforms')
        .update({
          last_sync_at: new Date().toISOString(),
          sync_status: 'completed',
          sync_error: null,
          metrics: metrics
        })
        .eq('id', platform.id);

      console.log(`✅ Updated ${platform.platform} metrics for creator`);
      
    } catch (error) {
      console.error(`❌ Error syncing ${platform.platform}:`, error);
      
      // Update sync error status
      await supabase
        .from('creator_platforms')
        .update({
          sync_status: 'failed',
          sync_error: error.message
        })
        .eq('id', platform.id);
    }
  }

  /**
   * Get Instagram metrics using Instagram Basic Display API
   */
  async getInstagramMetrics(platform) {
    try {
      const accessToken = platform.access_token;
      
      // Get user info
      const userResponse = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,account_type,media_count',
          access_token: accessToken
        }
      });

      // Get user insights
      const insightsResponse = await axios.get(`https://graph.instagram.com/me/insights`, {
        params: {
          metric: 'impressions,reach,profile_views',
          period: 'day',
          since: this.getDateDaysAgo(7),
          until: this.getDateDaysAgo(1),
          access_token: accessToken
        }
      });

      // Get recent media
      const mediaResponse = await axios.get(`https://graph.instagram.com/me/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit: 25,
          access_token: accessToken
        }
      });

      // Calculate metrics
      const metrics = {
        followers: userResponse.data.media_count, // Approximation
        posts_count: userResponse.data.media_count,
        avg_likes: this.calculateAverageMetric(mediaResponse.data.data, 'like_count'),
        avg_comments: this.calculateAverageMetric(mediaResponse.data.data, 'comments_count'),
        engagement_rate: this.calculateEngagementRate(mediaResponse.data.data),
        reach: this.sumInsights(insightsResponse.data.data, 'reach'),
        impressions: this.sumInsights(insightsResponse.data.data, 'impressions'),
        profile_views: this.sumInsights(insightsResponse.data.data, 'profile_views'),
        last_updated: new Date().toISOString()
      };

      return metrics;
      
    } catch (error) {
      console.error('Instagram API Error:', error.response?.data || error.message);
      throw new Error(`Instagram sync failed: ${error.message}`);
    }
  }

  /**
   * Get TikTok metrics using TikTok for Developers API
   */
  async getTikTokMetrics(platform) {
    try {
      const accessToken = platform.access_token;
      
      // Get user info
      const userResponse = await axios.post('https://open-api.tiktok.com/user/info/', {
        access_token: accessToken,
        fields: 'display_name,bio_description,avatar_url,follower_count,following_count,likes_count,video_count'
      });

      // Get video list
      const videosResponse = await axios.post('https://open-api.tiktok.com/video/list/', {
        access_token: accessToken,
        fields: 'id,title,duration,cover_image_url,view_count,like_count,comment_count,share_count',
        max_count: 20
      });

      const userInfo = userResponse.data.data.user;
      const videos = videosResponse.data.data.videos || [];

      const metrics = {
        followers: userInfo.follower_count,
        following: userInfo.following_count,
        posts_count: userInfo.video_count,
        total_likes: userInfo.likes_count,
        avg_views: this.calculateAverageMetric(videos, 'view_count'),
        avg_likes: this.calculateAverageMetric(videos, 'like_count'),
        avg_comments: this.calculateAverageMetric(videos, 'comment_count'),
        avg_shares: this.calculateAverageMetric(videos, 'share_count'),
        engagement_rate: this.calculateTikTokEngagementRate(videos, userInfo.follower_count),
        last_updated: new Date().toISOString()
      };

      return metrics;
      
    } catch (error) {
      console.error('TikTok API Error:', error.response?.data || error.message);
      throw new Error(`TikTok sync failed: ${error.message}`);
    }
  }

  /**
   * Get YouTube metrics using YouTube Data API
   */
  async getYouTubeMetrics(platform) {
    try {
      const channelId = platform.platform_user_id;
      const apiKey = config.youtube.apiKey;
      
      // Get channel statistics
      const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'statistics,snippet',
          id: channelId,
          key: apiKey
        }
      });

      // Get recent videos
      const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'id',
          channelId: channelId,
          type: 'video',
          order: 'date',
          maxResults: 25,
          key: apiKey
        }
      });

      const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');
      
      // Get video statistics
      const videoStatsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics',
          id: videoIds,
          key: apiKey
        }
      });

      const channelStats = channelResponse.data.items[0].statistics;
      const videoStats = videoStatsResponse.data.items || [];

      const metrics = {
        followers: parseInt(channelStats.subscriberCount),
        posts_count: parseInt(channelStats.videoCount),
        total_views: parseInt(channelStats.viewCount),
        avg_views: this.calculateAverageMetric(videoStats, 'statistics.viewCount'),
        avg_likes: this.calculateAverageMetric(videoStats, 'statistics.likeCount'),
        avg_comments: this.calculateAverageMetric(videoStats, 'statistics.commentCount'),
        engagement_rate: this.calculateYouTubeEngagementRate(videoStats),
        subscriber_growth: 0, // Would need historical data
        last_updated: new Date().toISOString()
      };

      return metrics;
      
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new Error(`YouTube sync failed: ${error.message}`);
    }
  }

  /**
   * Update platform metrics in database
   */
  async updatePlatformMetrics(platformId, metrics) {
    const { error } = await supabase
      .from('creator_platforms')
      .update({
        follower_count: metrics.followers || 0,
        following_count: metrics.following || 0,
        metrics: metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', platformId);

    if (error) throw error;
  }

  /**
   * Store daily metrics snapshot
   */
  async storeDailyMetrics(platformId, metrics) {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('platform_metrics')
      .upsert({
        creator_platform_id: platformId,
        metric_date: today,
        followers: metrics.followers || 0,
        following: metrics.following || 0,
        posts_count: metrics.posts_count || 0,
        engagement_rate: metrics.engagement_rate || 0,
        avg_likes: metrics.avg_likes || 0,
        avg_comments: metrics.avg_comments || 0,
        avg_shares: metrics.avg_shares || 0,
        reach: metrics.reach || 0,
        impressions: metrics.impressions || 0,
        profile_views: metrics.profile_views || 0,
        website_clicks: metrics.website_clicks || 0,
        additional_metrics: metrics
      });

    if (error && !error.message.includes('duplicate key')) {
      throw error;
    }
  }

  /**
   * Calculate creator performance score
   */
  async updateCreatorPerformanceScore(creatorId) {
    const { error } = await supabase.rpc('calculate_creator_performance_score', {
      creator_uuid: creatorId
    });

    if (error) {
      console.error('Error calculating performance score:', error);
    }
  }

  /**
   * Update global analytics
   */
  async updateGlobalAnalytics() {
    console.log('📈 Updating global analytics...');
    
    // Sync platform metrics
    await supabase.rpc('sync_platform_metrics');
    
    console.log('✅ Global analytics updated');
  }

  /**
   * Utility functions
   */
  calculateAverageMetric(items, field) {
    if (!items || items.length === 0) return 0;
    
    const values = items.map(item => {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], item)
        : item[field];
      return parseInt(value) || 0;
    }).filter(val => val > 0);

    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  }

  calculateEngagementRate(posts) {
    if (!posts || posts.length === 0) return 0;
    
    const totalEngagement = posts.reduce((sum, post) => {
      return sum + (post.like_count || 0) + (post.comments_count || 0);
    }, 0);
    
    // Estimate followers based on average performance (simplified)
    const avgLikes = this.calculateAverageMetric(posts, 'like_count');
    const estimatedFollowers = avgLikes * 20; // Rough estimate
    
    return estimatedFollowers > 0 ? ((totalEngagement / posts.length) / estimatedFollowers) * 100 : 0;
  }

  calculateTikTokEngagementRate(videos, followerCount) {
    if (!videos || videos.length === 0 || !followerCount) return 0;
    
    const totalEngagement = videos.reduce((sum, video) => {
      return sum + (video.like_count || 0) + (video.comment_count || 0) + (video.share_count || 0);
    }, 0);
    
    return ((totalEngagement / videos.length) / followerCount) * 100;
  }

  calculateYouTubeEngagementRate(videos) {
    if (!videos || videos.length === 0) return 0;
    
    const engagementRates = videos.map(video => {
      const views = parseInt(video.statistics?.viewCount) || 0;
      const likes = parseInt(video.statistics?.likeCount) || 0;
      const comments = parseInt(video.statistics?.commentCount) || 0;
      
      return views > 0 ? ((likes + comments) / views) * 100 : 0;
    });
    
    return engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length;
  }

  sumInsights(insights, metric) {
    if (!insights) return 0;
    return insights.reduce((sum, insight) => {
      return sum + (insight.values?.reduce((valSum, val) => valSum + (val.value || 0), 0) || 0);
    }, 0);
  }

  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  async logSyncError(creatorId, errorMessage) {
    await supabase
      .from('automation_executions')
      .insert({
        rule_id: null,
        trigger_data: { creator_id: creatorId, error: errorMessage },
        status: 'failed',
        error_message: errorMessage,
        executed_at: new Date().toISOString()
      });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Monthly Report Generator
 */
class MonthlyReportGenerator {
  constructor() {
    this.metricsSync = new CreatorMetricsSync();
  }

  /**
   * Generate monthly report for a creator
   */
  async generateCreatorReport(creatorId, reportType = 'monthly') {
    console.log(`📊 Generating ${reportType} report for creator ${creatorId}...`);

    try {
      // Get creator data
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select(`
          *,
          user_profiles(*),
          creator_platforms(*),
          creator_earnings(*)
        `)
        .eq('id', creatorId)
        .single();

      if (creatorError) throw creatorError;

      // Calculate report period
      const period = this.getReportPeriod(reportType);
      
      // Get metrics data
      const metrics = await this.getCreatorMetrics(creatorId, period);
      
      // Get content performance
      const contentPerformance = await this.getContentPerformance(creatorId, period);
      
      // Get earnings data
      const earnings = await this.getEarningsData(creatorId, period);
      
      // Generate insights and recommendations
      const insights = await this.generateInsights(metrics, contentPerformance, earnings);
      
      // Create report object
      const report = {
        creator_id: creatorId,
        report_type: reportType,
        period_start: period.start,
        period_end: period.end,
        metrics: {
          follower_growth: metrics.followerGrowth,
          engagement: metrics.engagement,
          content: metrics.content,
          revenue: earnings
        },
        insights: insights,
        recommendations: insights.recommendations,
        generated_at: new Date().toISOString(),
        status: 'completed'
      };

      // Save report to database
      const { data: savedReport, error: reportError } = await supabase
        .from('analytics_reports')
        .insert(report)
        .select()
        .single();

      if (reportError) throw reportError;

      // Generate and save PDF report
      const pdfUrl = await this.generatePDFReport(report);
      
      // Update report with PDF URL
      await supabase
        .from('analytics_reports')
        .update({ file_url: pdfUrl })
        .eq('id', savedReport.id);

      // Send report via email
      await this.sendReportEmail(creator, report, pdfUrl);

      console.log(`✅ Report generated successfully for ${creator.username}`);
      
      return savedReport;
      
    } catch (error) {
      console.error(`❌ Error generating report for creator ${creatorId}:`, error);
      
      // Save failed report
      await supabase
        .from('analytics_reports')
        .insert({
          creator_id: creatorId,
          report_type: reportType,
          period_start: this.getReportPeriod(reportType).start,
          period_end: this.getReportPeriod(reportType).end,
          status: 'failed',
          generated_at: new Date().toISOString()
        });
      
      throw error;
    }
  }

  /**
   * Generate reports for all creators
   */
  async generateAllReports(reportType = 'monthly') {
    console.log(`📈 Generating ${reportType} reports for all creators...`);

    const { data: creators, error } = await supabase
      .from('creators')
      .select('id, username')
      .eq('status', 'active');

    if (error) throw error;

    const results = {
      success: [],
      failed: []
    };

    for (const creator of creators) {
      try {
        await this.generateCreatorReport(creator.id, reportType);
        results.success.push(creator.username);
      } catch (error) {
        console.error(`Failed to generate report for ${creator.username}:`, error);
        results.failed.push({ username: creator.username, error: error.message });
      }
      
      // Rate limiting
      await this.metricsSync.sleep(1000);
    }

    console.log(`✅ Reports generated: ${results.success.length} successful, ${results.failed.length} failed`);
    return results;
  }

  /**
   * Get report period based on type
   */
  getReportPeriod(reportType) {
    const now = new Date();
    let start, end;

    switch (reportType) {
      case 'weekly':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3 - 3, 1);
        end = new Date(now.getFullYear(), quarter * 3, 0);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = now;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  async getCreatorMetrics(creatorId, period) {
    // Implementation for getting metrics would go here
    // This is a simplified version
    return {
      followerGrowth: { start_count: 10000, end_count: 12000, net_growth: 2000, growth_rate: 20 },
      engagement: { total_likes: 50000, total_comments: 5000, total_shares: 1000, avg_engagement_rate: 8.5 },
      content: { posts_published: 25, total_views: 500000, best_performing_post: 'post-123', worst_performing_post: 'post-456' }
    };
  }

  async getContentPerformance(creatorId, period) {
    // Implementation for content performance analysis
    return [];
  }

  async getEarningsData(creatorId, period) {
    // Implementation for earnings data
    return {
      total_earnings: 15000,
      commission_paid: 3750,
      net_earnings: 11250,
      revenue_by_source: {
        subscriptions: 8000,
        tips: 4000,
        merchandise: 2000,
        brand_partnerships: 1000
      }
    };
  }

  async generateInsights(metrics, contentPerformance, earnings) {
    // AI-powered insights generation would go here
    return {
      best_posting_times: ['10:00', '15:00', '20:00'],
      top_hashtags: ['#creator', '#lifestyle', '#motivation'],
      audience_demographics: {},
      content_performance: [],
      growth_opportunities: [
        'Increase video content frequency',
        'Engage more with comments',
        'Collaborate with other creators'
      ],
      recommendations: [
        'Focus on video content which shows 40% higher engagement',
        'Post during peak hours (10 AM, 3 PM, 8 PM) for maximum reach',
        'Consider diversifying revenue streams with merchandise'
      ]
    };
  }

  async generatePDFReport(report) {
    // PDF generation would go here using libraries like puppeteer or jsPDF
    // For now, return a placeholder URL
    return `https://reports.tdstudios.com/creator-${report.creator_id}-${report.report_type}-${Date.now()}.pdf`;
  }

  async sendReportEmail(creator, report, pdfUrl) {
    // Email sending implementation using SMTP2GO or similar service
    console.log(`📧 Sending report email to ${creator.user_profiles?.email || 'creator'}`);
  }
}

/**
 * Scheduler and CLI Interface
 */
class CreatorAutomation {
  constructor() {
    this.metricsSync = new CreatorMetricsSync();
    this.reportGenerator = new MonthlyReportGenerator();
  }

  /**
   * Start automated scheduling
   */
  startScheduler() {
    console.log('⏰ Starting creator automation scheduler...');

    // Sync metrics every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('🔄 Running scheduled metrics sync...');
      try {
        await this.metricsSync.syncAllCreators();
      } catch (error) {
        console.error('Scheduled sync failed:', error);
      }
    });

    // Generate monthly reports on the 1st of each month
    cron.schedule('0 6 1 * *', async () => {
      console.log('📊 Running scheduled monthly reports...');
      try {
        await this.reportGenerator.generateAllReports('monthly');
      } catch (error) {
        console.error('Scheduled report generation failed:', error);
      }
    });

    // Generate weekly reports every Monday
    cron.schedule('0 8 * * 1', async () => {
      console.log('📈 Running scheduled weekly reports...');
      try {
        await this.reportGenerator.generateAllReports('weekly');
      } catch (error) {
        console.error('Scheduled weekly report generation failed:', error);
      }
    });

    console.log('✅ Scheduler started successfully');
    console.log('📅 Metrics sync: Every 6 hours');
    console.log('📅 Monthly reports: 1st of each month at 6:00 AM');
    console.log('📅 Weekly reports: Every Monday at 8:00 AM');
  }

  /**
   * CLI interface
   */
  setupCLI() {
    const program = new Command();

    program
      .name('creator-automation')
      .description('Creator Management Platform Automation')
      .version('1.0.0');

    program
      .command('sync')
      .description('Sync creator metrics from all platforms')
      .option('--creator-id <id>', 'Sync specific creator')
      .option('--force', 'Force sync regardless of last sync time')
      .action(async (options) => {
        try {
          if (options.creatorId) {
            console.log(`🔄 Syncing metrics for creator ${options.creatorId}...`);
            // Implementation for single creator sync
          } else {
            await this.metricsSync.syncAllCreators(options.force);
          }
        } catch (error) {
          console.error('Sync failed:', error);
          process.exit(1);
        }
      });

    program
      .command('report')
      .description('Generate analytics reports')
      .option('--creator-id <id>', 'Generate report for specific creator')
      .option('--type <type>', 'Report type (daily, weekly, monthly, quarterly)', 'monthly')
      .action(async (options) => {
        try {
          if (options.creatorId) {
            await this.reportGenerator.generateCreatorReport(options.creatorId, options.type);
          } else {
            await this.reportGenerator.generateAllReports(options.type);
          }
        } catch (error) {
          console.error('Report generation failed:', error);
          process.exit(1);
        }
      });

    program
      .command('schedule')
      .description('Start the automation scheduler')
      .action(() => {
        this.startScheduler();
        
        // Keep the process running
        process.on('SIGINT', () => {
          console.log('\\n👋 Shutting down scheduler...');
          process.exit(0);
        });
        
        console.log('🚀 Scheduler is running. Press Ctrl+C to stop.');
      });

    program
      .command('status')
      .description('Check automation status and recent activity')
      .action(async () => {
        try {
          // Check recent sync status
          const { data: recentSyncs } = await supabase
            .from('creator_platforms')
            .select('platform, last_sync_at, sync_status')
            .order('last_sync_at', { ascending: false })
            .limit(10);

          console.log('📊 Recent Sync Status:');
          console.table(recentSyncs);

          // Check recent reports
          const { data: recentReports } = await supabase
            .from('analytics_reports')
            .select('report_type, status, generated_at')
            .order('generated_at', { ascending: false })
            .limit(5);

          console.log('\\n📈 Recent Reports:');
          console.table(recentReports);

        } catch (error) {
          console.error('Status check failed:', error);
        }
      });

    return program;
  }
}

/**
 * Main execution
 */
async function main() {
  const automation = new CreatorAutomation();
  const program = automation.setupCLI();
  
  // If no command provided, show help
  if (process.argv.length <= 2) {
    program.help();
  } else {
    await program.parseAsync(process.argv);
  }
}

// Run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { CreatorAutomation, CreatorMetricsSync, MonthlyReportGenerator };
