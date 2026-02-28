import axios, { AxiosInstance } from 'axios';
import {
  UserInfoResponse,
  VideoListResponse,
  VideoQueryResponse,
  TikTokAPIError,
} from '../types';

export class TikTokDisplayAPI {
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
   * Get user information
   * Required scope: user.info.basic
   * @param accessToken - User access token
   * @param fields - Optional array of fields to retrieve
   * @returns User information
   */
  async getUserInfo(
    accessToken: string,
    fields?: string[]
  ): Promise<UserInfoResponse['data']['user']> {
    try {
      const defaultFields = [
        'open_id',
        'union_id',
        'avatar_url',
        'avatar_url_100',
        'avatar_large_url',
        'display_name',
        'bio_description',
        'profile_deep_link',
        'is_verified',
        'follower_count',
        'following_count',
        'likes_count',
        'video_count',
      ];

      const response = await this.httpClient.get<UserInfoResponse>('/v2/user/info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: (fields || defaultFields).join(','),
        },
      });

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data.user;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Get list of user's videos
   * Required scope: video.list
   * @param accessToken - User access token
   * @param options - Query options (cursor, max_count)
   * @returns List of videos with pagination info
   */
  async getVideoList(
    accessToken: string,
    options?: {
      cursor?: number;
      max_count?: number;
      fields?: string[];
    }
  ): Promise<VideoListResponse['data']> {
    try {
      const defaultFields = [
        'id',
        'create_time',
        'cover_image_url',
        'share_url',
        'video_description',
        'duration',
        'height',
        'width',
        'title',
        'embed_html',
        'embed_link',
        'like_count',
        'comment_count',
        'share_count',
        'view_count',
      ];

      const response = await this.httpClient.post<VideoListResponse>(
        '/v2/video/list/',
        {
          max_count: options?.max_count || 20,
          cursor: options?.cursor || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            fields: (options?.fields || defaultFields).join(','),
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
   * Query specific videos by IDs
   * Required scope: video.list
   * @param accessToken - User access token
   * @param videoIds - Array of video IDs to query
   * @param fields - Optional array of fields to retrieve
   * @returns Video information
   */
  async queryVideos(
    accessToken: string,
    videoIds: string[],
    fields?: string[]
  ): Promise<VideoQueryResponse['data']['videos']> {
    try {
      const defaultFields = [
        'id',
        'create_time',
        'cover_image_url',
        'share_url',
        'video_description',
        'duration',
        'height',
        'width',
        'title',
        'embed_html',
        'embed_link',
        'like_count',
        'comment_count',
        'share_count',
        'view_count',
      ];

      const response = await this.httpClient.post<VideoQueryResponse>(
        '/v2/video/query/',
        {
          filters: {
            video_ids: videoIds,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            fields: (fields || defaultFields).join(','),
          },
        }
      );

      if (response.data.error) {
        throw new TikTokAPIError(response.data.error);
      }

      return response.data.data.videos;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }
}
