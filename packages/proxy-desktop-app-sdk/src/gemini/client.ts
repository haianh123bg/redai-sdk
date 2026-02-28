import type { RequestOptions } from '../shared/http.js';
import { BaseHttpClient } from '../shared/http.js';
import type { GeminiCompatibleRequest } from '../shared/types.js';

export class GeminiClient extends BaseHttpClient {
  // GET /v1beta/models
  getModels(options?: RequestOptions) {
    return this.requestRaw('GET', '/v1beta/models', undefined, options, 'access');
  }

  // POST /v1beta/models/*action
  postModelsAction(action: string, body: GeminiCompatibleRequest, options?: RequestOptions) {
    return this.requestRaw('POST', `/v1beta/models/${action}`, JSON.stringify(body), options, 'access');
  }

  // GET /v1beta/models/*action
  getModelsAction(action: string, query?: Record<string, string | number | boolean | undefined>, options?: RequestOptions) {
    return this.requestRaw('GET', `/v1beta/models/${action}`, undefined, { ...options, query }, 'access');
  }

  // POST /v1internal:method (localhost only)
  postV1Internal(method: string, body: GeminiCompatibleRequest, options?: RequestOptions) {
    return this.requestRaw('POST', `/v1internal:${method}`, JSON.stringify(body), options);
  }
}
