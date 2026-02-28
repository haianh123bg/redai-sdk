import type { RequestOptions } from '../shared/http.js';
import { BaseHttpClient } from '../shared/http.js';
import type { ClaudeMessagesRequest, ModelListResponse } from '../shared/types.js';

export class ClaudeClient extends BaseHttpClient {
  // GET /v1/models (Claude response when User-Agent starts with "claude-cli")
  getModels(options?: RequestOptions) {
    const headers = { ...(options?.headers ?? {}), 'User-Agent': 'claude-cli' };
    return this.requestJson<ModelListResponse>('GET', '/v1/models', undefined, { ...options, headers }, 'access');
  }

  // POST /v1/messages
  postMessages(body: ClaudeMessagesRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/messages', JSON.stringify(body), options, 'access');
  }

  // POST /v1/messages/count_tokens
  postMessagesCountTokens(body: ClaudeMessagesRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/messages/count_tokens', JSON.stringify(body), options, 'access');
  }
}
