import type { RequestOptions } from '../shared/http.js';
import { BaseHttpClient } from '../shared/http.js';
import type {
  CliproxyAuthsQuery,
  CliproxyAuthsResponse,
  CliproxyChatRequest,
  CliproxyModelsQuery,
  CliproxyModelsResponse,
  KeepAliveResponse,
  RootResponse
} from '../shared/types.js';

export class CliproxyClient extends BaseHttpClient {
  // GET /
  getRoot() {
    return this.requestJson<RootResponse>('GET', '/');
  }

  // GET /management.html
  getManagementHtml() {
    return this.requestRaw('GET', '/management.html');
  }

  // GET /keep-alive (local password if configured)
  keepAlive() {
    return this.requestJson<KeepAliveResponse>('GET', '/keep-alive', undefined, undefined, 'local');
  }

  // OAuth callbacks
  anthropicCallback(query: { code?: string; state?: string; error?: string; error_description?: string }) {
    return this.requestRaw('GET', '/anthropic/callback', undefined, { query });
  }

  codexCallback(query: { code?: string; state?: string; error?: string; error_description?: string }) {
    return this.requestRaw('GET', '/codex/callback', undefined, { query });
  }

  googleCallback(query: { code?: string; state?: string; error?: string; error_description?: string }) {
    return this.requestRaw('GET', '/google/callback', undefined, { query });
  }

  iflowCallback(query: { code?: string; state?: string; error?: string; error_description?: string }) {
    return this.requestRaw('GET', '/iflow/callback', undefined, { query });
  }

  antigravityCallback(query: { code?: string; state?: string; error?: string; error_description?: string }) {
    return this.requestRaw('GET', '/antigravity/callback', undefined, { query });
  }

  // GET /v1/cliproxy/auths
  getCliproxyAuths(query?: CliproxyAuthsQuery) {
    return this.requestJson<CliproxyAuthsResponse>(
      'GET',
      '/v1/cliproxy/auths',
      undefined,
      { query: query as Record<string, string | number | boolean | undefined> },
      'access'
    );
  }

  // GET /v1/cliproxy/models
  getCliproxyModels(query?: CliproxyModelsQuery) {
    return this.requestJson<CliproxyModelsResponse>(
      'GET',
      '/v1/cliproxy/models',
      undefined,
      { query: query as Record<string, string | number | boolean | undefined> },
      'access'
    );
  }

  // POST /v1/cliproxy/chat
  postCliproxyChat(body: CliproxyChatRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/cliproxy/chat', JSON.stringify(body), options, 'access');
  }
}
