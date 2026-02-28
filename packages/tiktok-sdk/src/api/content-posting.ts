import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import {
  CreatorInfoResponse,
  VideoInitRequest,
  VideoInitResponse,
  ContentInitRequest,
  ContentInitResponse,
  PublishStatusResponse,
  TikTokAPIError,
} from '../types';

export class TikTokContentPostingAPI {
  private httpClient: AxiosInstance;

  constructor(baseUrl: string = 'https://open.tiktokapis.com') {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Query creator info and posting capabilities
   * Required scope: video.publish
   * @param accessToken - User access token
   * @returns Creator information and settings
   */
  async getCreatorInfo(accessToken: string): Promise<CreatorInfoResponse['data']> {
    try {
      const response = await this.httpClient.post<CreatorInfoResponse>(
        '/v2/post/publish/creator_info/query/',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Initialize video upload
   * Required scope: video.publish, video.upload
   * @param accessToken - User access token
   * @param request - Video initialization request
   * @returns Publish ID and upload URL (if FILE_UPLOAD)
   */
  async initializeVideoUpload(
    accessToken: string,
    request: VideoInitRequest
  ): Promise<VideoInitResponse['data']> {
    try {
      const response = await this.httpClient.post<VideoInitResponse>(
        '/v2/post/publish/video/init/',
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Upload video file in chunks
   * @param uploadUrl - Upload URL from initializeVideoUpload
   * @param filePath - Local file path or Buffer
   * @param chunkSize - Size of each chunk (default: 10MB)
   */
  async uploadVideoFile(
    uploadUrl: string,
    filePath: string | Buffer,
    chunkSize: number = 10 * 1024 * 1024
  ): Promise<void> {
    try {
      let fileBuffer: Buffer;

      if (typeof filePath === 'string') {
        fileBuffer = fs.readFileSync(filePath);
      } else {
        fileBuffer = filePath;
      }

      const totalSize = fileBuffer.length;
      const totalChunks = Math.ceil(totalSize / chunkSize);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = fileBuffer.slice(start, end);

        await axios.put(uploadUrl, chunk, {
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes ${start}-${end - 1}/${totalSize}`,
            'Content-Length': chunk.length.toString(),
          },
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }
  }

  /**
   * Initialize photo/content upload
   * Required scope: video.publish
   * @param accessToken - User access token
   * @param request - Content initialization request
   * @returns Publish ID
   */
  async initializeContentUpload(
    accessToken: string,
    request: ContentInitRequest
  ): Promise<ContentInitResponse['data']> {
    try {
      const response = await this.httpClient.post<ContentInitResponse>(
        '/v2/post/publish/content/init/',
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Check publishing status
   * @param accessToken - User access token
   * @param publishId - Publish ID from initialization
   * @returns Status information
   */
  async getPublishStatus(
    accessToken: string,
    publishId: string
  ): Promise<PublishStatusResponse['data']> {
    try {
      const response = await this.httpClient.post<PublishStatusResponse>(
        '/v2/post/publish/status/fetch/',
        {
          publish_id: publishId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Helper method to publish video from file
   * @param accessToken - User access token
   * @param filePath - Local file path or Buffer
   * @param postInfo - Post information (title, privacy, etc.)
   * @returns Publish ID
   */
  async publishVideoFromFile(
    accessToken: string,
    filePath: string | Buffer,
    postInfo: VideoInitRequest['post_info']
  ): Promise<string> {
    let fileSize: number;

    if (typeof filePath === 'string') {
      const stats = fs.statSync(filePath);
      fileSize = stats.size;
    } else {
      fileSize = filePath.length;
    }

    const chunkSize = 10 * 1024 * 1024; // 10MB
    const totalChunks = Math.ceil(fileSize / chunkSize);

    // Initialize upload
    const initResponse = await this.initializeVideoUpload(accessToken, {
      post_info: postInfo,
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: fileSize,
        chunk_size: chunkSize,
        total_chunk_count: totalChunks,
      },
    });

    // Upload file
    if (initResponse.upload_url) {
      await this.uploadVideoFile(initResponse.upload_url, filePath, chunkSize);
    }

    return initResponse.publish_id;
  }

  /**
   * Helper method to publish video from URL
   * @param accessToken - User access token
   * @param videoUrl - Public URL of video
   * @param postInfo - Post information (title, privacy, etc.)
   * @returns Publish ID
   */
  async publishVideoFromUrl(
    accessToken: string,
    videoUrl: string,
    postInfo: VideoInitRequest['post_info']
  ): Promise<string> {
    const initResponse = await this.initializeVideoUpload(accessToken, {
      post_info: postInfo,
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
      },
    });

    return initResponse.publish_id;
  }

  /**
   * Helper method to publish photo content from URLs
   * @param accessToken - User access token
   * @param photoUrls - Array of public image URLs
   * @param postInfo - Post information (title, privacy, etc.)
   * @param coverIndex - Index of photo to use as cover (default: 0)
   * @returns Publish ID
   */
  async publishPhotoContent(
    accessToken: string,
    photoUrls: string[],
    postInfo: ContentInitRequest['post_info'],
    coverIndex: number = 0
  ): Promise<string> {
    const initResponse = await this.initializeContentUpload(accessToken, {
      post_info: postInfo,
      source_info: {
        source: 'PULL_FROM_URL',
        photo_images: photoUrls,
        photo_cover_index: coverIndex,
      },
      media_type: 'PHOTO',
    });

    return initResponse.publish_id;
  }
}
