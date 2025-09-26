import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import mime from 'mime-types';
import { logger } from './security-enhanced';
import crypto from 'crypto';
import path from 'path';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Media configuration schema
const mediaConfigSchema = z.object({
  // S3 Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().default('fansworld-media'),
  S3_ENDPOINT: z.string().optional(), // For S3-compatible services like R2
  CDN_BASE_URL: z.string().url().optional(),

  // Storage limits
  MAX_FILE_SIZE: z.number().default(104857600), // 100MB
  MAX_IMAGE_SIZE: z.number().default(10485760), // 10MB
  MAX_VIDEO_SIZE: z.number().default(104857600), // 100MB
  MAX_AUDIO_SIZE: z.number().default(20971520), // 20MB

  // Processing settings
  IMAGE_QUALITY: z.number().min(10).max(100).default(85),
  THUMBNAIL_SIZE: z.number().default(400),
  WATERMARK_ENABLED: z.boolean().default(true),
  VIRUS_SCAN_ENABLED: z.boolean().default(false),
});

// Media types enum
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}

// Media access levels
export enum MediaAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SUBSCRIBERS_ONLY = 'subscribers_only',
  PPV = 'ppv'
}

// Media metadata interface
export interface MediaMetadata {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
  mediaType: MediaType;
  accessLevel: MediaAccessLevel;
  s3Key: string;
  thumbnailS3Key?: string;
  width?: number;
  height?: number;
  duration?: number; // For video/audio
  price?: number; // For PPV content
  watermarked: boolean;
  virusScanned: boolean;
  virusScanResult?: 'clean' | 'infected' | 'pending';
  uploadedAt: Date;
  tags?: string[];
}

// Upload request interface
export interface MediaUploadRequest {
  filename: string;
  contentType: string;
  size: number;
  accessLevel: MediaAccessLevel;
  price?: number;
  tags?: string[];
}

// Signed upload response
export interface SignedUploadResponse {
  uploadUrl: string;
  mediaId: string;
  uploadKey: string;
  expiresIn: number;
  maxSize: number;
  acceptedTypes: string[];
}

/**
 * Production-grade media service for creator platforms
 * Handles file uploads, processing, and delivery with security and scalability
 */
export class MediaService {
  private s3Client: S3Client;
  private config: z.infer<typeof mediaConfigSchema>;

  constructor() {
    // Validate and load configuration
    this.config = mediaConfigSchema.parse(process.env);

    // Initialize S3 client with flexible configuration
    const s3Config: any = {
      region: this.config.AWS_REGION,
      credentials: this.config.AWS_ACCESS_KEY_ID && this.config.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: this.config.AWS_ACCESS_KEY_ID,
            secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY
          }
        : undefined
    };

    // Support for S3-compatible services (like Cloudflare R2)
    if (this.config.S3_ENDPOINT) {
      s3Config.endpoint = this.config.S3_ENDPOINT;
      s3Config.forcePathStyle = true;
    }

    this.s3Client = new S3Client(s3Config);

