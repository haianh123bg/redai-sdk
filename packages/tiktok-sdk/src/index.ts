/**
 * TikTok SDK for TypeScript/Node.js
 * A comprehensive SDK for integrating TikTok API in backend applications
 */

import { TikTokOAuth } from './auth/oauth';
import { TikTokDisplayAPI } from './api/display';
import { TikTokContentPostingAPI } from './api/content-posting';
import { TikTokConfig } from './types';

export class TikTokSDK {
  public readonly oauth: TikTokOAuth;
  public readonly display: TikTokDisplayAPI;
  public readonly contentPosting: TikTokContentPostingAPI;

  constructor(config: TikTokConfig) {
    const baseUrl = config.baseUrl || 'https://open.tiktokapis.com';

    this.oauth = new TikTokOAuth(config);
    this.display = new TikTokDisplayAPI(baseUrl);
    this.contentPosting = new TikTokContentPostingAPI(baseUrl);
  }
}

// Export all types and classes
export * from './types';
export { TikTokOAuth } from './auth/oauth';
export { TikTokDisplayAPI } from './api/display';
export { TikTokContentPostingAPI } from './api/content-posting';

// Export utilities
export * as helpers from './utils/helpers';

// Export default
export default TikTokSDK;
