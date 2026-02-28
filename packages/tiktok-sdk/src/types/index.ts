/**
 * TikTok SDK Types and Interfaces
 */

// Configuration Types
export interface TikTokConfig {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl?: string;
}

// OAuth Types
export interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  open_id: string;
  scope: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  open_id: string;
  scope: string;
  token_type: string;
}

export type TikTokScope =
  | 'user.info.basic'
  | 'user.info.profile'
  | 'user.info.stats'
  | 'video.list'
  | 'video.publish'
  | 'video.upload';

// User Info Types
export interface UserInfo {
  open_id: string;
  union_id?: string;
  avatar_url?: string;
  avatar_url_100?: string;
  avatar_large_url?: string;
  display_name?: string;
  bio_description?: string;
  profile_deep_link?: string;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

export interface UserInfoResponse {
  data: {
    user: UserInfo;
  };
  error: TikTokError;
}

// Video Types
export interface Video {
  id: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  title: string;
  embed_html: string;
  embed_link: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
}

export interface VideoListResponse {
  data: {
    videos: Video[];
    cursor: number;
    has_more: boolean;
  };
  error: TikTokError;
}

export interface VideoQueryResponse {
  data: {
    videos: Video[];
  };
  error: TikTokError;
}

// Content Posting Types
export interface CreatorInfo {
  creator_avatar_url: string;
  creator_username: string;
  creator_nickname: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
}

export interface CreatorInfoResponse {
  data: CreatorInfo;
  error: TikTokError;
}

export interface VideoInitRequest {
  post_info: {
    title?: string;
    privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
    disable_duet?: boolean;
    disable_comment?: boolean;
    disable_stitch?: boolean;
    video_cover_timestamp_ms?: number;
    brand_content_toggle?: boolean;
    brand_organic_toggle?: boolean;
  };
  source_info: {
    source: 'FILE_UPLOAD' | 'PULL_FROM_URL';
    video_url?: string;
    video_size?: number;
    chunk_size?: number;
    total_chunk_count?: number;
  };
}

export interface VideoInitResponse {
  data: {
    publish_id: string;
    upload_url?: string;
  };
  error: TikTokError;
}

export interface ContentInitRequest {
  post_info: {
    title?: string;
    privacy_level?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
    disable_duet?: boolean;
    disable_comment?: boolean;
    disable_stitch?: boolean;
  };
  source_info: {
    source: 'PULL_FROM_URL';
    photo_cover_index?: number;
    photo_images: string[];
  };
  post_mode?: 'DIRECT_POST' | 'MEDIA_UPLOAD';
  media_type: 'PHOTO';
}

export interface ContentInitResponse {
  data: {
    publish_id: string;
  };
  error: TikTokError;
}

export interface PublishStatusResponse {
  data: {
    status: 'PROCESSING_UPLOAD' | 'PROCESSING_DOWNLOAD' | 'PUBLISH_COMPLETE' | 'FAILED';
    publicaly_available_post_id?: string[];
    privately_available_post_id?: string[];
    fail_reason?: string;
  };
  error: TikTokError;
}

// Error Types
export interface TikTokError {
  code: string;
  message: string;
  log_id: string;
}

export class TikTokAPIError extends Error {
  code: string;
  logId: string;

  constructor(error: TikTokError) {
    super(error.message);
    this.name = 'TikTokAPIError';
    this.code = error.code;
    this.logId = error.log_id;
  }
}

// API Request Options
export interface RequestOptions {
  accessToken?: string;
  openId?: string;
}
