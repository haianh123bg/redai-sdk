/**
 * Helper utilities for TikTok SDK
 */

/**
 * Check if an access token is expired or about to expire
 * @param expiresAt - Timestamp when token expires (in milliseconds)
 * @param bufferSeconds - Buffer time before expiry to consider token expired (default: 300s = 5 minutes)
 * @returns true if token is expired or about to expire
 */
export function isTokenExpired(expiresAt: number, bufferSeconds: number = 300): boolean {
  const now = Date.now();
  const expiryWithBuffer = expiresAt - bufferSeconds * 1000;
  return now >= expiryWithBuffer;
}

/**
 * Calculate expiry timestamp from expires_in value
 * @param expiresIn - Seconds until expiration
 * @returns Timestamp when token will expire (in milliseconds)
 */
export function calculateExpiryTimestamp(expiresIn: number): number {
  return Date.now() + expiresIn * 1000;
}

/**
 * Validate TikTok state token format
 * @param state - State token to validate
 * @returns true if state token appears valid
 */
export function isValidStateToken(state: string): boolean {
  // State tokens should be alphanumeric and have reasonable length
  return /^[a-zA-Z0-9]{10,}$/.test(state);
}

/**
 * Parse TikTok video ID from various URL formats
 * @param url - TikTok video URL
 * @returns Video ID or null if not found
 */
export function parseVideoIdFromUrl(url: string): string | null {
  // Handle different TikTok URL formats:
  // - https://www.tiktok.com/@username/video/1234567890123456789
  // - https://vm.tiktok.com/XXXXXXXXX/
  // - https://www.tiktok.com/v/1234567890123456789

  const patterns = [
    /\/video\/(\d+)/,
    /\/v\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Format duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "1:23" or "1:02:34")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format number with locale-specific formatting
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return num.toLocaleString(locale);
}

/**
 * Sleep/delay for specified milliseconds
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param initialDelay - Initial delay in ms (default: 1000)
 * @returns Result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Validate video file format
 * @param filename - File name or path
 * @returns true if file appears to be valid video format
 */
export function isValidVideoFormat(filename: string): boolean {
  const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return validExtensions.includes(ext);
}

/**
 * Validate image file format
 * @param filename - File name or path
 * @returns true if file appears to be valid image format
 */
export function isValidImageFormat(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return validExtensions.includes(ext);
}

/**
 * Sanitize text for TikTok post (remove invalid characters, limit length)
 * @param text - Text to sanitize
 * @param maxLength - Maximum length (default: 2200)
 * @returns Sanitized text
 */
export function sanitizePostText(text: string, maxLength: number = 2200): string {
  // Remove control characters but keep newlines
  let sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength - 3) + '...';
  }

  return sanitized.trim();
}

/**
 * Extract hashtags from text
 * @param text - Text to extract hashtags from
 * @returns Array of hashtags (without # symbol)
 */
export function extractHashtags(text: string): string[] {
  const hashtagPattern = /#([a-zA-Z0-9_]+)/g;
  const matches = text.matchAll(hashtagPattern);
  return Array.from(matches, match => match[1]);
}

/**
 * Build query string from object
 * @param params - Object with key-value pairs
 * @returns Query string (without leading ?)
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}
