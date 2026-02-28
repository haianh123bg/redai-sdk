import axios, { AxiosInstance } from 'axios';
import {
  TikTokConfig,
  OAuthTokenResponse,
  RefreshTokenResponse,
  TikTokScope,
  TikTokAPIError,
} from '../types';

export class TikTokOAuth {
  private config: TikTokConfig;
  private httpClient: AxiosInstance;
  private readonly authUrl = 'https://www.tiktok.com/v2/auth/authorize/';
  private readonly tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

  constructor(config: TikTokConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://open.tiktokapis.com',
    };

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Generate authorization URL for OAuth flow
   * @param scopes - Array of requested scopes
   * @param state - Anti-CSRF state token (recommended)
   * @returns Authorization URL
   */
  getAuthorizationUrl(scopes: TikTokScope[], state?: string): string {
    const params = new URLSearchParams({
      client_key: this.config.clientKey,
      scope: scopes.join(','),
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.authUrl}?${params.toString()}`;
  }

  /**
   * Generate random state token for CSRF protection
   * @returns Random state string
   */
  generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Exchange authorization code for access token
   * @param code - Authorization code from callback
   * @returns Token response with access token and refresh token
   */
  async getAccessToken(code: string): Promise<OAuthTokenResponse> {
    try {
      const params = new URLSearchParams({
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      });

      const response = await this.httpClient.post<OAuthTokenResponse>(
        this.tokenUrl,
        params.toString()
      );

      if (response.data.access_token) {
        return response.data;
      }

      throw new Error('Failed to get access token');
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Refresh an expired access token
   * @param refreshToken - Refresh token from previous token response
   * @returns New token response
   */
  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const params = new URLSearchParams({
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const response = await this.httpClient.post<RefreshTokenResponse>(
        this.tokenUrl,
        params.toString()
      );

      if (response.data.access_token) {
        return response.data;
      }

      throw new Error('Failed to refresh access token');
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Revoke an access token
   * @param accessToken - Access token to revoke
   */
  async revokeToken(accessToken: string): Promise<void> {
    try {
      const params = new URLSearchParams({
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        token: accessToken,
      });

      await this.httpClient.post('/v2/oauth/revoke/', params.toString());
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Get client access token for app-level operations
   * Note: Client access tokens have limited scope
   */
  async getClientAccessToken(): Promise<{ access_token: string; expires_in: number }> {
    try {
      const params = new URLSearchParams({
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        grant_type: 'client_credentials',
      });

      const response = await this.httpClient.post<{
        access_token: string;
        expires_in: number;
      }>(this.tokenUrl, params.toString());

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new TikTokAPIError(error.response.data.error);
      }
      throw error;
    }
  }
}