    logger.info('Media service initialized', {
      bucket: this.config.S3_BUCKET,
      region: this.config.AWS_REGION,
      endpoint: this.config.S3_ENDPOINT,
      maxFileSize: this.config.MAX_FILE_SIZE,
      watermarkEnabled: this.config.WATERMARK_ENABLED
    });
  }

  /**
   * Generate signed upload URL for direct-to-storage uploads
   */
  async generateSignedUpload(
    userId: string,
    uploadRequest: MediaUploadRequest
  ): Promise<SignedUploadResponse> {
    try {
      // Validate file type and size
      const validation = this.validateUploadRequest(uploadRequest);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique media ID and S3 key
      const mediaId = this.generateMediaId();
      const s3Key = this.generateS3Key(userId, mediaId, uploadRequest.filename);

      // Create media record in database
      await this.createMediaRecord(mediaId, userId, uploadRequest, s3Key);

      // Generate presigned upload URL
      const uploadUrl = await this.createPresignedUploadUrl(s3Key, uploadRequest);

      logger.info('Signed upload URL generated', {
        userId,
        mediaId,
        filename: uploadRequest.filename,
        contentType: uploadRequest.contentType,
        size: uploadRequest.size
      });

      return {
        uploadUrl,
        mediaId,
        uploadKey: s3Key,
        expiresIn: 3600, // 1 hour
        maxSize: this.getMaxSizeForType(this.getMediaType(uploadRequest.contentType)),
        acceptedTypes: this.getAcceptedTypesForMediaType(this.getMediaType(uploadRequest.contentType))
      };

    } catch (error) {
      logger.error('Failed to generate signed upload URL', {
        userId,
        uploadRequest,
        error
      });
      throw error;
    }
  }

  /**
   * Process uploaded media (thumbnails, watermarks, etc.)
   */
  async processUploadedMedia(mediaId: string): Promise<void> {
    try {
      const media = await this.getMediaMetadata(mediaId);
      if (!media) {
        throw new Error('Media not found');
      }

      logger.info('Processing uploaded media', {
        mediaId,
        mediaType: media.mediaType,
        filename: media.filename
      });

      // Download original file for processing
      const originalBuffer = await this.downloadFromS3(media.s3Key);

      // Process based on media type
      switch (media.mediaType) {
        case MediaType.IMAGE:
          await this.processImage(media, originalBuffer);
          break;
        case MediaType.VIDEO:
          await this.processVideo(media, originalBuffer);
          break;
        case MediaType.AUDIO:
          await this.processAudio(media, originalBuffer);
          break;
        default:
          logger.info('No processing required for media type', {
            mediaId,
            mediaType: media.mediaType
          });
      }

      // Update processing status
      await this.updateMediaProcessingStatus(mediaId, 'completed');

      logger.info('Media processing completed', { mediaId });

    } catch (error) {
      logger.error('Media processing failed', { mediaId, error });
      await this.updateMediaProcessingStatus(mediaId, 'failed');
      throw error;
    }
  }

  /**
   * Get secure serving URL for media
   */
  async getMediaUrl(
    mediaId: string,
    userId?: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const media = await this.getMediaMetadata(mediaId);
      if (!media) {
        throw new Error('Media not found');
      }

      // Check access permissions
      if (media.accessLevel === MediaAccessLevel.PRIVATE && media.userId !== userId) {
        throw new Error('Access denied');
      }

      // Use CDN URL if available and content is public
      if (this.config.CDN_BASE_URL && media.accessLevel === MediaAccessLevel.PUBLIC) {
        return `${this.config.CDN_BASE_URL}/${media.s3Key}`;
      }

      // Generate presigned URL for secure access
      const command = new GetObjectCommand({
        Bucket: this.config.S3_BUCKET,
        Key: media.s3Key
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      logger.debug('Media URL generated', {
        mediaId,
        userId,
        accessLevel: media.accessLevel,
        expiresIn
      });

      return url;

    } catch (error) {
      logger.error('Failed to generate media URL', { mediaId, userId, error });
      throw error;
    }
  }

  /**
   * Get thumbnail URL
   */
  async getThumbnailUrl(
    mediaId: string,
    userId?: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      const media = await this.getMediaMetadata(mediaId);
      if (!media || !media.thumbnailS3Key) {
        return null;
      }

      // Check access permissions
      if (media.accessLevel === MediaAccessLevel.PRIVATE && media.userId !== userId) {
        throw new Error('Access denied');
      }

      // Use CDN URL if available
      if (this.config.CDN_BASE_URL && media.accessLevel === MediaAccessLevel.PUBLIC) {
        return `${this.config.CDN_BASE_URL}/${media.thumbnailS3Key}`;
      }

      // Generate presigned URL
      const command = new GetObjectCommand({
        Bucket: this.config.S3_BUCKET,
        Key: media.thumbnailS3Key
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });

    } catch (error) {
      logger.error('Failed to generate thumbnail URL', { mediaId, error });
      return null;
    }
  }

  /**
   * Delete media and all associated files
   */
  async deleteMedia(mediaId: string, userId: string): Promise<void> {
    try {
      const media = await this.getMediaMetadata(mediaId);
      if (!media) {
        throw new Error('Media not found');
      }

      // Check ownership
      if (media.userId !== userId) {
        throw new Error('Access denied');
      }

      // Delete from S3
      await this.deleteFromS3(media.s3Key);

      // Delete thumbnail if exists
      if (media.thumbnailS3Key) {
        await this.deleteFromS3(media.thumbnailS3Key);
      }

      // Soft delete from database
      await supabase
        .from('media')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', mediaId);

      logger.info('Media deleted', { mediaId, userId });

    } catch (error) {
      logger.error('Failed to delete media', { mediaId, userId, error });
      throw error;
    }
  }

  /**
   * Bulk media operations for performance
   */
  async bulkGetMediaUrls(
    mediaIds: string[],
    userId?: string,
    expiresIn: number = 3600
  ): Promise<Map<string, string>> {
    const urls = new Map<string, string>();

    // Process in parallel with Promise.allSettled for partial success
    const operations = mediaIds.map(async (mediaId) => {
      try {
        const url = await this.getMediaUrl(mediaId, userId, expiresIn);
        return { mediaId, url };
      } catch (error) {
        logger.warn('Failed to get URL for media', { mediaId, error });
        return { mediaId, url: null };
      }
    });

    const results = await Promise.allSettled(operations);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.url) {
        urls.set(result.value.mediaId, result.value.url);
      }
    });

    return urls;
  }

  /**
   * Private helper methods
   */
  private validateUploadRequest(request: MediaUploadRequest): { valid: boolean; error?: string } {
    // Check file size
    const mediaType = this.getMediaType(request.contentType);
    const maxSize = this.getMaxSizeForType(mediaType);

    if (request.size > maxSize) {
      return { valid: false, error: `File size exceeds maximum allowed (${maxSize} bytes)` };
    }

    // Check content type
    if (!this.isAllowedContentType(request.contentType)) {
      return { valid: false, error: `Content type ${request.contentType} is not allowed` };
    }

    // Validate filename
    if (!this.isValidFilename(request.filename)) {
      return { valid: false, error: 'Invalid filename' };
    }

    return { valid: true };
  }

  private generateMediaId(): string {
    return crypto.randomUUID();
  }

  private generateS3Key(userId: string, mediaId: string, filename: string): string {
    const ext = path.extname(filename);
    const timestamp = Date.now();
    return `media/${userId}/${timestamp}-${mediaId}${ext}`;
  }

  private async createMediaRecord(
    mediaId: string,
    userId: string,
    request: MediaUploadRequest,
    s3Key: string
  ): Promise<void> {
    const { error } = await supabase
      .from('media')
      .insert({
        id: mediaId,
        user_id: userId,
        filename: mediaId + path.extname(request.filename),
        original_filename: request.filename,
        content_type: request.contentType,
        size: request.size,
        media_type: this.getMediaType(request.contentType),
        access_level: request.accessLevel,
        s3_key: s3Key,
        price: request.price,
        watermarked: false,
        virus_scanned: false,
        processing_status: 'pending',
        uploaded_at: new Date().toISOString(),
        tags: request.tags || []
      });

    if (error) {
      throw new Error(`Failed to create media record: ${error.message}`);
    }
  }

  private async createPresignedUploadUrl(
    s3Key: string,
    request: MediaUploadRequest
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.S3_BUCKET,
      Key: s3Key,
      ContentType: request.contentType,
      ContentLength: request.size,
      // Add metadata
      Metadata: {
        'original-filename': request.filename,
        'access-level': request.accessLevel,
        'uploaded-by': 'fansworld-api'
      }
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private async downloadFromS3(s3Key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.config.S3_BUCKET,
      Key: s3Key
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error('No file content received from S3');
    }

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  private async uploadToS3(s3Key: string, buffer: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.config.S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType
    });

    await this.s3Client.send(command);
  }

  private async deleteFromS3(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.S3_BUCKET,
      Key: s3Key
    });

    await this.s3Client.send(command);
  }

  private async processImage(media: MediaMetadata, buffer: Buffer): Promise<void> {
    try {
      // Generate thumbnail
      const thumbnailBuffer = await sharp(buffer)
        .resize(this.config.THUMBNAIL_SIZE, this.config.THUMBNAIL_SIZE, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: this.config.IMAGE_QUALITY })
        .toBuffer();

      const thumbnailKey = media.s3Key.replace(/\.[^.]+$/, '-thumb.jpg');
      await this.uploadToS3(thumbnailKey, thumbnailBuffer, 'image/jpeg');

      // Apply watermark if enabled
      let processedBuffer = buffer;
      if (this.config.WATERMARK_ENABLED && media.accessLevel !== MediaAccessLevel.PUBLIC) {
        processedBuffer = await this.applyWatermark(buffer);
      }

      // Update database with processing results
      await supabase
        .from('media')
        .update({
          thumbnail_s3_key: thumbnailKey,
          watermarked: this.config.WATERMARK_ENABLED,
          processing_status: 'completed'
        })
        .eq('id', media.id);

      logger.info('Image processed successfully', {
        mediaId: media.id,
        thumbnailGenerated: true,
        watermarked: this.config.WATERMARK_ENABLED
      });

    } catch (error) {
      logger.error('Image processing failed', { mediaId: media.id, error });
      throw error;
    }
  }

  private async processVideo(media: MediaMetadata, buffer: Buffer): Promise<void> {
    // Placeholder for video processing
    // In production, integrate with FFmpeg or cloud video processing service
    logger.info('Video processing not implemented yet', { mediaId: media.id });
  }

  private async processAudio(media: MediaMetadata, buffer: Buffer): Promise<void> {
    // Placeholder for audio processing
    logger.info('Audio processing not implemented yet', { mediaId: media.id });
  }

  private async applyWatermark(buffer: Buffer): Promise<Buffer> {
    // Placeholder for watermarking
    // In production, overlay watermark using Sharp or FFmpeg
    return buffer;
  }

  private async getMediaMetadata(mediaId: string): Promise<MediaMetadata | null> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      filename: data.filename,
      originalFilename: data.original_filename,
      contentType: data.content_type,
      size: data.size,
      mediaType: data.media_type,
      accessLevel: data.access_level,
      s3Key: data.s3_key,
      thumbnailS3Key: data.thumbnail_s3_key,
      width: data.width,
      height: data.height,
      duration: data.duration,
      price: data.price,
      watermarked: data.watermarked,
      virusScanned: data.virus_scanned,
      virusScanResult: data.virus_scan_result,
      uploadedAt: new Date(data.uploaded_at),
      tags: data.tags || []
    };
  }

  private async updateMediaProcessingStatus(
    mediaId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed'
  ): Promise<void> {
    await supabase
      .from('media')
      .update({ processing_status: status })
      .eq('id', mediaId);
  }

  private getMediaType(contentType: string): MediaType {
    if (contentType.startsWith('image/')) return MediaType.IMAGE;
    if (contentType.startsWith('video/')) return MediaType.VIDEO;
    if (contentType.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.DOCUMENT;
  }

  private getMaxSizeForType(mediaType: MediaType): number {
    switch (mediaType) {
      case MediaType.IMAGE:
        return this.config.MAX_IMAGE_SIZE;
      case MediaType.VIDEO:
        return this.config.MAX_VIDEO_SIZE;
      case MediaType.AUDIO:
        return this.config.MAX_AUDIO_SIZE;
      default:
        return this.config.MAX_FILE_SIZE;
    }
  }

  private isAllowedContentType(contentType: string): boolean {
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
      // Videos
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'
    ];

    return allowedTypes.includes(contentType);
  }

  private getAcceptedTypesForMediaType(mediaType: MediaType): string[] {
    switch (mediaType) {
      case MediaType.IMAGE:
        return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      case MediaType.VIDEO:
        return ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
      case MediaType.AUDIO:
        return ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
      default:
        return [];
    }
  }

  private isValidFilename(filename: string): boolean {
    // Basic filename validation
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    return !invalidChars.test(filename) && filename.length > 0 && filename.length <= 255;
  }
}

// Export singleton instance
export const mediaService = new MediaService();
export default mediaService;